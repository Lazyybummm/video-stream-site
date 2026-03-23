import pool from "../db.js"; 
import { Queue } from "bullmq";

const connection = { url: process.env.REDIS_URL };
const updateQueue = new Queue('update-request', { connection });

async function getlanding() {
    console.log("landing is hit");
    const CACHE_KEY = 'landing_data';
    const expirationLimit = 24 * 60 * 60 * 1000; 

    try {
        const before = Date.now();
        const cacheCheck = await pool.query(
            "SELECT data, updated_at FROM global_cache WHERE cache_key = $1",
            [CACHE_KEY]
        );
        const after = Date.now();

        if (cacheCheck.rows.length > 0) {
            const { data, updated_at } = cacheCheck.rows[0];
            const now = new Date();
            const isStale = (now - new Date(updated_at)) > expirationLimit;

            if (!isStale) {
                return typeof data === 'string' ? JSON.parse(data) : data;
            }

            console.log("Cache stale: Triggering background worker...");
            await updateQueue.add('update-request', {}, {
                removeOnComplete: true,
                attempts: 5,
                backoff: { type: 'exponential', delay: 1000 }
            });

            console.log("Serving stale data while worker updates...");
            return typeof data === 'string' ? JSON.parse(data) : data;
        }

        
        console.log("No cache found: Triggering first-time fetch...");
        await updateQueue.add('refresh-landing', {});
        return null; 
    } catch (error) {
        console.error("Cache/Queue Error:", error.message);
        throw error;
    }
}

export default getlanding;
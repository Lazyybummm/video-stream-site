import pool from "../db.js"; // Your Postgres pool
import axios from "axios";

async function getlanding(agent) {
    const CACHE_KEY = 'landing_data';

    try {
        
        const cacheCheck = await pool.query(
            "SELECT data, updated_at FROM global_cache WHERE cache_key = $1",
            [CACHE_KEY]
        );

        const now = new Date();
        const expirationLimit = 24 * 60 * 60 * 1000; // 24 hours

        if (cacheCheck.rows.length > 0) {
            const { data, updated_at } = cacheCheck.rows[0];
            if (now - new Date(updated_at) < expirationLimit) {
                console.log("Serving from Postgres Cache");
                // Ensure data is returned as an object/array if stored as JSON string
                return typeof data === 'string' ? JSON.parse(data) : data;
            }
        }

        console.log("Cache stale or missing, polling TMDB...");

        
        const config = {
            httpsAgent: agent, 
            timeout: 10000,
            headers: { Authorization: `Bearer ${process.env.TOKEN}` }
        };

        const [
            trendingtv, topRatedtv, populartv,
            trendingmovie, topRatedmovie, popularmovie
        ] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/trending/tv/day`, config),
            axios.get(`https://api.themoviedb.org/3/tv/top_rated`, config),
            axios.get(`https://api.themoviedb.org/3/tv/popular`, config),
            axios.get(`https://api.themoviedb.org/3/trending/movie/day`, config),
            axios.get(`https://api.themoviedb.org/3/movie/top_rated`, config),
            axios.get(`https://api.themoviedb.org/3/movie/popular`, config),
        ]);

        const responseData = [
            trendingtv.data.results,
            topRatedtv.data.results,
            populartv.data.results,
            trendingmovie.data.results,
            topRatedmovie.data.results,
            popularmovie.data.results
        ];

       
        await pool.query(
            `INSERT INTO global_cache (cache_key, data, updated_at) 
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (cache_key) 
             DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
            [CACHE_KEY, JSON.stringify(responseData)]
        );

        return responseData;

    } catch (error) {
        console.error("Cache/Fetch Error:", error.message);
        
        
        const fallback = await pool.query("SELECT data FROM global_cache WHERE cache_key = $1", [CACHE_KEY]);
        if (fallback.rows.length > 0) {
            const data = fallback.rows[0].data;
            return typeof data === 'string' ? JSON.parse(data) : data;
        }
        
        throw error;
    }
}

export default getlanding;

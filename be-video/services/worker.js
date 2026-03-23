import { Worker } from "bullmq";
import axios from "axios";
import pool from "../db.js";

const connection = { url: process.env.REDIS_URL };

const worker = new Worker('update-request', async (job) => {
    console.log("Worker: Refreshing TMDB data...");

    try {
        const config = {
            timeout: 15000, 
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
            trendingtv.data.results, topRatedtv.data.results, populartv.data.results,
            trendingmovie.data.results, topRatedmovie.data.results, popularmovie.data.results
        ];

        
        await pool.query(
            `INSERT INTO global_cache (cache_key, data, updated_at) 
             VALUES ('landing_data', $1, CURRENT_TIMESTAMP)
             ON CONFLICT (cache_key) 
             DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
            [JSON.stringify(responseData)]
        );

        console.log("Worker: Global cache successfully refreshed.");
    } catch (error) {
        console.error("Worker API Error:", error.message);
        throw error; 
    }
}, { connection });
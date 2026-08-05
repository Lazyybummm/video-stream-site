import axios from "axios";

async function getlanding() {
    const config = {
        timeout: 5000,
        headers: { 
            Authorization: `Bearer ${process.env.TOKEN}`,
            // These headers tell Cloudflare you are a normal browser, not a bot
            'Accept-Encoding': 'gzip, deflate, br',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    try {
        const [
            trendingtvRes, 
            topRatedtvRes, 
            populartvRes,
            trendingmovieRes, 
            topRatedmovieRes, 
            popularmovieRes
        ] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/trending/tv/day?language=en-US`, config),
            axios.get(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1`, config),
            axios.get(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`, config),
            axios.get(`https://api.themoviedb.org/3/trending/movie/day?language=en-US`, config),
            axios.get(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, config),
            axios.get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, config),
        ]);

        return {
            trendingTv: trendingtvRes.data.results || [],
            topRatedTv: topRatedtvRes.data.results || [],
            popularTv: populartvRes.data.results || [],
            trendingMovie: trendingmovieRes.data.results || [],
            topRatedMovie: topRatedmovieRes.data.results || [],
            popularMovie: popularmovieRes.data.results || []
        };
    } catch (error) {
        console.error("TMDB Landing Fetch Error:", error.message);
        throw error;
    }
}

export default getlanding;
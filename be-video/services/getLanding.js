import axios from "axios";

async function getlanding(agent) { // Receive the agent here
    const config = {
        httpsAgent: agent, // Use the persistent agent
        timeout: 10000,
        headers: { Authorization: `Bearer ${process.env.TOKEN}` }
    };

    const [
        trendingtvRes, topRatedtvRes, populartvRes,
        trendingmovieRes, topRatedmovieRes, popularmovieRes
    ] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/trending/tv/day`, config),
        axios.get(`https://api.themoviedb.org/3/tv/top_rated`, config),
        axios.get(`https://api.themoviedb.org/3/tv/popular`, config),
        axios.get(`https://api.themoviedb.org/3/trending/movie/day`, config),
        axios.get(`https://api.themoviedb.org/3/movie/top_rated`, config),
        axios.get(`https://api.themoviedb.org/3/movie/popular`, config),
    ]);

    return [
        trendingtvRes.data.results, 
        topRatedtvRes.data.results, 
        populartvRes.data.results,
        trendingmovieRes.data.results, 
        topRatedmovieRes.data.results, 
        popularmovieRes.data.results
    ];
}

export default getlanding;

import axios  from "axios";

async function getlanding(){
    const [trendingRes, topRatedRes, popularRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/trending/movie/day",{headers:{Authorization: `Bearer ${process.env.TOKEN}`} }),
        axios.get("https://api.themoviedb.org/3/movie/top_rated", {headers:{Authorization: `Bearer ${process.env.TOKEN}`} }),
        axios.get("https://api.themoviedb.org/3/movie/popular", {headers:{Authorization: `Bearer ${process.env.TOKEN}`} }),
      ]);
      return [trendingRes.data.results,topRatedRes.data.results,popularRes.data.results];
}
export default getlanding;
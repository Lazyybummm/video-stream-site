import express from "express"
import dotenv from "dotenv";
dotenv.config();
import axios from "axios"
import cors from "cors"
const app=express()
app.use(cors());
app.use(express.json());
let id_store=[{}]
let landing_store=[];
app.get("/landing",async (req,res)=>{
    const currentTime=Date.now();
    if(landing_store.length!=0){
        if(currentTime-landing_store[0].time>=900000){//24 hrs passed
    const [trendingRes, topRatedRes, popularRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/trending/movie/day", { headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk"} }),
        axios.get("https://api.themoviedb.org/3/movie/top_rated", { headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk"} }),
        axios.get("https://api.themoviedb.org/3/movie/popular", { headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk"} }),
      ]);

      landing_store[0]={time:currentTime,trending:trendingRes.data.results,top_rated:topRatedRes.data.results,popular:popularRes.data.results}
      res.json({
        trending:trendingRes.data.results,
        top_rated:topRatedRes.data.results,
        popular:popularRes.data.results
      })
        }
        else{
            res.json({
                trending:landing_store[0].trending,
                top_rated:landing_store[0].top_rated,
                popular:landing_store[0].popular
            })
        }
    }
    else{//a cache entry does'nt exist as of now , will only be hit once for landing(there will be atleast stale data in landing)
    //before making a request i'll query in my redis storage 
    //will resort to the tmdb api as the last solution
    const [trendingRes, topRatedRes, popularRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/trending/movie/day", { headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk"} }),
        axios.get("https://api.themoviedb.org/3/movie/top_rated", { headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk"} }),
        axios.get("https://api.themoviedb.org/3/movie/popular", { headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk"} }),
      ]);
      landing_store.push({time:currentTime,trending:trendingRes.data.results,top_rated:topRatedRes.data.results,popular:popularRes.data.results})
      
      res.json({
        trending:trendingRes.data.results,
        top_rated:topRatedRes.data.results,
        popular:popularRes.data.results
      })
    }
      
})
//what should essenntialy happen here is i should fire all the requests at once m once they are recieved at the frontend i'll keep it in memory them for a particular ttl 
//anyone hitting the site would check their in memory firsy , if not then redis if not the first person they would get it in redis 


app.get("/search",async (req,res)=>{
    let search_query=req.query.search_query//check the search query , it should be present and a string , convert it into lowercase 
    search_query=search_query.toLowerCase();
    const filter=id_store.filter((m)=>{return m.search_query==search_query})
    if(filter.length!=0){
        console.log("insid filter",filter);
       return res.send(filter[0].id);
    }
    //if not in filter then we'll resort to redis storage 
    else{
        console.log("inside else")
    const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${search_query}&include_adult=false&language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          },
        }
      );
    //id_store.push({search_query,id:response.data.results[0].id})//lowercase one should be pushed to optimize cache hits 
      return res.send(response.data.results)//right now we are only giving him the top choice
    }
})



app.get("/recc",async (req,res)=>{
    const id =req.query.id
    const response=await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations`,{
        headers:{
            Authorization: `Bearer ${process.env.TOKEN}`,
        }
    })
    res.send(response.data.results)
})

app.listen(3000);
import "dotenv/config";
import express, { json } from "express"
import pool from "./db.js";
import axios from "axios"
import https from "https"
import cors from "cors"
import getlanding from "./services/getLanding.js";
// import { Check } from "./cache/Redisops.js";
// import { Setex } from "./cache/Redisops.js";
// import redis from "./redisClient.js";

const app=express()
app.use(cors());
app.use(express.json());

const tmdbAgent = new https.Agent({ keepAlive: true });

let id_store=[]
let landing_store=[];

app.post("/signup",async (req,res)=>{
    
})

app.get("/landing",async (req,res)=>{
    //using layered caching : in memory->redis server -> api call
    const selectedMedia=req.query.selectedMedia
    const currentTime=Date.now()
    // const cached=await Check('landing')
    // if(landing_store[0] && landing_store[0].time-currentTime<900000){
    //     return res.json({
    //         trending:landing_store[0].trending,
    //         popular:landing_store[0].popular,
    //         top_rated:landing_store[0].top_rated
    //     })
    // }

    // if(cached!=null){
    //     landing_store[0]={time:currentTime,...cached}
    //     return res.send(cached)
    // }
    console.log("fetching from api")
    const data=await getlanding(tmdbAgent)
    // landing_store[0]={time:currentTime,...data}
    // await Setex('landing',3600,data)
    res.send(data);
})

app.get("/search",async (req,res)=>{
    let search_query=req.query.search_query//check the search query , it should be present and a string , convert it into lowercase 
    const selectedMedia=req.query.selectedMedia//make sure the frontend selects the same (either movie or tv)
    search_query=search_query.toLowerCase();
    const filter=id_store.filter((m)=>{return m.search_query==search_query})
    if(filter.length!=0){
        console.log("insid filter",filter);
       return res.send(filter[0].id);
    }
    //if not in filter then we'll resort to redis storage 
    else{
    const response = await axios.get(
        `https://api.themoviedb.org/3/search/${selectedMedia}?query=${search_query}&include_adult=false&language=en-US&page=1`,
        {
          httpsAgent: tmdbAgent,
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          }, 
        }
      );
        //id_store.push({search_query:search_query,id:response.data.results[0].id})//lowercase one should be pushed to optimize cache hits 
      return res.send(response.data.results)//right now we are only giving him the top choice
    }
})


app.get("/details",async(req,res)=>{
    const movie_id=req.query.id
    const selectedMedia=req.query.selectedMedia
    const response = await axios.get(
        `https://api.themoviedb.org/3/${selectedMedia}/${movie_id}`,
        {
          httpsAgent: tmdbAgent,
          headers: {
            Authorization: `Bearer ${process.env.TOKEN}`,
          }, 
        }
      );
    //   res.json({
    //     episode_count:response.data.number_of_episodes,
    //     season_count:response.data.number_of_seasons
    //   })
    
    res.send(response.data);
})



app.get("/recc",async (req,res)=>{
    const id =req.query.id
    let url
    const selectedMedia=req.query.selectedMedia
    selectedMedia=="movie"?url=`https://api.themoviedb.org/3/movie/${id}/recommendations`:url=`https://api.themoviedb.org/3/tv/${id}/recommendations`
    const response=await axios.get(url,{
        httpsAgent: tmdbAgent,
        headers:{
            Authorization: `Bearer ${process.env.TOKEN}`,
        }
    })
    res.send(response.data.results)
})

app.get("/watchlist",async (req,res)=>{
    //extract an id , fetch all the movies user has watched from the watchlist table , send their metadata s required to the user 
    const id=req.params.id//id is hardcoded for now 
    const response=await pool.query("SELECT * FROM watchlist WHERE user_id = 1 ORDER BY added_at DESC;")
    console.log(response);
    res.send(response.rows)//gonna return an array , will loop it up at the frontend 

})

app.post("/watchlist",async (req,res)=>{
    console.log("watchlist is hit")
    const metadata=req.body.metadata
    console.log("metadata:",metadata[0])
    const query = `
  INSERT INTO watchlist (user_id, movie_id, title, media_type, poster_path, release_date, metadata)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
`;
    const values = [
    1, 
    metadata[0].id, 
    metadata[0].title || metadata[0].name, 
    metadata[0].media_type || (metadata[0].first_air_date ? 'tv' : 'movie'), 
    metadata[0].poster_path, 
    metadata[0].release_date || metadata[0].first_air_date,
    JSON.stringify(metadata[0]) // This saves the whole object into the JSONB column
    ];
    const response=await pool.query(query,values);
   if(response.rowCount==1){
    return res.send("movie added to watchlist")
   }
   else{
    return res.send("some error occured try again later")
   }
})


app.listen(3000);
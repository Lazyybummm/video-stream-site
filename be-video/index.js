import express, { json } from "express"
import dotenv from "dotenv";
dotenv.config();
import axios from "axios"
import cors from "cors"
import getlanding from "./services/getLanding.js";
import { Check } from "./cache/Redisops.js";
import { Setex } from "./cache/Redisops.js";
const app=express()
app.use(cors());
app.use(express.json());
let id_store=[{}]
let landing_store=[];
app.get("/landing",async (req,res)=>{
    //using layered caching : in memory->redis server -> api call
    const currentTime=Date.now()
    const cached=await Check('landing')
    if(landing_store[0] && landing_store[0].time-currentTime<900000){
        return res.json({
            trending:landing_store[0].trending,
            popular:landing_store[0].popular,
            top_rated:landing_store[0].top_rated
        })
    }

    if(cached!=null){
        landing_store[0]={time:currentTime,...cached}
        return res.send(cached)
    }

    const data=await getlanding()
    landing_store[0]={time:currentTime,...data}
    await Setex('landing',3600,data)
    res.send(data);
})

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
        //id_store.push({search_query:search_query,id:response.data.results[0].id})//lowercase one should be pushed to optimize cache hits 
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
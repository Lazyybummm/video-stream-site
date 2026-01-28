import redis from "../redisClient.js";

export const Check=async (key)=>{
    const val=await redis.get(key)
    if(val){
        return JSON.parse(val)
    }
    else{
        return null
    }
}

export const Setex=async (key,duration,value)=>{
    await redis.setEx(key,duration,value);
}


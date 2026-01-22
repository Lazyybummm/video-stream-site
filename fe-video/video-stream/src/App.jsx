import { act, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Videoplayer from '../../components/videoPlayer'
import axios from "axios"
import Landing from '../../components/Landing'

function App() {
  const [id,setid]=useState(603)
  const input_ref=useRef();
  const [active,setactive]=useState('landing')
  async function conversion(movie_name){
    const response=await axios.get("https://api.themoviedb.org/3/search/movie?",{
      params:{
        query:movie_name,
        language:"en-US",
        includer_adult:"false"
      },
      headers:{
        Authorization:"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZWE2OGQ0MzgwZDBiNzk4OTU0ZTVhOTZhMWE4MjEwMCIsIm5iZiI6MTc2ODkxMTA0OS44ODIsInN1YiI6IjY5NmY3MGM5YmFlNTk5NDYzMzdhYmQyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._eY4rmwA3_XrpRYUUhlBwAJD6mbH73zY7Qfw5jcBmrk",
      }
    })
    setid(response.data.results[0].id);
    setbool(1);
  }
  return <>
  {/* <input  ref={input_ref} placeholder='enter movie name'></input>
  <button onClick={()=>{console.log(input_ref.current.value)
    conversion(input_ref.current.value)}}>submit</button>
  {bool?<Videoplayer tmdbid={id}></Videoplayer>:''} */}
  {active=='landing'?<Landing setactive={setactive} setid={setid}></Landing>:''}
  {active=="player"?<Videoplayer tmdbid={id}></Videoplayer>:''}
  </>
}

export default App

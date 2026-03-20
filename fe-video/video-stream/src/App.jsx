import { useState } from 'react'
import './App.css'
import Videoplayer from '../../components/videoPlayer'
import Landing from '../../components/Landing'
import Searchresults from '../../components/searchResults'

function App() {
  const [id, setid] = useState(null);
  const [results, setresults] = useState([]);
  const [active, setactive] = useState('landing');
  const [selectedMedia, setSelectedMedia] = useState('movie'); 

  return (
    <div className="App">
      {active === 'landing' && (
        <Landing 
          setactive={setactive} 
          setid={setid} 
          setresults={setresults}
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia} 
        />
      )}

      {active === "player" && (
        <Videoplayer 
          tmdbid={id} 
          setid={setid} 
          setactive={setactive}
          selectedMedia={selectedMedia} 
        />
      )}

      {active === "search" && (
        <Searchresults 
          setid={setid} 
          setactive={setactive} 
          results={results} 
          selectedMedia={selectedMedia}
        />
      )}
    </div>
  );
}

export default App;
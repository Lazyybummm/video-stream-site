import { useEffect, useState, useContext } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

// THE 3 MOST STABLE SERVERS
const VIDEO_SERVERS = [
  { 
    id: 'vidlink',
    name: "Server 1 (VidLink)", 
    getMovie: (id) => `https://vidlink.pro/movie/${id}`,
    getTv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`
  },
  { 
    id: 'videasy',
    name: "Server 2 (VidEasy)", 
    getMovie: (id) => `https://player.videasy.net/movie/${id}`,
    getTv: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}`
  },
  { 
    id: 'vidsrccc',
    name: "Server 3 (VidSrc.cc)", 
    getMovie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    getTv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  }
];

const Videoplayer = ({ tmdbid, setid, selectedMedia, setactive }) => {
  const { user } = useContext(AuthContext);
  const [showData, setShowData] = useState(null);
  const [seasonCount, setSeasonCount] = useState(1);
  const [episodeCount, setEpisodeCount] = useState(1);
  const [reccs, setReccs] = useState([]);
  const [toast, setToast] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // STATE: Track active server and VPN Toolkit visibility
  const [activeServer, setActiveServer] = useState(0);
  const [showVpnToolkit, setShowVpnToolkit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recRes = await api.get("/recc", { params: { id: tmdbid, selectedMedia: selectedMedia } });
        setReccs(recRes.data);

        if (selectedMedia === 'tv') {
          const detRes = await api.get("/details", { params: { id: tmdbid, selectedMedia: 'tv' } });
          setShowData(detRes.data);
          
          if (user) {
              try {
                  const progRes = await api.get(`/progress/${tmdbid}`);
                  if (progRes.data) {
                      setSeasonCount(progRes.data.current_season);
                      setEpisodeCount(progRes.data.current_episode);
                  }
              } catch (e) {
                  console.log("No previous progress found, starting at S1E1");
              }
          }
        }
      } catch (err) {
        console.error("Failed to fetch media data:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    
    setIsInitializing(true);
    fetchData();
    window.scrollTo(0, 0);
  }, [tmdbid, selectedMedia, user]);

  useEffect(() => {
    if (selectedMedia === 'tv' && user && !isInitializing) {
        api.put('/progress', {
            mediaId: tmdbid,
            mediaType: 'TV',
            season: seasonCount,
            episode: episodeCount
        }).catch(err => console.error("Silent save failed:", err));
    }
  }, [seasonCount, episodeCount, tmdbid, selectedMedia, user, isInitializing]);

  const addToWatchlist = async (m) => {
    try {
      await api.post("/watchlist", { 
          mediaId: m.id || m.mediaId, 
          mediaType: selectedMedia, 
          status: 'PLAN_TO_WATCH' 
      });
      setToast(`Added to My List`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) { 
      if (err.response && err.response.status === 409) {
          setToast("Already in your watchlist!");
          setTimeout(() => setToast(null), 3000);
      } else if (err.response && err.response.status === 401) {
          alert("Please log in to add movies to your watchlist!");
      }
    }
  };

  const currentSeason = showData?.seasons?.find(s => s.season_number === seasonCount);
  const totalEpisodes = currentSeason?.episode_count || 0;
  const currentProvider = VIDEO_SERVERS[activeServer];
  const iframeSrc = selectedMedia === 'movie' 
      ? currentProvider.getMovie(tmdbid) 
      : currentProvider.getTv(tmdbid, seasonCount, episodeCount);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: '100px 5% 50px' }}>
      
      {/* VPN TOOLKIT MODAL */}
      {showVpnToolkit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '12px', maxWidth: '500px', border: '1px solid #333', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <h2 style={{ color: '#E50914', marginBottom: '20px', fontWeight: '800' }}>Network Block Detected</h2>
            <p style={{ color: '#aaa', marginBottom: '30px', lineHeight: '1.6' }}>
                Your Internet Service Provider is currently blocking our media servers. To bypass this restriction and watch instantly, please install a free browser VPN extension.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <a href="https://chrome.google.com/webstore/detail/setupvpn-lifetime-free-vp/oofgbpoabipfcfjapgneajmecaagcnwv" target="_blank" rel="noreferrer" style={{ background: '#222', color: '#fff', padding: '15px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #444', transition: '0.2s' }}>
                    Install SetupVPN (Chrome Extension)
                </a>
                <a href="https://1.1.1.1/" target="_blank" rel="noreferrer" style={{ background: '#222', color: '#fff', padding: '15px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #444', transition: '0.2s' }}>
                    Use Cloudflare 1.1.1.1 (System Wide)
                </a>
            </div>
            <button onClick={() => setShowVpnToolkit(false)} style={{ background: '#E50914', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
                Close Toolkit
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#46d369', color: 'black', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', zIndex: 9999 }}>
          {toast}
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => setactive('landing')} style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700', opacity: 0.6 }}>
            ← BACK TO BROWSE
        </button>
        <button onClick={() => addToWatchlist({ id: tmdbid })} style={{ background: '#E50914', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(229, 9, 20, 0.4)' }}>
            + ADD CURRENT TO WATCHLIST
        </button>
      </div>

      <div className="player-glow" style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
        {!isInitializing && (
            <iframe 
              src={iframeSrc}
              style={{ width: '100%', aspectRatio: '21/9', border: 'none' }} 
              allowFullScreen 
            />
        )}
      </div>

      {/* THE CINEMATIC SERVER SWITCHER & VPN TRIGGER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '50px', padding: '20px', background: 'rgba(25, 25, 25, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ color: '#888', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Video Source:
          </span>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            {VIDEO_SERVERS.map((server, index) => (
              <button 
                key={server.id}
                onClick={() => setActiveServer(index)}
                style={{
                  background: activeServer === index ? '#E50914' : 'transparent',
                  color: activeServer === index ? '#fff' : '#aaa',
                  border: activeServer === index ? 'none' : '1px solid #444',
                  padding: '8px 18px',
                  borderRadius: '50px', 
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeServer === index ? '0 4px 15px rgba(229, 9, 20, 0.4)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {server.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* VPN Trigger Link */}
        <button 
            onClick={() => setShowVpnToolkit(true)} 
            style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#E50914', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: 0 }}
        >
            Servers still not loading? Click here to bypass ISP blocks.
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedMedia === 'tv' ? '1fr 350px' : '1fr', gap: '50px' }}>
        <div>
            {selectedMedia === 'tv' && showData && (
                <div style={{ marginBottom: '50px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '25px', fontWeight: '800' }}>Seasons</h3>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '20px' }}>
                        {showData.seasons.filter(s => s.season_number > 0).map(s => (
                        <button key={s.id} onClick={() => { setSeasonCount(s.season_number); setEpisodeCount(1); }}
                            style={{ padding: '12px 24px', background: seasonCount === s.season_number ? 'white' : '#1a1a1a', color: seasonCount === s.season_number ? 'black' : 'white', border: 'none', borderRadius: '4px', fontWeight: '800', cursor: 'pointer', transition: '0.3s' }}>
                            SEASON {s.season_number}
                        </button>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '24px', margin: '20px 0 25px', fontWeight: '800' }}>Episodes</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '10px' }}>
                        {[...Array(totalEpisodes)].map((_, i) => (
                        <button key={i} onClick={() => setEpisodeCount(i + 1)}
                            style={{ height: '50px', background: episodeCount === (i + 1) ? '#E50914' : '#111', color: '#fff', border: '1px solid #222', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>
                            {i + 1}
                        </button>
                        ))}
                    </div>
                </div>
            )}

            <h3 style={{ fontSize: '24px', marginBottom: '30px', fontWeight: '800' }}>MORE LIKE THIS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {reccs.slice(0, 12).map(m => (
                <div key={m.id} className="media-card" onClick={() => setid(m.id)} style={{ flex: 'none', minWidth: 'auto', width: '100%' }}>
                    <div className="poster-container" style={{ aspectRatio: '16/9' }}>
                        <img src={`https://image.tmdb.org/t/p/w500${m.backdrop_path || m.poster_path}`} style={{ width: '100%' }} />
                        <div className="poster-overlay">
                            <button onClick={(e) => { e.stopPropagation(); addToWatchlist(m); }} style={{ background: '#E50914', border: 'none', color: '#fff', fontSize: '12px', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                + ADD TO LIST
                            </button>
                        </div>
                    </div>
                    <div className="meta">
                        <p className="title">{m.title || m.name}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
export default Videoplayer;
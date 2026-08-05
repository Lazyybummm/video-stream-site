import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";

// EXPANDED TO 6 SERVERS (Combined from original and new screenshot requests)
const VIDEO_SERVERS = [
  { 
    id: 'vidlink',
    name: "VidLink", 
    getMovie: (id) => `https://vidlink.pro/movie/${id}`,
    getTv: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`
  },
  { 
    id: 'vidsrctop',
    name: "Vid-SrcTop", 
    getMovie: (id) => `https://vidsrc.net/embed/movie?tmdb=${id}`,
    getTv: (id, s, e) => `https://vidsrc.net/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
  },
  { 
    id: 'videasy',
    name: "VidEasy", 
    getMovie: (id) => `https://player.videasy.net/movie/${id}`,
    getTv: (id, s, e) => `https://player.videasy.net/tv/${id}/${s}/${e}`
  },
  { 
    id: 'vidsrc',
    name: "VidSrc", 
    getMovie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    getTv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'vidsrccc',
    name: "VidSrc.cc", 
    getMovie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    getTv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
  },
  { 
    id: 'superembed',
    name: "Backup", 
    getMovie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    getTv: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
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
  
  // PLAYER STATE ENGINE
  const [activeServer, setActiveServer] = useState(0);
  const [showVpnToolkit, setShowVpnToolkit] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [autoSwitchCount, setAutoSwitchCount] = useState(0);

  // 1. Fetch metadata
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
                  console.log("Starting at S1E1");
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tmdbid, selectedMedia, user]);

  // 2. Reset iframe load state when source changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [activeServer, tmdbid, seasonCount, episodeCount]);

  // 3. Automated Fallback Logic
  useEffect(() => {
    let timeout;
    // If the iframe hasn't loaded within 6 seconds, and we haven't already auto-switched 3 times
    if (!iframeLoaded && !isInitializing && autoSwitchCount < 3) {
      timeout = setTimeout(() => {
        const nextServer = (activeServer + 1) % VIDEO_SERVERS.length;
        setActiveServer(nextServer);
        setAutoSwitchCount(prev => prev + 1);
        
        setToast(`${VIDEO_SERVERS[activeServer].name} timed out. Auto-switching to ${VIDEO_SERVERS[nextServer].name}...`);
        setTimeout(() => setToast(null), 3500);
      }, 6000); 
    }
    return () => clearTimeout(timeout);
  }, [iframeLoaded, isInitializing, activeServer, autoSwitchCount]);

  // 4. Save watch progress
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
    <div style={{ background: '#050505', minHeight: '100vh', padding: '100px 5% 50px', color: '#fff' }}>
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(229, 9, 20, 0.9)', backdropFilter: 'blur(10px)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: '600', fontSize: '14px', zIndex: 9999, boxShadow: '0 10px 30px rgba(229,9,20,0.3)', transition: 'all 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* VPN TOOLKIT MODAL */}
      {showVpnToolkit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ background: '#111', padding: '40px', borderRadius: '16px', maxWidth: '450px', border: '1px solid #222', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.9)' }}>
            <h2 style={{ color: '#E50914', marginBottom: '15px', fontWeight: '800' }}>Network Block Detected</h2>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px', lineHeight: '1.6' }}>
                Your Internet Service Provider is blocking our media endpoints. To bypass this restriction, install a free VPN extension.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                <a href="https://chrome.google.com/webstore/detail/setupvpn-lifetime-free-vp/oofgbpoabipfcfjapgneajmecaagcnwv" target="_blank" rel="noreferrer" style={{ background: '#1a1a1a', color: '#fff', padding: '14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', border: '1px solid #333', fontSize: '14px' }}>
                    Install SetupVPN (Chrome)
                </a>
                <a href="https://1.1.1.1/" target="_blank" rel="noreferrer" style={{ background: '#1a1a1a', color: '#fff', padding: '14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', border: '1px solid #333', fontSize: '14px' }}>
                    Use Cloudflare WARP
                </a>
            </div>
            <button onClick={() => setShowVpnToolkit(false)} style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 30px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                Close Toolkit
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => setactive('landing')} style={{ background: 'none', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', opacity: 0.5, letterSpacing: '1px', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.5}>
            ← BROWSE
        </button>
        <button onClick={() => addToWatchlist({ id: tmdbid })} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s ease' }} onMouseOver={e => e.currentTarget.style.background = '#E50914'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            + ADD TO WATCHLIST
        </button>
      </div>

      {/* VIDEO PLAYER */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0a0a0a', border: '1px solid #1a1a1a', boxShadow: '0 30px 60px rgba(0,0,0,0.8)' }}>
        {!isInitializing && (
            <iframe 
              src={iframeSrc}
              onLoad={() => {
                setIframeLoaded(true);
                setAutoSwitchCount(0); // Reset fallback counter on success
              }}
              style={{ width: '100%', aspectRatio: '21/9', border: 'none', display: 'block' }} 
              allowFullScreen 
            />
        )}
      </div>

      {/* DECLUTTERED SERVER SWITCHER (FROSTED PILL UI) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '25px', marginBottom: '60px' }}>
        <p style={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', marginBottom: '12px' }}>
          If current server doesn't work, select another below
        </p>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '50px', padding: '6px', display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '100%' }}>
          {VIDEO_SERVERS.map((server, index) => (
            <button 
              key={server.id}
              onClick={() => {
                setActiveServer(index);
                setAutoSwitchCount(0); // Reset auto-switch if user manually clicks
              }}
              style={{
                background: activeServer === index ? '#E50914' : 'transparent',
                color: activeServer === index ? '#fff' : '#888',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '50px', 
                fontSize: '13px',
                fontWeight: activeServer === index ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {server.name}
            </button>
          ))}
        </div>
        
        <button 
            onClick={() => setShowVpnToolkit(true)} 
            style={{ marginTop: '20px', background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', fontWeight: '600', textDecoration: 'underline', transition: 'color 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#888'}
            onMouseOut={e => e.currentTarget.style.color = '#444'}
        >
            ISP blocking all servers? Click here.
        </button>
      </div>

      {/* EPISODE NAVIGATION & RECOMMENDATIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMedia === 'tv' ? '1fr 350px' : '1fr', gap: '60px' }}>
        <div>
            {selectedMedia === 'tv' && showData && (
                <div style={{ marginBottom: '50px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '700', letterSpacing: '1px' }}>SEASONS</h3>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
                        {showData.seasons.filter(s => s.season_number > 0).map(s => (
                        <button key={s.id} onClick={() => { setSeasonCount(s.season_number); setEpisodeCount(1); }}
                            style={{ padding: '10px 24px', background: seasonCount === s.season_number ? '#fff' : '#111', color: seasonCount === s.season_number ? '#000' : '#888', border: '1px solid', borderColor: seasonCount === s.season_number ? '#fff' : '#222', borderRadius: '50px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                            Season {s.season_number}
                        </button>
                        ))}
                    </div>

                    <h3 style={{ fontSize: '18px', margin: '30px 0 20px', fontWeight: '700', letterSpacing: '1px' }}>EPISODES</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '8px' }}>
                        {[...Array(totalEpisodes)].map((_, i) => (
                        <button key={i} onClick={() => setEpisodeCount(i + 1)}
                            style={{ height: '50px', background: episodeCount === (i + 1) ? '#E50914' : 'transparent', color: episodeCount === (i + 1) ? '#fff' : '#666', border: '1px solid', borderColor: episodeCount === (i + 1) ? '#E50914' : '#222', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {i + 1}
                        </button>
                        ))}
                    </div>
                </div>
            )}

            <h3 style={{ fontSize: '18px', marginBottom: '25px', fontWeight: '700', letterSpacing: '1px' }}>MORE LIKE THIS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {reccs.slice(0, 12).map(m => (
                <div key={m.id} className="media-card" onClick={() => setid(m.id)} style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}>
                    <div className="poster-container" style={{ aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        <img src={`https://image.tmdb.org/t/p/w500${m.backdrop_path || m.poster_path}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={m.title || m.name} />
                        <div className="poster-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button onClick={(e) => { e.stopPropagation(); addToWatchlist(m); }} style={{ background: '#E50914', border: 'none', color: '#fff', fontSize: '11px', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700' }}>
                                + ADD
                            </button>
                        </div>
                    </div>
                    <div style={{ padding: '10px 0' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#ccc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title || m.name}</p>
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
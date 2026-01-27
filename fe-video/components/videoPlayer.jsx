import axios from "axios";
import { useEffect, useState } from "react";

function Videoplayer({ tmdbid,setid}) {
  const [recc,setrecc]=useState(null);
  const url = "https://vidsrc-embed.ru/embed/movie/";
  const final_url = url.concat(tmdbid);
  useEffect(()=>{
    async function request(){
    const response=await axios.get("http://localhost:3000/recc",{
        params:{
          id:tmdbid
        }
    })
    setrecc(response.data)
  }
  request();
  },[tmdbid])
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Netflix-style header bar with enhanced gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
        zIndex: 100,
        padding: '0 4%',
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#e50914',
          letterSpacing: '-1.5px',
          textShadow: '0 2px 8px rgba(229, 9, 20, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '32px',
            background: '#e50914',
            borderRadius: '2px',
            boxShadow: '0 0 12px rgba(229, 9, 20, 0.6)'
          }}></div>
          MOVIEFLIX
        </div>
      </div>

      {/* Main content with improved spacing */}
      <div style={{
        paddingTop: '80px',
        minHeight: '100vh',
        width: '100%',
        padding: '120px 6% 60px 6%'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1800px',
          margin: '0 auto'
        }}>
          {/* Enhanced Video Container with premium styling */}
          <div style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#000',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}>
            {/* Subtle top gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }}></div>

            {/* 16:9 Aspect Ratio Container */}
            <div style={{
              position: 'relative',
              paddingTop: '56.25%',
              background: '#000'
            }}>
              <iframe
                src={final_url}
                title="Video Player"
                allowFullScreen
                frameBorder="0"
                referrerPolicy="origin"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
          </div>

          {/* Enhanced info bar with better visual hierarchy */}
          <div style={{
            marginTop: '40px',
            padding: '24px 28px',
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 100%)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              display: 'flex',
              gap: '28px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Now Playing indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                background: 'rgba(70, 211, 105, 0.12)',
                borderRadius: '20px',
                border: '1px solid rgba(70, 211, 105, 0.3)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#46d369',
                  boxShadow: '0 0 8px rgba(70, 211, 105, 0.6)',
                  animation: 'pulse 2s ease-in-out infinite'
                }}></div>
                <span style={{
                  fontSize: '13px',
                  color: '#46d369',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase'
                }}>
                  Now Playing
                </span>
              </div>

              {/* Divider */}
              <div style={{
                height: '24px',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)'
              }}></div>

              {/* HD Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  padding: '4px 10px',
                  background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(229, 9, 20, 0.1))',
                  border: '1px solid rgba(229, 9, 20, 0.4)',
                  borderRadius: '4px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e50914" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                    <polyline points="17 2 12 7 7 2"/>
                  </svg>
                </div>
                <span style={{
                  fontSize: '14px',
                  color: '#e5e5e5',
                  fontWeight: '500',
                  letterSpacing: '0.2px'
                }}>
                  HD Quality
                </span>
              </div>

              {/* Divider */}
              <div style={{
                height: '24px',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)'
              }}></div>

              {/* Audio indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  padding: '4px 10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="2.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                </div>
                <span style={{
                  fontSize: '14px',
                  color: '#e5e5e5',
                  fontWeight: '500',
                  letterSpacing: '0.2px'
                }}>
                  5.1 Surround
                </span>
              </div>
            </div>
          </div>

          {/* ======= Recommendations Section ======= */}
          {recc && recc.length > 0 && (
            <div style={{
              marginTop: '60px',
              width: '100%'
            }}>
              {/* Section Header */}
              <div style={{
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#e5e5e5',
                  letterSpacing: '-0.5px'
                }}>
                  More Like This
                </h2>
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #e50914 0%, transparent 100%)'
                }}></div>
              </div>

              {/* Horizontal Scrollable Container */}
              <div 
                className="recc-scroll-container"
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  paddingBottom: '20px',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {recc.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={()=>{setid(movie.id)}}
                    className="recc-card"
                    style={{
                      flex: '0 0 auto',
                      width: '280px',
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Movie Card */}
                    <div style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#1a1a1a',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative'
                    }}>
                      {/* Image Container */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '158px',
                        overflow: 'hidden',
                        background: '#000'
                      }}>
                        {movie.backdrop_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                            alt={movie.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              transition: 'transform 0.3s ease'
                            }}
                            className="recc-img"
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                          }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '70%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                          pointerEvents: 'none'
                        }}></div>

                        {/* Play icon overlay */}
                        <div 
                          className="play-icon"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'rgba(229, 9, 20, 0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                            border: '2px solid rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 4px 16px rgba(229, 9, 20, 0.6)'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>

                        {/* Rating badge */}
                        {movie.vote_average && (
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0, 0, 0, 0.85)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#ffd700'
                            }}>
                              {movie.vote_average.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Movie Info */}
                      <div style={{
                        padding: '14px 16px',
                        background: 'linear-gradient(to bottom, #1a1a1a 0%, #141414 100%)'
                      }}>
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#e5e5e5',
                          margin: '0 0 6px 0',
                          lineHeight: '1.3',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          letterSpacing: '-0.2px'
                        }}>
                          {movie.title}
                        </h3>

                        {movie.release_date && (
                          <p style={{
                            fontSize: '12px',
                            color: '#999',
                            margin: 0,
                            fontWeight: '500'
                          }}>
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}
                      </div>

                      {/* Bottom accent line */}
                      <div 
                        className="accent-line"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'linear-gradient(90deg, #e50914 0%, #ff2a2a 100%)',
                          transform: 'scaleX(0)',
                          transformOrigin: 'left',
                          transition: 'transform 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global styles including animations */}
      <style>
        {`
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            box-sizing: border-box;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(0.95);
            }
          }
          
          /* Custom scrollbar for recommendations */
          .recc-scroll-container::-webkit-scrollbar {
            height: 8px;
          }
          
          .recc-scroll-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
          }
          
          .recc-scroll-container::-webkit-scrollbar-thumb {
            background: rgba(229, 9, 20, 0.6);
            border-radius: 4px;
            transition: background 0.3s ease;
          }
          
          .recc-scroll-container::-webkit-scrollbar-thumb:hover {
            background: rgba(229, 9, 20, 0.8);
          }
          
          /* Hover effects for recommendation cards */
          .recc-card:hover {
            transform: translateY(-8px) scale(1.02);
          }
          
          .recc-card:hover .recc-img {
            transform: scale(1.1);
          }
          
          .recc-card:hover .play-icon {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          
          .recc-card:hover .accent-line {
            transform: scaleX(1);
          }
          
          /* Responsive adjustments */
          @media (max-width: 1200px) {
            div[style*="maxWidth: '1800px'"] {
              max-width: 95% !important;
            }
          }
          
          @media (max-width: 768px) {
            div[style*="fontSize: '32px'"] {
              font-size: 24px !important;
            }
            
            div[style*="padding: '120px"] {
              padding: 100px 4% 40px 4% !important;
            }
            
            .recc-card {
              width: 240px !important;
            }
          }
          
          @media (max-width: 480px) {
            .recc-card {
              width: 200px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Videoplayer;
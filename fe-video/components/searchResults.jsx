function Searchresults({results, setid, setactive}) {
    //map them the repsonse coming for a particular movie and when the use rselects show the player by accessing the id 
    return (
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 60px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        {/* Results Header */}
        <div style={{
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#e5e5e5',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Search Results
            <span style={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#808080',
              marginLeft: '12px'
            }}>
              {results.length} {results.length === 1 ? 'title' : 'titles'}
            </span>
          </h2>
        </div>
  
        {/* Results Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          {results.map((item, index) => {
            const posterUrl = item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : null;
            
            return (
              <div
                key={item.id}
                onClick={() => {
                  setid(item.id);
                  setactive('player');
                }}
                className="result-card"
                style={{
                  position: 'relative',
                  background: '#1a1a1a',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Poster Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '150%',
                  background: posterUrl 
                    ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${posterUrl})`
                    : 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  overflow: 'hidden'
                }}>
                  {/* Top gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
                    zIndex: 1
                  }}></div>
  
                  {/* Bottom gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                    zIndex: 1
                  }}></div>
  
                  {/* Index number on poster */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#e5e5e5',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    zIndex: 2,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    #{index + 1}
                  </div>
  
                  {/* Play button overlay */}
                  <div 
                    className="play-overlay"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(229, 9, 20, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      opacity: 0,
                      transition: 'all 0.3s ease',
                      border: '3px solid rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 4px 20px rgba(229, 9, 20, 0.6)'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
  
                  {/* Title overlay on image */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px 16px 16px 16px',
                    zIndex: 2
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#e5e5e5',
                      margin: 0,
                      lineHeight: '1.3',
                      letterSpacing: '-0.2px',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                    }}>
                      {item.title}
                    </h3>
  
                    {/* Additional info */}
                    {(item.release_date || item.vote_average) && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '8px'
                      }}>
                        {item.release_date && (
                          <span style={{
                            fontSize: '12px',
                            color: '#b3b3b3',
                            fontWeight: '500'
                          }}>
                            {new Date(item.release_date).getFullYear()}
                          </span>
                        )}
                        
                        {item.release_date && item.vote_average && (
                          <div style={{
                            width: '3px',
                            height: '3px',
                            borderRadius: '50%',
                            background: '#606060'
                          }}></div>
                        )}
                        
                        {item.vote_average && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span style={{
                              fontSize: '12px',
                              color: '#b3b3b3',
                              fontWeight: '600'
                            }}>
                              {item.vote_average.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
  
                  {/* No poster fallback icon */}
                  {!posterUrl && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      zIndex: 1,
                      opacity: 0.3
                    }}>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>
  
                {/* Red accent line at bottom */}
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
            );
          })}
        </div>
  
        {/* Empty state */}
        {results.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#808080'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.3
            }}>
              🔍
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '500',
              margin: '0 0 8px 0'
            }}>
              No results found
            </p>
            <p style={{
              fontSize: '14px',
              color: '#606060',
              margin: 0
            }}>
              Try searching for something else
            </p>
          </div>
        )}
  
        {/* Hover effects styles */}
        <style>
          {`
            .result-card:hover {
              transform: translateY(-8px) scale(1.03);
              border-color: rgba(229, 9, 20, 0.4);
              box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(229, 9, 20, 0.3);
            }
            
            .result-card:hover .play-overlay {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.1);
            }
            
            .result-card:hover .accent-line {
              transform: scaleX(1);
            }
            
            .result-card:active {
              transform: translateY(-4px) scale(1.02);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 16px !important;
              }
              
              div[style*="padding: '40px 60px'"] {
                padding: 20px !important;
              }
            }
            
            @media (max-width: 480px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: 1fr !important;
              }
            }
            
            @media (min-width: 769px) and (max-width: 1024px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            
            @media (min-width: 1400px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}
        </style>
      </div>
    );
  }
  
  export default Searchresults;
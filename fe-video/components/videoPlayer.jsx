function Videoplayer({ tmdbid }) {
    const url = "https://vidsrc-embed.ru/embed/movie/";
    const final_url = url.concat(tmdbid);
  
    return (
      <div style={{
        minHeight: '100vh',
        background: '#141414',
        position: 'relative'
      }}>
        {/* Netflix-style header bar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          zIndex: 100,
          padding: '0 4%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#e50914',
            letterSpacing: '-1px'
          }}>
            MOVIEFLIX
          </div>
        </div>

        {/* Main content */}
        <div style={{
          paddingTop: '70px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '70px 4% 40px 4%'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {/* Video Container */}
            <div style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 3px 10px rgba(0,0,0,0.75)'
            }}>
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

            {/* Info bar below video */}
            <div style={{
              marginTop: '30px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#46d369'
                }}></div>
                <span style={{
                  fontSize: '14px',
                  color: '#e5e5e5',
                  fontWeight: '500'
                }}>
                  Now Playing
                </span>
              </div>

              <div style={{
                height: '20px',
                width: '1px',
                background: 'rgba(255,255,255,0.2)'
              }}></div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                  <polyline points="17 2 12 7 7 2"/>
                </svg>
                <span style={{
                  fontSize: '14px',
                  color: '#e5e5e5',
                  fontWeight: '500'
                }}>
                  HD Available
                </span>
              </div>

              <div style={{
                height: '20px',
                width: '1px',
                background: 'rgba(255,255,255,0.2)'
              }}></div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
                <span style={{
                  fontSize: '14px',
                  color: '#e5e5e5',
                  fontWeight: '500'
                }}>
                  Surround Sound
                </span>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `}
        </style>
      </div>
    );
  }
  
  export default Videoplayer;
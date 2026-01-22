import axios from "axios";
import { useEffect, useState } from "react";

function Landing({ setid, setactive }) {
  const [trending, setTrending] = useState(null);
  const [topRated, setTopRated] = useState(null);
  const [popular, setPopular] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function trend_call() {
      const response = await axios.get("http://localhost:3000/landing");
      setTrending(response.data.trending);
      setTopRated(response.data.top_rated);
      setPopular(response.data.popular);
      setFeatured(response.data.trending[0]);
    }
    trend_call();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const response = await axios.get("http://localhost:3000/search", {
      params: {
        search_query: searchQuery,
      },
    });
    setid(response.data);
    setactive("player");
  };

  const renderMovieRow = (data, title) => {
    return (
      <div
        style={{
          position: "relative",
          zIndex: 5,
          padding: "0 4%",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "-0.4px",
            }}
          >
            {title}
          </h2>

          <div
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Scroll →
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: "18px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {data ? (
              data.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setid(item.id);
                      setactive("player");
                    }}
                    style={{
                      flex: "0 0 auto",
                      width: "290px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                      transition:
                        "transform 0.22s ease, border-color 0.22s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.borderColor =
                        "rgba(229, 9, 20, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0px)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "164px",
                          objectFit: "cover",
                          display: "block",
                          filter: "contrast(1.05) saturate(1.05)",
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: "60%",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.0) 100%)",
                        }}
                      />
                    </div>

                    <div style={{ padding: "12px 14px 14px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {item.release_date
                            ? new Date(item.release_date).getFullYear()
                            : "N/A"}
                        </span>

                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.10)",
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "rgba(255,255,255,0.72)",
                          }}
                        >
                          HD
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "rgba(255,255,255,0.92)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          letterSpacing: "-0.2px",
                        }}
                      >
                        {item.title}
                      </h3>

                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.55)",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: "1.45",
                        }}
                      >
                        {item.overview}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      flex: "0 0 auto",
                      width: "290px",
                      height: "250px",
                      borderRadius: "16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      {/* ======= Top Nav ======= */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "76px",
          zIndex: 200,
          padding: "0 4%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(10px)",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 70%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background:
                "radial-gradient(circle at 30% 30%, #ff2a2a 0%, #b50000 60%, #4b0000 100%)",
              boxShadow: "0 10px 30px rgba(229, 9, 20, 0.25)",
            }}
          />
          <div
            style={{
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "-0.6px",
              color: "#fff",
            }}
          >
            Movie<span style={{ color: "#e50914" }}>Flix</span>
          </div>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "999px",
              padding: "8px 12px",
              boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              style={{ opacity: 0.9 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              style={{
                width: "280px",
                padding: "8px 6px",
                fontSize: "14px",
                color: "#fff",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#fff",
              background: "#e50914",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "999px",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "transform 0.15s ease, background 0.2s ease",
              boxShadow: "0 16px 50px rgba(229, 9, 20, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ff0f1a";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#e50914";
              e.currentTarget.style.transform = "translateY(0px)";
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* ======= Hero ======= */}
      {featured && (
        <div
          style={{
            position: "relative",
            height: "88vh",
            minHeight: "560px",
            background: "#000",
            marginTop: "76px",
          }}
        >
          {/* Hero Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
              filter: "saturate(1.15) contrast(1.05)",
              transform: "scale(1.02)",
            }}
          />

          {/* Cineby-like overlays */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 20% 40%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.92) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 38%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 55%, #050505 100%)",
            }}
          />

          {/* Hero Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              padding: "0 4%",
              display: "flex",
              alignItems: "center",
              maxWidth: "1400px",
            }}
          >
            <div style={{ maxWidth: "720px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: "rgba(229,9,20,0.14)",
                    border: "1px solid rgba(229,9,20,0.25)",
                    color: "#ff3b45",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                  }}
                >
                  Featured
                </span>

                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {featured.release_date
                    ? new Date(featured.release_date).getFullYear()
                    : ""}
                </span>

                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.35)",
                  }}
                />

                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  HD
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 4.8vw, 74px)",
                  fontWeight: 900,
                  letterSpacing: "-1.2px",
                  lineHeight: 1.05,
                  textShadow: "0 12px 40px rgba(0,0,0,0.65)",
                }}
              >
                {featured.title}
              </h1>

              <p
                style={{
                  margin: "18px 0 28px 0",
                  maxWidth: "620px",
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.86)",
                  textShadow: "0 8px 26px rgba(0,0,0,0.6)",
                  display: "-webkit-box",
                  WebkitLineClamp: "4",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {featured.overview}
              </p>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => {
                    setid(featured.id);
                    setactive("player");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "12px 22px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.92)",
                    color: "#000",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "transform 0.15s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.92)";
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </button>

                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "12px 22px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.35)",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "transform 0.15s ease, background 0.2s ease",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.35)";
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======= Movie Rows ======= */}
      <div style={{ marginTop: featured ? "-170px" : "96px", paddingBottom: "70px" }}>
        {renderMovieRow(trending, "Trending Now")}
        {renderMovieRow(topRated, "Top Rated")}
        {renderMovieRow(popular, "Popular Movies")}
      </div>

      <style>
        {`
          div::-webkit-scrollbar { display: none; }
          * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        `}
      </style>
    </div>
  );
}

export default Landing;
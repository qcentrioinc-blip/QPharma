import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogs } from "../../data/blog";
import Footer from "../../Global/Footer";
 

export default function BlogPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "#96E8AD33",
          textAlign: "center",
          padding: "60px 24px 48px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "#547A3D33",
            color: "#15803d",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            padding: "4px 14px",
            borderRadius: "999px",
            marginBottom: "16px",
            border: "1px solid #bbf7d0",
          }}
        >
          Our blog
        </span>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            color: "#42307D",
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          Resources and insights
        </h1>
        <p style={{ color: "#547A3D", fontSize: "16px", margin: "0 0 32px" }}>
          The latest industry news, interviews, technologies, and resources.
        </p>

        {/* Search */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "0 16px",
            width: "100%",
            maxWidth: "380px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(9);
            }}
            style={{
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "#0f172a",
              padding: "12px 10px",
              width: "100%",
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {visible.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "16px" }}>
            No articles found.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "32px",
            }}
          >
            {visible.map((blog) => (
              <article
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.slug}`)}
                style={{
                  background: "#fff",
                  borderRadius: "4px",
                  overflow: "hidden",
                  boxShadow: "5px 1px 4px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  display: "flex",
                  padding: "10px",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 30px rgba(0,0,0,0.10)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", overflow: "hidden", height: "250px" }}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      padding:"14px",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Category */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6941C6",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    {blog.category}
                  </span>

                  {/* Title */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: 0,
                        lineHeight: "1.4",
                      }}
                    >
                      {blog.title}
                    </h2>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      lineHeight: "1.6",
                      margin: "0 0 20px",
                      flex: 1,
                    }}
                  >
                    {blog.excerpt}
                  </p>

                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#0f172a",
                          margin: 0,
                        }}
                      >
                        {blog.author.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                        {blog.date}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#374151",
                cursor: "pointer",
                transition: "background 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#f8fafc")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#fff")
              }
            >
              ↓ Load more
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}
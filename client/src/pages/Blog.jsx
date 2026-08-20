import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { api } from "../api/client.js";
import "./Blog.css";

export default function Blog() {
  const { t, tr } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts")
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page fade-in">
      <section className="page-head">
        <div className="container">
          <span className="kicker">{t("nav.blog")}</span>
          <h1 className="page-title">{t("nav.blog")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="empty-state">{t("common.loading")}</p>
          ) : (
            <div className="blog-list">
              {posts.map((p) => (
                <Link to={`/blog/${p.id}`} className="blog-row" key={p.id}>
                  <div className="blog-row-img">
                    <img src={p.image} alt="" loading="lazy" />
                  </div>
                  <div className="blog-row-body">
                    <span className="blog-date">{p.created_at.slice(0, 10)}</span>
                    <h2>{tr(p, "title_az")}</h2>
                    <p>{tr(p, "body_az").slice(0, 140)}…</p>
                    <span className="blog-read">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
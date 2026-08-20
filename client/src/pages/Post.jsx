import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { api } from "../api/client.js";

export default function Post() {
  const { id } = useParams();
  const { t, tr } = useLang();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then(setPost)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound)
    return (
      <div className="page" style={{ textAlign: "center", padding: "100px 24px" }}>
        <h1>404</h1>
        <p style={{ margin: "16px 0" }}>{t("common.loading")}</p>
        <Link to="/blog" className="btn btn-primary">{t("nav.blog")}</Link>
      </div>
    );

  if (!post) return <div className="spinner" />;

  return (
    <article className="page fade-in">
      <section className="page-head">
        <div className="container post-container">
          <span className="blog-date">{post.created_at.slice(0, 10)}</span>
          <h1 className="page-title">{tr(post, "title_az")}</h1>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container post-container">
          <img
            src={post.image}
            alt=""
            style={{ borderRadius: 24, aspectRatio: "16/8", objectFit: "cover", width: "100%", marginBottom: 40 }}
          />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {tr(post, "body_az")}
          </p>
          <Link to="/blog" className="btn btn-outline" style={{ marginTop: 48 }}>
            ← {t("nav.blog")}
          </Link>
        </div>
      </section>
    </article>
  );
}
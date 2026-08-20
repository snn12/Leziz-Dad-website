import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { api } from "../api/client.js";
import PackageCard from "../components/PackageCard.jsx";
import "./Home.css";

export default function Home() {
  const { t, tr } = useLang();
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/packages"),
      api.get("/reviews"),
      api.get("/posts"),
      api.get("/gallery"),
    ])
      .then(([p, r, po, g]) => {
        setPackages(p.slice(0, 3));
        setReviews(r.slice(0, 3));
        setPosts(po.slice(0, 3));
        setGallery(g.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="fade-in">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="kicker">{t("hero.badge")}</span>
            <h1 className="hero-title">{t("hero.title")}</h1>
            <p className="hero-sub">{t("hero.subtitle")}</p>
            <div className="hero-cta">
              <Link to="/paketler" className="btn btn-primary">
                {t("hero.cta")}
              </Link>
              <Link to="/elaqe" className="btn btn-outline">
                {t("hero.cta2")}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img main">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
                alt="Qəhvə"
              />
            </div>
            <div className="hero-img side">
              <img
                src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop"
                alt="Desert"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{t("home.featured")}</span>
            <h2 className="section-title">{t("home.featuredDesc")}</h2>
          </div>
          <div className="pkg-grid">
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
          <div className="home-more">
            <Link to="/paketler" className="btn btn-outline">
              {t("home.allPackages")} →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{t("home.whyTitle")}</span>
            <h2 className="section-title">{t("home.whyTitle")}</h2>
          </div>
          <div className="why-grid">
            {t("home.why").map((item, i) => (
              <div className="why-card" key={i}>
                <span className="why-num">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="kicker">{t("nav.gallery")}</span>
              <h2 className="section-title">{t("nav.gallery")}</h2>
            </div>
            <div className="gallery-grid">
              {gallery.map((g) => (
                <img key={g.id} src={g.image} alt={tr(g, "caption_az")} loading="lazy" />
              ))}
            </div>
            <div className="home-more">
              <Link to="/qalereya" className="btn btn-outline">
                {t("nav.gallery")} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <span className="kicker">{t("home.reviews")}</span>
              <h2 className="section-title">{t("home.reviews")}</h2>
            </div>
            <div className="review-grid">
              {reviews.map((r) => (
                <div className="review-card" key={r.id}>
                  <span className="stars">{"★".repeat(r.rating)}</span>
                  <p className="review-text">"{r.text}"</p>
                  <span className="review-name">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="kicker">{t("nav.blog")}</span>
              <h2 className="section-title">{t("nav.blog")}</h2>
            </div>
            <div className="blog-grid">
              {posts.map((p) => (
                <Link to={`/blog/${p.id}`} className="blog-card" key={p.id}>
                  <div className="blog-img">
                    <img src={p.image} alt="" loading="lazy" />
                  </div>
                  <div className="blog-body">
                    <h3>{tr(p, "title_az")}</h3>
                    <span className="blog-date">{p.created_at.slice(0, 10)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section cta-section">
        <div className="container cta-box">
          <h2 className="cta-title">{t("home.ctaTitle")}</h2>
          <p className="cta-desc">{t("home.ctaDesc")}</p>
          <Link to="/rezervasiya" className="btn btn-primary">
            {t("nav.reserve")}
          </Link>
        </div>
      </section>
    </div>
  );
}
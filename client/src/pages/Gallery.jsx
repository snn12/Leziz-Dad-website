import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { api } from "../api/client.js";
import "./Gallery.css";

export default function Gallery() {
  const { t, tr } = useLang();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api
      .get("/gallery")
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page fade-in">
      <section className="page-head">
        <div className="container">
          <span className="kicker">{t("nav.gallery")}</span>
          <h1 className="page-title">{t("nav.gallery")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <p className="empty-state">{t("common.loading")}</p>
          ) : (
            <div className="gallery-masonry">
              {items.map((g, i) => (
                <button
                  key={g.id}
                  className={`gallery-item ${i % 5 === 0 ? "tall" : i % 4 === 0 ? "wide" : ""}`}
                  onClick={() => setLightbox(g)}
                >
                  <img src={g.image} alt={tr(g, "caption_az")} loading="lazy" />
                  {g.caption_az && <span className="gallery-caption">{tr(g, "caption_az")}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox.image} alt="" />
          {lightbox.caption_az && <span className="lightbox-caption">{tr(lightbox, "caption_az")}</span>}
        </div>
      )}
    </div>
  );
}
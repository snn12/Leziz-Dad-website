import { useLang } from "../context/LanguageContext.jsx";
import "./About.css";

export default function About() {
  const { t } = useLang();

  return (
    <div className="page fade-in">
      <section className="page-head">
        <div className="container">
          <span className="kicker">{t("about.title")}</span>
          <h1 className="page-title">{t("about.title")}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-img">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop"
              alt="Leziz Dad"
            />
          </div>
          <div className="about-text">
            <p className="about-story">{t("about.story")}</p>
            <div className="stats">
              {t("about.stats").map((s, i) => (
                <div className="stat" key={i}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="kicker">{t("about.valuesTitle")}</span>
            <h2 className="section-title">{t("about.valuesTitle")}</h2>
          </div>
          <div className="why-grid">
            {t("about.values").map((v, i) => (
              <div className="why-card" key={i}>
                <span className="why-num">0{i + 1}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
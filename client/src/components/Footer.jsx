import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">L</span>
          <div>
            <div className="footer-name">{t("brand")}</div>
            <div className="footer-tag">{t("tagline")}</div>
          </div>
        </div>
        <div className="footer-links">
          <Link to="/">{t("nav.home")}</Link>
          <Link to="/paketler">{t("nav.packages")}</Link>
          <Link to="/blog">{t("nav.blog")}</Link>
          <Link to="/elaqe">{t("nav.contact")}</Link>
        </div>
        <div className="footer-meta">
          <p>{new Date().getFullYear()} © {t("brand")} — {t("footer.rights")}</p>
          <p className="footer-love">{t("footer.madeWith")} ♥ Bakı</p>
        </div>
      </div>
    </footer>
  );
}
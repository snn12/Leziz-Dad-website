import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./Navbar.css";

const LANGS = [
  { code: "az", label: "AZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/paketler", label: t("nav.packages") },
    { to: "/haqqimizda", label: t("nav.about") },
    { to: "/qalereya", label: t("nav.gallery") || "Qalereya" },
    { to: "/blog", label: t("nav.blog") || "Bloq" },
    { to: "/elaqe", label: t("nav.contact") },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">L</span>
          <span className="brand-text">
            <span className="brand-name">{t("brand")}</span>
            <span className="brand-tag">{t("tagline")}</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/rezervasiya" className="nav-link nav-reserve" onClick={() => setOpen(false)}>
            {t("nav.reserve") || "Rezervasiya"}
          </Link>
        </nav>

        <div className="nav-actions">
          <div className="lang-switch">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`lang-btn ${lang === l.code ? "active" : ""}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link to="/sebet" className="cart-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8.7a2 2 0 0 1-2-1.6L4.5 3H2" />
              <circle cx="9.5" cy="21" r="1.5" />
              <circle cx="17.5" cy="21" r="1.5" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name" title={user.email}>
                {user.name.split(" ")[0]}
              </span>
              {user.role === "admin" && (
                <Link to="/admin" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                  {t("nav.admin")}
                </Link>
              )}
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <Link to="/giris" className="btn btn-primary btn-sm login-btn">
              {t("nav.login")}
            </Link>
          )}

          <button
            className="burger"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <span className={open ? "bar bar1 open" : "bar bar1"} />
            <span className={open ? "bar bar2 open" : "bar bar2"} />
          </button>
        </div>
      </div>
    </header>
  );
}
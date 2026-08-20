import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { api } from "../api/client.js";
import PackageCard from "../components/PackageCard.jsx";
import "./Packages.css";

export default function Packages() {
  const { t } = useLang();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/packages")
      .then(setPackages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page fade-in">
      <section className="page-head">
        <div className="container">
          <span className="kicker">{t("packages.title")}</span>
          <h1 className="page-title">{t("packages.title")}</h1>
          <p className="page-sub">{t("packages.subtitle")}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {packages.length === 0 ? (
            <p className="empty-state">{t("packages.empty")}</p>
          ) : (
            <div className="pkg-grid">
              {packages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
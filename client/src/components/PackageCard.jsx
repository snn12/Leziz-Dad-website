import { useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./PackageCard.css";

export default function PackageCard({ pkg }) {
  const { t, tr, lang } = useLang();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const priceSymbol = lang === "en" ? "$" : "₼";

  const handleAdd = () => {
    add({
      id: pkg.id,
      package_id: pkg.id,
      name: tr(pkg, "name_az"),
      price: pkg.price,
      image: pkg.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="pkg-card">
      <div className="pkg-image">
        <img src={pkg.image} alt={tr(pkg, "name_az")} loading="lazy" />
      </div>
      <div className="pkg-body">
        <h3 className="pkg-name">{tr(pkg, "name_az")}</h3>
        <p className="pkg-desc">{tr(pkg, "desc_az")}</p>
        <div className="pkg-foot">
          <span className="pkg-price">
            {pkg.price} {priceSymbol}
          </span>
          <button
            className={`btn btn-primary btn-sm ${added ? "added" : ""}`}
            onClick={handleAdd}
          >
            {added ? t("packages.added") + " ✓" : t("packages.add")}
          </button>
        </div>
      </div>
    </article>
  );
}
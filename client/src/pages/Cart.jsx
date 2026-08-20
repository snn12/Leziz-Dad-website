import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import "./Cart.css";

export default function Cart() {
  const { t, lang } = useLang();
  const { items, remove, setQty, clear, total, count } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const priceSymbol = lang === "en" ? "$" : "₼";

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    payment_method: "cash",
    delivery: true,
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await api.post(
        "/orders",
        {
          user_id: user?.id,
          ...form,
          items: items.map((it) => ({
            package_id: it.package_id,
            name: it.name,
            price: it.price,
            qty: it.qty,
          })),
        },
        token
      );
      setStatus({ ok: true, msg: t("cart.orderSuccess") });
      clear();
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSending(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page fade-in">
        <section className="page-head">
          <div className="container">
            <h1 className="page-title">{t("cart.title")}</h1>
          </div>
        </section>
        <section className="section">
          <div className="container cart-empty">
            <p>{t("cart.empty")}</p>
            <p className="cart-empty-hint">{t("cart.emptyHint")}</p>
            <Link to="/paketler" className="btn btn-primary">
              {t("cart.browse")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <section className="page-head">
        <div className="container">
          <h1 className="page-title">{t("cart.title")}</h1>
          <p className="page-sub">
            {count} {t("cart.item")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cart-grid">
          <div className="cart-items">
            {items.map((it) => (
              <div className="cart-item" key={it.id}>
                <img src={it.image} alt={it.name} />
                <div className="cart-item-info">
                  <h3>{it.name}</h3>
                  <span className="cart-item-price">
                    {it.price} {priceSymbol}
                  </span>
                </div>
                <div className="qty-control">
                  <button onClick={() => setQty(it.id, it.qty - 1)}>−</button>
                  <span>{it.qty}</span>
                  <button onClick={() => setQty(it.id, it.qty + 1)}>+</button>
                </div>
                <span className="cart-item-total">
                  {it.price * it.qty} {priceSymbol}
                </span>
                <button className="cart-remove" onClick={() => remove(it.id)} title={t("cart.remove")}>
                  ✕
                </button>
              </div>
            ))}
            <div className="cart-total-line">
              <span>{t("cart.total")}:</span>
              <strong>
                {total} {priceSymbol}
              </strong>
            </div>
          </div>

          <form className="cart-checkout card" onSubmit={handleSubmit}>
            {status && (
              <div className={`alert ${status.ok ? "alert-success" : "alert-error"}`}>{status.msg}</div>
            )}
            <div className="field">
              <label>{t("cart.name")} *</label>
              <input name="customer_name" required value={form.customer_name} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("cart.phone")} *</label>
              <input name="customer_phone" required placeholder="+994" value={form.customer_phone} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("cart.email")}</label>
              <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("cart.delivery")}</label>
              <select
                name="delivery"
                value={form.delivery}
                onChange={(e) => setForm({ ...form, delivery: e.target.value === "true" })}
              >
                <option value="true">{t("cart.deliveryYes")}</option>
                <option value="false">{t("cart.deliveryNo")}</option>
              </select>
            </div>
            <div className="field">
              <label>{t("cart.payment")}</label>
              <select name="payment_method" value={form.payment_method} onChange={handleChange}>
                <option value="cash">{t("cart.paymentCash")}</option>
                <option value="card">{t("cart.paymentCard")}</option>
              </select>
            </div>
            <button className="btn btn-primary btn-block" disabled={sending}>
              {sending ? "..." : t("cart.placeOrder")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
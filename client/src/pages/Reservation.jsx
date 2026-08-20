import { useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import "./Reservation.css";

export default function Reservation() {
  const { t } = useLang();
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    date: "",
    time: "19:00",
    guests: 2,
    note: "",
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await api.post("/reservations", { user_id: user?.id, ...form }, token);
      setStatus({ ok: true, msg: t("reservation.success") });
      setForm({ customer_name: "", customer_phone: "", date: "", time: "19:00", guests: 2, note: "" });
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page fade-in">
      <section className="page-head">
        <div className="container">
          <span className="kicker">{t("nav.reserve")}</span>
          <h1 className="page-title">{t("nav.reserve")}</h1>
          <p className="page-sub">{t("reservation.subtitle")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container reserve-wrap">
          <form className="reserve-form card" onSubmit={handleSubmit}>
            {status && (
              <div className={`alert ${status.ok ? "alert-success" : "alert-error"}`}>{status.msg}</div>
            )}
            <div className="field">
              <label>{t("contact.name")} *</label>
              <input name="customer_name" required value={form.customer_name} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("contact.phone")} *</label>
              <input name="customer_phone" required placeholder="+994" value={form.customer_phone} onChange={handleChange} />
            </div>
            <div className="reserve-row">
              <div className="field">
                <label>{t("reservation.date")} *</label>
                <input name="date" type="date" required value={form.date} onChange={handleChange} />
              </div>
              <div className="field">
                <label>{t("reservation.time")} *</label>
                <input name="time" type="time" required value={form.time} onChange={handleChange} />
              </div>
              <div className="field">
                <label>{t("reservation.guests")}</label>
                <input name="guests" type="number" min="1" max="50" value={form.guests} onChange={handleChange} />
              </div>
            </div>
            <div className="field">
              <label>{t("reservation.note")}</label>
              <textarea name="note" value={form.note} onChange={handleChange} placeholder={t("reservation.notePlaceholder")} />
            </div>
            <button className="btn btn-primary btn-block" disabled={sending}>
              {sending ? "..." : t("reservation.submit")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
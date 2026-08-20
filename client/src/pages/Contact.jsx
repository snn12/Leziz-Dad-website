import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { api } from "../api/client.js";
import "./Contact.css";

export default function Contact() {
  const { t } = useLang();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/settings").then(setSettings).catch(console.error);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await api.post("/messages", form);
      setStatus({ ok: true, msg: t("contact.success") });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
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
          <span className="kicker">{t("contact.title")}</span>
          <h1 className="page-title">{t("contact.title")}</h1>
          <p className="page-sub">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <form className="contact-form card" onSubmit={handleSubmit}>
            {status && (
              <div className={`alert ${status.ok ? "alert-success" : "alert-error"}`}>{status.msg}</div>
            )}
            <div className="field">
              <label>{t("contact.name")} *</label>
              <input name="name" required value={form.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("contact.email")} *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("contact.phone")}</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("contact.subject")}</label>
              <input name="subject" value={form.subject} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t("contact.message")} *</label>
              <textarea name="message" required value={form.message} onChange={handleChange} />
            </div>
            <button className="btn btn-primary btn-block" disabled={sending}>
              {sending ? "..." : t("contact.send")}
            </button>
          </form>

          <div className="contact-info">
            <h2 className="contact-info-title">{t("contact.infoTitle")}</h2>
            <div className="info-item">
              <span className="info-label">{t("contact.address")}</span>
              <span className="info-value">{settings?.address || "—"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{t("contact.phoneLabel")}</span>
              <a className="info-value" href={`tel:${settings?.phone?.replace(/\s/g, "")}`}>
                {settings?.phone || "—"}
              </a>
            </div>
            <div className="info-item">
              <span className="info-label">{t("contact.emailLabel")}</span>
              <a className="info-value" href={`mailto:${settings?.email}`}>
                {settings?.email || "—"}
              </a>
            </div>
            <div className="info-item">
              <span className="info-label">{t("contact.hours")}</span>
              <span className="info-value">{settings?.workHours || "—"}</span>
            </div>
            {settings?.instagram && (
              <div className="info-item">
                <span className="info-label">Instagram</span>
                <a className="info-value" href={`https://instagram.com/${settings.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
                  {settings.instagram}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
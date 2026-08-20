import { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import "./Admin.css";

const TABS = ["packages", "orders", "reservations", "messages", "reviews", "posts", "gallery", "settings"];

function PackageForm({ initial, onSave, onCancel, t }) {
  const [form, setForm] = useState(
    initial || {
      name_az: "", name_en: "", name_ru: "",
      desc_az: "", desc_en: "", desc_ru: "",
      price: "", image: "", active: 1,
    }
  );
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="modal-form" onSubmit={submit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field"><label>{t("admin.nameAz")} *</label><input required value={form.name_az} onChange={set("name_az")} /></div>
      <div className="field"><label>{t("admin.nameEn")}</label><input value={form.name_en} onChange={set("name_en")} /></div>
      <div className="field"><label>{t("admin.nameRu")}</label><input value={form.name_ru} onChange={set("name_ru")} /></div>
      <div className="field"><label>{t("admin.descAz")} *</label><textarea required value={form.desc_az} onChange={set("desc_az")} /></div>
      <div className="field"><label>{t("admin.descEn")}</label><textarea value={form.desc_en} onChange={set("desc_en")} /></div>
      <div className="field"><label>{t("admin.descRu")}</label><textarea value={form.desc_ru} onChange={set("desc_ru")} /></div>
      <div className="modal-row">
        <div className="field"><label>{t("admin.price")} *</label><input required type="number" step="0.01" min="0" value={form.price} onChange={set("price")} /></div>
        <div className="field"><label>{t("admin.active")}</label><select value={form.active} onChange={(e) => setForm({ ...form, active: Number(e.target.value) })}><option value={1}>✓</option><option value={0}>✗</option></select></div>
      </div>
      <div className="field"><label>{t("admin.image")}</label><input value={form.image} onChange={set("image")} placeholder="https://images.unsplash.com/..." /></div>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>{t("admin.cancel")}</button>
        <button type="submit" className="btn btn-primary">{t("admin.save")}</button>
      </div>
    </form>
  );
}

function PostForm({ initial, onSave, onCancel, t }) {
  const [form, setForm] = useState(
    initial || { title_az: "", title_en: "", title_ru: "", body_az: "", body_en: "", body_ru: "", image: "" }
  );
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="modal-form" onSubmit={submit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="field"><label>{t("admin.nameAz")} *</label><input required value={form.title_az} onChange={set("title_az")} /></div>
      <div className="field"><label>{t("admin.nameEn")}</label><input value={form.title_en} onChange={set("title_en")} /></div>
      <div className="field"><label>{t("admin.nameRu")}</label><input value={form.title_ru} onChange={set("title_ru")} /></div>
      <div className="field"><label>{t("admin.descAz")} *</label><textarea required value={form.body_az} onChange={set("body_az")} /></div>
      <div className="field"><label>{t("admin.descEn")}</label><textarea value={form.body_en} onChange={set("body_en")} /></div>
      <div className="field"><label>{t("admin.descRu")}</label><textarea value={form.body_ru} onChange={set("body_ru")} /></div>
      <div className="field"><label>{t("admin.image")}</label><input value={form.image} onChange={set("image")} /></div>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>{t("admin.cancel")}</button>
        <button type="submit" className="btn btn-primary">{t("admin.save")}</button>
      </div>
    </form>
  );
}

export default function Admin() {
  const { t, tr } = useLang();
  const { user, token } = useAuth();
  const [tab, setTab] = useState("packages");

  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);

  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const calls = {
      packages: api.get("/packages", token),
      orders: api.get("/orders", token),
      reservations: api.get("/reservations", token),
      messages: api.get("/messages", token),
      reviews: api.get("/reviews/all", token),
      posts: api.get("/posts", token),
      gallery: api.get("/gallery", token),
      settings: api.get("/settings", token),
    };
    Promise.allSettled([
      calls.packages, calls.orders, calls.reservations,
      calls.messages, calls.reviews, calls.posts, calls.gallery, calls.settings,
    ]).then(([p, o, r, m, rev, po, g, s]) => {
      if (p.status === "fulfilled") setPackages(p.value);
      if (o.status === "fulfilled") { setOrders(o.value.orders || []); setOrderItems(o.value.items || []); }
      if (r.status === "fulfilled") setReservations(r.value);
      if (m.status === "fulfilled") setMessages(m.value);
      if (rev.status === "fulfilled") setReviews(rev.value);
      if (po.status === "fulfilled") setPosts(po.value);
      if (g.status === "fulfilled") setGallery(g.value);
      if (s.status === "fulfilled") setSettings(s.value);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  if (!user) return <div className="page"><div className="spinner" /></div>;
  if (user.role !== "admin") {
    return (
      <div className="page" style={{ textAlign: "center", padding: "100px 24px" }}>
        <h1 className="page-title">{t("admin.notAdmin")}</h1>
      </div>
    );
  }

  const savePackage = async (data) => {
    if (data.id) await api.put(`/packages/${data.id}`, data, token);
    else await api.post("/packages", data, token);
    setModal(null);
    load();
  };

  const savePost = async (data) => {
    if (data.id) await api.put(`/posts/${data.id}`, data, token);
    else await api.post("/posts", data, token);
    setModal(null);
    load();
  };

  const changeOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status }, token);
    load();
  };

  const changeReservationStatus = async (id, status) => {
    await api.put(`/reservations/${id}/status`, { status }, token);
    load();
  };

  const markRead = async (id) => {
    await api.put(`/messages/${id}/read`, {}, token);
    load();
  };

  const approveReview = async (id, approved) => {
    await api.put(`/reviews/${id}/approve`, { approved }, token);
    load();
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    await api.put("/settings", settings, token);
    load();
  };

  const statusBadge = (s) => `badge-${s}`;

  const orderItemsOf = (orderId) => orderItems.filter((it) => it.order_id === orderId);

  return (
    <div className="admin page fade-in">
      <div className="container">
        <div className="admin-head">
          <h1 className="page-title">{t("admin.title")}</h1>
        </div>

        <div className="admin-tabs">
          {TABS.map((tb) => (
            <button key={tb} className={`admin-tab ${tab === tb ? "active" : ""}`} onClick={() => setTab(tb)}>
              {t(`admin.${tb}`)}
            </button>
          ))}
        </div>

        {loading && <div className="spinner" />}

        {!loading && tab === "packages" && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <button className="btn btn-primary btn-sm" onClick={() => setModal({ kind: "package" })}>
                + {t("admin.add")}
              </button>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("admin.nameAz")}</th>
                    <th>{t("admin.price")}</th>
                    <th>{t("admin.active")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name_az}</td>
                      <td>{p.price} ₼</td>
                      <td>{p.active ? "✓" : "✗"}</td>
                      <td className="row-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ kind: "package", data: p })}>{t("admin.edit")}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Delete?")) api.del(`/packages/${p.id}`, token).then(load); }}>{t("admin.delete")}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === "orders" && (
          <div className="admin-section">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("admin.customer")}</th>
                    <th>{t("admin.date")}</th>
                    <th>{t("admin.total")}</th>
                    <th>Payment</th>
                    <th>Delivery</th>
                    <th>{t("admin.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>
                        {o.customer_name}<br />
                        <small>{o.customer_phone}</small>
                        {orderItemsOf(o.id).map((it) => (
                          <div key={it.id}><small>{it.name} × {it.qty}</small></div>
                        ))}
                      </td>
                      <td>{o.created_at.slice(0, 16).replace("T", " ")}</td>
                      <td>{o.total} ₼</td>
                      <td>{o.payment_method === "card" ? "Card" : "Cash"}</td>
                      <td>{o.delivery ? "✓" : "—"}</td>
                      <td>
                        <span className={`badge ${statusBadge(o.status)}`}>{t(`admin.${o.status}`)}</span>
                        <select className="status-select" value={o.status} onChange={(e) => changeOrderStatus(o.id, e.target.value)}>
                          {["new", "accepted", "done", "cancelled"].map((s) => (
                            <option key={s} value={s}>{t(`admin.${s}`)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === "reservations" && (
          <div className="admin-section">
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t("admin.customer")}</th>
                    <th>{t("reservation.date")}</th>
                    <th>{t("reservation.time")}</th>
                    <th>{t("reservation.guests")}</th>
                    <th>{t("admin.status")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.customer_name}<br /><small>{r.customer_phone}</small>{r.note && <div><small>{r.note}</small></div>}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>{r.guests}</td>
                      <td>
                        <span className={`badge ${statusBadge(r.status)}`}>{t(`admin.${r.status}`)}</span>
                        <select className="status-select" value={r.status} onChange={(e) => changeReservationStatus(r.id, e.target.value)}>
                          {["pending", "confirmed", "done", "cancelled"].map((s) => (
                            <option key={s} value={s}>{t(`admin.${s}`)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="row-actions">
                        <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Delete?")) api.del(`/reservations/${r.id}`, token).then(load); }}>{t("admin.delete")}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === "messages" && (
          <div className="admin-section messages-grid">
            {messages.length === 0 && <p className="empty-state">{t("admin.noData")}</p>}
            {messages.map((m) => (
              <div className={`msg-card ${m.is_read ? "" : "unread"}`} key={m.id}>
                <div className="msg-top">
                  <strong>{m.name}</strong>
                  <span className={`badge ${m.is_read ? "badge-read" : "badge-unread"}`}>
                    {m.is_read ? t("admin.read") : t("admin.unread")}
                  </span>
                </div>
                <div className="msg-meta">
                  {m.email} {m.phone && `· ${m.phone}`} {m.subject && `· ${m.subject}`}
                </div>
                <p className="msg-text">{m.message}</p>
                <div className="msg-foot">
                  <span className="msg-date">{m.created_at.slice(0, 16).replace("T", " ")}</span>
                  <div className="row-actions">
                    {!m.is_read && (
                      <button className="btn btn-outline btn-sm" onClick={() => markRead(m.id)}>{t("admin.read")}</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Delete?")) api.del(`/messages/${m.id}`, token).then(load); }}>{t("admin.delete")}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === "reviews" && (
          <div className="admin-section">
            {reviews.length === 0 && <p className="empty-state">{t("admin.noData")}</p>}
            <div className="review-admin-grid">
              {reviews.map((r) => (
                <div className={`review-card ${r.is_approved ? "" : "pending-review"}`} key={r.id}>
                  <div className="msg-top">
                    <span className="stars">{"★".repeat(r.rating)}</span>
                    <strong>{r.name}</strong>
                  </div>
                  <p className="msg-text">"{r.text}"</p>
                  <div className="msg-foot">
                    <span className={`badge ${r.is_approved ? "badge-read" : "badge-unread"}`}>
                      {r.is_approved ? t("admin.read") : t("admin.unread")}
                    </span>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => approveReview(r.id, !r.is_approved)}>
                        {r.is_approved ? "✗" : "✓"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Delete?")) api.del(`/reviews/${r.id}`, token).then(load); }}>{t("admin.delete")}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === "posts" && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <button className="btn btn-primary btn-sm" onClick={() => setModal({ kind: "post" })}>
                + {t("admin.add")}
              </button>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t("admin.nameAz")}</th>
                    <th>{t("admin.date")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.title_az}</td>
                      <td>{p.created_at.slice(0, 10)}</td>
                      <td className="row-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ kind: "post", data: p })}>{t("admin.edit")}</button>
                        <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Delete?")) api.del(`/posts/${p.id}`, token).then(load); }}>{t("admin.delete")}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab === "gallery" && (
          <div className="admin-section">
            <form
              className="gallery-add"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                await api.post("/gallery", { image: fd.get("image"), caption_az: fd.get("caption_az") }, token);
                e.target.reset();
                load();
              }}
            >
              <input name="image" placeholder={t("admin.image")} required />
              <input name="caption_az" placeholder="Caption (AZ)" />
              <button className="btn btn-primary btn-sm">+</button>
            </form>
            <div className="gallery-admin-grid">
              {gallery.map((g) => (
                <div className="gallery-admin-item" key={g.id}>
                  <img src={g.image} alt="" />
                  <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Delete?")) api.del(`/gallery/${g.id}`, token).then(load); }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === "settings" && settings && (
          <div className="admin-section">
            <form className="settings-form card" onSubmit={saveSettings}>
              <div className="field">
                <label>{t("admin.phone")}</label>
                <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
              </div>
              <div className="field">
                <label>{t("admin.email")}</label>
                <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
              </div>
              <div className="field">
                <label>{t("admin.address")}</label>
                <input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
              </div>
              <div className="field">
                <label>{t("admin.instagram")}</label>
                <input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
              </div>
              <div className="field">
                <label>{t("admin.workHours")}</label>
                <input value={settings.workHours} onChange={(e) => setSettings({ ...settings, workHours: e.target.value })} />
              </div>
              <button className="btn btn-primary">{t("admin.save")}</button>
            </form>
          </div>
        )}

        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">
                {modal.kind === "package" ? (modal.data ? t("admin.edit") : t("admin.add")) : modal.data ? t("admin.edit") : t("admin.add")}
              </h2>
              {modal.kind === "package" ? (
                <PackageForm initial={modal.data} onSave={savePackage} onCancel={() => setModal(null)} t={t} />
              ) : (
                <PostForm initial={modal.data} onSave={savePost} onCancel={() => setModal(null)} t={t} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
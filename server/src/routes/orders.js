import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.post("/", (req, res) => {
  const { user_id, customer_name, customer_phone, customer_email, items, payment_method, delivery } = req.body;
  if (!customer_name || !customer_phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Müştəri məlumatları və ən azı bir məhsul tələb olunur" });
  }
  const total = items.reduce((sum, it) => sum + Number(it.price) * Number(it.qty || 1), 0);

  let orderId;
  db.exec("BEGIN");
  try {
    const info = db
      .prepare(
        `INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, total, payment_method, delivery)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        user_id || null,
        customer_name,
        customer_phone,
        customer_email || null,
        total,
        payment_method === "card" ? "card" : "cash",
        delivery ? 1 : 0
      );
    orderId = Number(info.lastInsertRowid);
    const insItem = db.prepare(
      "INSERT INTO order_items (order_id, package_id, name, price, qty) VALUES (?, ?, ?, ?, ?)"
    );
    for (const it of items) {
      insItem.run(orderId, it.package_id || null, it.name, it.price, it.qty || 1);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  res.status(201).json(db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId));
});

router.get("/", authRequired, (req, res) => {
  if (req.user.role === "admin") {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    const items = db.prepare("SELECT * FROM order_items").all();
    return res.json({ orders, items });
  }
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  const ids = orders.map((o) => o.id);
  const items = ids.length
    ? db
        .prepare(`SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`)
        .all(...ids)
    : [];
  res.json({ orders, items });
});

router.put("/:id/status", authRequired, adminRequired, (req, res) => {
  const { status } = req.body;
  const allowed = ["new", "accepted", "done", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Yanlış status" });
  const info = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Sifariş tapılmadı" });
  res.json(db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id));
});

export default router;
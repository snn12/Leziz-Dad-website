import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.post("/", (req, res) => {
  const { user_id, customer_name, customer_phone, date, time, guests, note } = req.body;
  if (!customer_name || !customer_phone || !date || !time) {
    return res.status(400).json({ error: "Ad, telefon, tarix və vaxt tələb olunur" });
  }
  const info = db
    .prepare(
      `INSERT INTO reservations (user_id, customer_name, customer_phone, date, time, guests, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(user_id || null, customer_name, customer_phone, date, time, guests || 2, note || null);
  res.status(201).json(db.prepare("SELECT * FROM reservations WHERE id = ?").get(info.lastInsertRowid));
});

router.get("/", authRequired, (req, res) => {
  if (req.user.role === "admin") {
    return res.json(db.prepare("SELECT * FROM reservations ORDER BY date DESC, time DESC").all());
  }
  res.json(
    db.prepare("SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC").all(req.user.id)
  );
});

router.put("/:id/status", authRequired, adminRequired, (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "confirmed", "cancelled", "done"];
  if (!allowed.includes(status)) return res.status(400).json({ error: "Yanlış status" });
  const info = db
    .prepare("UPDATE reservations SET status = ? WHERE id = ?")
    .run(status, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Rezervasiya tapılmadı" });
  res.json(db.prepare("SELECT * FROM reservations WHERE id = ?").get(req.params.id));
});

router.delete("/:id", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("DELETE FROM reservations WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Rezervasiya tapılmadı" });
  res.json({ ok: true });
});

export default router;
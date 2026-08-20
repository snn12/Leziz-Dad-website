import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.post("/", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Ad, email və mesaj tələb olunur" });
  }
  const info = db
    .prepare("INSERT INTO messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)")
    .run(name, email, phone || null, subject || null, message);
  res.status(201).json(db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid));
});

router.get("/", authRequired, adminRequired, (req, res) => {
  res.json(db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all());
});

router.put("/:id/read", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("UPDATE messages SET is_read = 1 WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Mesaj tapılmadı" });
  res.json(db.prepare("SELECT * FROM messages WHERE id = ?").get(req.params.id));
});

router.delete("/:id", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Mesaj tapılmadı" });
  res.json({ ok: true });
});

export default router;
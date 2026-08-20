import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC").all());
});

router.post("/", (req, res) => {
  const { name, rating, text } = req.body;
  if (!name || !text || !rating) {
    return res.status(400).json({ error: "Ad, qiymət və mətn tələb olunur" });
  }
  const r = Math.max(1, Math.min(5, Number(rating) || 5));
  const info = db
    .prepare("INSERT INTO reviews (name, rating, text) VALUES (?, ?, ?)")
    .run(name, r, text);
  res.status(201).json(db.prepare("SELECT * FROM reviews WHERE id = ?").get(info.lastInsertRowid));
});

router.get("/all", authRequired, adminRequired, (req, res) => {
  res.json(db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all());
});

router.put("/:id/approve", authRequired, adminRequired, (req, res) => {
  const { approved } = req.body;
  const info = db
    .prepare("UPDATE reviews SET is_approved = ? WHERE id = ?")
    .run(approved ? 1 : 0, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Rəy tapılmadı" });
  res.json(db.prepare("SELECT * FROM reviews WHERE id = ?").get(req.params.id));
});

router.delete("/:id", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Rəy tapılmadı" });
  res.json({ ok: true });
});

export default router;
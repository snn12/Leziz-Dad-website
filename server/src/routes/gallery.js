import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM gallery ORDER BY id DESC").all());
});

router.post("/", authRequired, adminRequired, (req, res) => {
  const { image, caption_az, caption_en, caption_ru } = req.body;
  if (!image) return res.status(400).json({ error: "Şəkil URL tələb olunur" });
  const info = db
    .prepare("INSERT INTO gallery (image, caption_az, caption_en, caption_ru) VALUES (?, ?, ?, ?)")
    .run(image, caption_az || null, caption_en || null, caption_ru || null);
  res.status(201).json(db.prepare("SELECT * FROM gallery WHERE id = ?").get(info.lastInsertRowid));
});

router.delete("/:id", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Şəkil tapılmadı" });
  res.json({ ok: true });
});

export default router;
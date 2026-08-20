import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all());
});

router.get("/:id", (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Məqalə tapılmadı" });
  res.json(post);
});

router.post("/", authRequired, adminRequired, (req, res) => {
  const { title_az, title_en, title_ru, body_az, body_en, body_ru, image } = req.body;
  if (!title_az || !body_az) {
    return res.status(400).json({ error: "title_az və body_az tələb olunur" });
  }
  const info = db
    .prepare(
      `INSERT INTO posts (title_az, title_en, title_ru, body_az, body_en, body_ru, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      title_az,
      title_en || title_az,
      title_ru || title_az,
      body_az,
      body_en || body_az,
      body_ru || body_az,
      image || null
    );
  res.status(201).json(db.prepare("SELECT * FROM posts WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/:id", authRequired, adminRequired, (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Məqalə tapılmadı" });
  const { title_az, title_en, title_ru, body_az, body_en, body_ru, image } = req.body;
  db.prepare(
    `UPDATE posts SET
       title_az = ?, title_en = ?, title_ru = ?,
       body_az = ?, body_en = ?, body_ru = ?, image = ?
     WHERE id = ?`
  ).run(
    title_az ?? post.title_az,
    title_en ?? post.title_en,
    title_ru ?? post.title_ru,
    body_az ?? post.body_az,
    body_en ?? post.body_en,
    body_ru ?? post.body_ru,
    image ?? post.image,
    post.id
  );
  res.json(db.prepare("SELECT * FROM posts WHERE id = ?").get(post.id));
});

router.delete("/:id", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Məqalə tapılmadı" });
  res.json({ ok: true });
});

export default router;
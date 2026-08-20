import { Router } from "express";
import { db } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.get("/", (req, res) => {
  const packages = db
    .prepare("SELECT * FROM packages WHERE active = 1 ORDER BY id")
    .all();
  res.json(packages);
});

router.get("/:id", (req, res) => {
  const pkg = db.prepare("SELECT * FROM packages WHERE id = ?").get(req.params.id);
  if (!pkg) return res.status(404).json({ error: "Paket tapılmadı" });
  res.json(pkg);
});

router.post("/", authRequired, adminRequired, (req, res) => {
  const { name_az, name_en, name_ru, desc_az, desc_en, desc_ru, price, image } = req.body;
  if (!name_az || !desc_az || price == null) {
    return res.status(400).json({ error: "name_az, desc_az və price tələb olunur" });
  }
  const info = db
    .prepare(
      `INSERT INTO packages (name_az, name_en, name_ru, desc_az, desc_en, desc_ru, price, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name_az,
      name_en || name_az,
      name_ru || name_az,
      desc_az,
      desc_en || desc_az,
      desc_ru || desc_az,
      price,
      image || ""
    );
  res.status(201).json(db.prepare("SELECT * FROM packages WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/:id", authRequired, adminRequired, (req, res) => {
  const pkg = db.prepare("SELECT * FROM packages WHERE id = ?").get(req.params.id);
  if (!pkg) return res.status(404).json({ error: "Paket tapılmadı" });
  const { name_az, name_en, name_ru, desc_az, desc_en, desc_ru, price, image, active } = req.body;
  db.prepare(
    `UPDATE packages SET
       name_az = ?, name_en = ?, name_ru = ?,
       desc_az = ?, desc_en = ?, desc_ru = ?,
       price = ?, image = ?, active = ?
     WHERE id = ?`
  ).run(
    name_az ?? pkg.name_az,
    name_en ?? pkg.name_en,
    name_ru ?? pkg.name_ru,
    desc_az ?? pkg.desc_az,
    desc_en ?? pkg.desc_en,
    desc_ru ?? pkg.desc_ru,
    price ?? pkg.price,
    image ?? pkg.image,
    active == null ? pkg.active : active ? 1 : 0,
    pkg.id
  );
  res.json(db.prepare("SELECT * FROM packages WHERE id = ?").get(pkg.id));
});

router.delete("/:id", authRequired, adminRequired, (req, res) => {
  const info = db.prepare("DELETE FROM packages WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Paket tapılmadı" });
  res.json({ ok: true });
});

export default router;
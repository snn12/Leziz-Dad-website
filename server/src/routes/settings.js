import { Router } from "express";
import { getSettings, setSetting } from "../db.js";
import { authRequired, adminRequired } from "../middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getSettings());
});

router.put("/", authRequired, adminRequired, (req, res) => {
  const allowed = ["phone", "email", "address", "instagram", "workHours"];
  for (const key of allowed) {
    if (req.body[key] != null) setSetting(key, String(req.body[key]));
  }
  res.json(getSettings());
});

export default router;
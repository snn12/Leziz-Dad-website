import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import packageRoutes from "./routes/packages.js";
import orderRoutes from "./routes/orders.js";
import messageRoutes from "./routes/messages.js";
import settingsRoutes from "./routes/settings.js";
import reservationRoutes from "./routes/reservations.js";
import reviewRoutes from "./routes/reviews.js";
import postRoutes from "./routes/posts.js";
import galleryRoutes from "./routes/gallery.js";
import { seed } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "..", "client", "dist");
const hasDist = fs.existsSync(path.join(distPath, "index.html"));

const app = express();
app.use(cors());
app.use(express.json());

seed();

app.get("/api/health", (req, res) => res.json({ ok: true, name: "Leziz Dad API" }));
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/gallery", galleryRoutes);

if (hasDist) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Tapılmadı" });
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((req, res) => res.status(404).json({ error: "Tapılmadı" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Leziz Dad server: http://localhost:${PORT}`));
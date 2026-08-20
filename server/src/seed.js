import { db, setSetting } from "./db.js";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@lezizdad.az";
const ADMIN_PASSWORD = "admin123";

const PACKAGES = [
  {
    name_az: "Səhər Yeməyi Paketi",
    name_en: "Breakfast Set",
    name_ru: "Завтрак-набор",
    desc_az: "Təzə çörək, pendir, zeytun, tərəvəz və ətirli çay ilə zəngin səhər süfrəsi.",
    desc_en: "A rich morning table with fresh bread, cheese, olives, vegetables and aromatic tea.",
    desc_ru: "Сытный утренний стол: свежий хлеб, сыр, оливки, овощи и ароматный чай.",
    price: 15,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1200&auto=format&fit=crop",
    active: 1,
  },
  {
    name_az: "Ailə Paketi",
    name_en: "Family Set",
    name_ru: "Семейный набор",
    desc_az: "4 nəfər üçün şorba, əsas yemək, salat və desert ilə tam nahar süfrəsi.",
    desc_en: "A full lunch table for 4: soup, main course, salad and dessert.",
    desc_ru: "Полный обед на четверых: суп, основное блюдо, салат и десерт.",
    price: 45,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
    active: 1,
  },
  {
    name_az: "Bayram Süfrəsi",
    name_en: "Holiday Table",
    name_ru: "Праздничный стол",
    desc_az: "Şad günlər üçün: kabab seti, milli plov, təzə salatlar və şirniyyatlar.",
    desc_en: "For special days: kebab set, national plov, fresh salads and sweets.",
    desc_ru: "Для особых дней: набор кебабов, национальный плов, свежие салаты и сладости.",
    price: 80,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop",
    active: 1,
  },
  {
    name_az: "Konsultasiya və Degustasiya",
    name_en: "Tasting & Consultation",
    name_ru: "Дегустация и консультация",
    desc_az: "Şefimizlə görüş: menyu seçimi və 6 məhsuldan ibarət degustasiya səbəti.",
    desc_en: "Meet our chef: menu planning and a tasting basket of 6 items.",
    desc_ru: "Встреча с нашим шефом: подбор меню и дегустационный набор из 6 позиций.",
    price: 25,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    active: 1,
  },
];

export function seed() {
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(ADMIN_EMAIL);
  if (!exists) {
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
    db.prepare(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')"
    ).run("Administrator", ADMIN_EMAIL, hash);
    console.log("Admin yaradıldı:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
  }

  const count = db.prepare("SELECT COUNT(*) AS c FROM packages").get().c;
  if (count === 0) {
    const ins = db.prepare(
      `INSERT INTO packages (name_az, name_en, name_ru, desc_az, desc_en, desc_ru, price, image, active)
       VALUES (@name_az, @name_en, @name_ru, @desc_az, @desc_en, @desc_ru, @price, @image, @active)`
    );
    for (const p of PACKAGES) ins.run(p);
    console.log("Paketlər yaradıldı:", PACKAGES.length);
  }

  setSetting("phone", "+994 50 123 45 67");
  setSetting("email", "info@lezizdad.az");
  setSetting("address", "Nizami küçəsi 12, Bakı");
  setSetting("instagram", "@lezizdad");
  setSetting("workHours", "Hər gün 09:00 - 23:00");
  console.log("Ayarlar hazırdır.");

  const reviewCount = db.prepare("SELECT COUNT(*) AS c FROM reviews").get().c;
  if (reviewCount === 0) {
    const ins = db.prepare(
      "INSERT INTO reviews (name, rating, text, is_approved) VALUES (?, ?, ?, 1)"
    );
    ins.run("Aysel M.", 5, "Şirniyyatlar inanılmazdır! Tiramisu mütləq sınamalısınız.");
    ins.run("Elvin K.", 5, "İsti atmosfer, çox mehriban xidmət. Ailəmlə tez-tez gəlirik.");
    ins.run("Nigar H.", 4, "Qəhvə çox dadlı, çatdırılma sürətli. Hamısına təşəkkürlər!");
    console.log("Rəylər yaradıldı: 3");
  }

  const postCount = db.prepare("SELECT COUNT(*) AS c FROM posts").get().c;
  if (postCount === 0) {
    const ins = db.prepare(
      `INSERT INTO posts (title_az, title_en, title_ru, body_az, body_en, body_ru, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    ins.run(
      "Yeni payız desertləri gəldi",
      "New autumn desserts are here",
      "Новые осенние десерты уже здесь",
      "Balqabaqlı tort, karamelli krem-brule və ədviyyatlı qəhvə — payız kolleksiyamız hazırdır. Bütün desertlər hər gün təzə hazırlanır.",
      "Pumpkin cake, caramel crème brûlée and spiced coffee — our autumn collection is ready. All desserts are made fresh daily.",
      "Тыквенный торт, карамельный крем-брюле и пряный кофе — наша осенняя коллекция готова. Все десерты готовятся свежими каждый день.",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1200&auto=format&fit=crop"
    );
    ins.run(
      "Səhər yeməyi saat 7-də başlayır",
      "Breakfast starts at 7 AM",
      "Завтрак начинается в 7 утра",
      "İşə gedənlər üçün xəbər: səhər yeməyi paketimizi saat 07:00-dan təklif edirik. Təzə çörək, evdə hazırlanmış mürəbbələr və ətirli çay.",
      "Good news for early birds: our breakfast set is available from 7 AM. Fresh bread, homemade jams and aromatic tea.",
      "Для тех, кто рано встаёт: наш завтрак-набор доступен с 7 утра. Свежий хлеб, домашнее варенье и ароматный чай.",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop"
    );
    console.log("Bloq yazıları yaradıldı: 2");
  }

  const galleryCount = db.prepare("SELECT COUNT(*) AS c FROM gallery").get().c;
  if (galleryCount === 0) {
    const ins = db.prepare("INSERT INTO gallery (image, caption_az) VALUES (?, ?)");
    const images = [
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    ];
    const captions = ["Səhər yeməyi", "Əl işi desertlər", "Ətirli qəhvə", "Təzə şirniyyatlar", "Mövsümü məhsullar", "Restoranımızın atmosferi"];
    images.forEach((img, i) => ins.run(img, captions[i]));
    console.log("Qalereya yaradıldı:", images.length);
  }
}

seed();
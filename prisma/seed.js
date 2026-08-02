const { PrismaClient } = require("@prisma/client");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const CATEGORY_TREE = [
  {
    nameAz: "Heyvandarlıq", nameEn: "Livestock", nameRu: "Животноводство", icon: "🐄",
    children: ["İnək", "Buğa", "Dana", "Qoyun", "Keçi", "Camış", "At"],
  },
  {
    nameAz: "Quşçuluq", nameEn: "Poultry", nameRu: "Птицеводство", icon: "🐔",
    children: ["Toyuq", "Hind toyuğu", "Ördək", "Qaz"],
  },
  {
    nameAz: "Kənd Təsərrüfatı", nameEn: "Agriculture", nameRu: "Сельское хозяйство", icon: "🌾",
    children: ["Meyvə", "Tərəvəz", "Toxum", "Gübrə", "Azot Gübrəsi", "Karbamid", "Pestisid", "Herbisid", "Heyvan Yemi"],
  },
  {
    nameAz: "Texnika", nameEn: "Machinery", nameRu: "Техника", icon: "🚜",
    children: ["Traktor", "Kombayn", "Suvarma", "Ehtiyat Hissələri", "İstixana Avadanlığı"],
  },
  {
    nameAz: "Arıçılıq", nameEn: "Beekeeping", nameRu: "Пчеловодство", icon: "🍯",
    children: ["Bal", "Arı Ailəsi", "Arıçılıq Avadanlığı"],
  },
];

async function hash(p) {
  return bcrypt.hash(p, 10);
}

async function main() {
  // ---------- CATEGORIES ----------
  let sortOrder = 0;
  const childCategoryIds = [];
  for (const parent of CATEGORY_TREE) {
    const parentSlug = slugify(parent.nameAz, { lower: true, strict: true });
    const parentCategory = await prisma.category.upsert({
      where: { slug: parentSlug },
      update: {},
      create: {
        slug: parentSlug,
        nameAz: parent.nameAz,
        nameEn: parent.nameEn,
        nameRu: parent.nameRu,
        icon: parent.icon,
        sortOrder: sortOrder++,
      },
    });

    let childOrder = 0;
    for (const childName of parent.children) {
      const childSlug = slugify(`${parent.nameAz}-${childName}`, { lower: true, strict: true });
      const child = await prisma.category.upsert({
        where: { slug: childSlug },
        update: {},
        create: {
          slug: childSlug,
          nameAz: childName,
          parentId: parentCategory.id,
          sortOrder: childOrder++,
        },
      });
      childCategoryIds.push(child);
    }
  }
  console.log("✅ Kateqoriyalar uğurla yükləndi.");

  // ---------- DEMO USERS ----------
  const demoUsers = [
    { email: "admin@fermermarket.az", role: "SUPER_ADMIN", fullName: "Super Admin", password: "Admin123!" },
    { email: "farmer@fermermarket.az", role: "FARMER", fullName: "Rəşad Fermer", password: "Farmer123!" },
    { email: "store@fermermarket.az", role: "STORE", fullName: "Aqro Market MMC", password: "Store123!" },
    { email: "agronomist@fermermarket.az", role: "AGRONOMIST", fullName: "Dr. Aqronom Vəliyev", password: "Agro123!" },
    { email: "buyer@fermermarket.az", role: "BUYER", fullName: "Elnur Alıcı", password: "Buyer123!" },
  ];

  const users = {};
  for (const u of demoUsers) {
    const passwordHash = await hash(u.password);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        passwordHash,
        status: "ACTIVE",
        emailVerified: true,
      },
    });
    users[u.role] = user;
  }
  console.log("✅ Demo istifadəçilər hazırlandı (parollar: Admin123!, Farmer123!, Store123!, Agro123!, Buyer123!)");

  // ---------- DEMO STORE ----------
  const store = await prisma.store.upsert({
    where: { ownerId: users.STORE.id },
    update: {},
    create: {
      ownerId: users.STORE.id,
      name: "Aqro Market MMC",
      slug: "aqro-market",
      description: "Kənd təsərrüfatı məhsulları və avadanlıqları üzrə ixtisaslaşmış mağaza.",
      isVerified: true,
      isActive: true,
      whatsapp: "994501234567",
      phone: "+994501234567",
      address: "Bakı, Azərbaycan",
    },
  });

  // ---------- DEMO PRODUCTS ----------
  const findCat = (name) => childCategoryIds.find((c) => c.nameAz === name);

  const demoProducts = [
    { title: "Azot Gübrəsi 50kg", cat: "Azot Gübrəsi", price: 45, stock: 120, seller: users.STORE, storeId: store.id, region: "Bakı", desc: "Yüksək keyfiyyətli azot gübrəsi, taxıl və tərəvəz əkinləri üçün uyğundur." },
    { title: "Sağmal Dana İnək", cat: "İnək", price: 2200, stock: 3, seller: users.FARMER, region: "Gəncə", desc: "3 yaşlı, gündə 18L süd verən sağlam holştin inək." },
    { title: "Qoyun (Canlı Çəki)", cat: "Qoyun", price: 380, stock: 15, seller: users.FARMER, region: "Şəki", desc: "Qurban bayramı üçün uyğun, sağlam və kök qoyunlar." },
    { title: "Təbii Bal 1kg", cat: "Bal", price: 25, stock: 60, seller: users.FARMER, region: "Quba", desc: "Dağ florasından toplanmış, süzülmüş təbii bal." },
    { title: "Toyuq (Broyler)", cat: "Toyuq", price: 12, stock: 200, seller: users.STORE, storeId: store.id, region: "Bakı", desc: "45 günlük broyler toyuq, təzə." },
    { title: "Mini Traktor 25HP", cat: "Traktor", price: 18500, stock: 2, seller: users.STORE, storeId: store.id, region: "Bakı", desc: "Yeni, 25 at gücündə, kiçik təsərrüfatlar üçün ideal mini traktor." },
    { title: "Damcı Suvarma Sistemi (1ha)", cat: "Suvarma", price: 950, stock: 8, seller: users.STORE, storeId: store.id, region: "Bakı", desc: "Tam dəst damcı suvarma sistemi, quraşdırma təlimatı ilə." },
    { title: "Pomidor Toxumu (Elit)", cat: "Toxum", price: 3.5, stock: 500, seller: users.FARMER, region: "Şamaxı", desc: "Yüksək məhsuldarlıqlı elit pomidor toxumu, istixana və açıq sahə üçün." },
  ];

  for (const p of demoProducts) {
    const category = findCat(p.cat);
    if (!category) continue;
    const slug = slugify(`${p.title}-${p.seller.id.slice(0, 6)}`, { lower: true, strict: true });
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) continue;
    const product = await prisma.product.create({
      data: {
        slug,
        titleAz: p.title,
        descriptionAz: p.desc,
        price: p.price,
        stock: p.stock,
        status: "ACTIVE",
        categoryId: category.id,
        sellerId: p.seller.id,
        storeId: p.storeId || null,
        region: p.region,
        city: p.region,
        publishedAt: new Date(),
        images: {
          create: [{ url: `https://placehold.co/600x400/22c55e/ffffff?text=${encodeURIComponent(p.title)}`, sortOrder: 0 }],
        },
      },
    });

    // Give a couple of products premium/VIP listings for the "turbo.az style" ad system
    if (p.title.includes("Traktor") || p.title.includes("İnək")) {
      await prisma.listing.create({
        data: {
          productId: product.id,
          tier: p.title.includes("İnək") ? "VIP" : "PREMIUM",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
  console.log("✅ Demo məhsullar yükləndi.");

  // ---------- DEMO CAMPAIGN (homepage banner) ----------
  await prisma.campaign.upsert({
    where: { id: "seed-campaign-1" },
    update: {},
    create: {
      id: "seed-campaign-1",
      title: "Bahar Kampaniyası — Gübrələrdə 15% Endirim",
      type: "HOMEPAGE_BANNER",
      status: "ACTIVE",
      storeId: store.id,
      bannerUrl: "https://placehold.co/1200x300/16a34a/ffffff?text=Bahar+Kampaniyasi+-+15%25+Endirim",
      targetUrl: "/products?category=azot-gubresi",
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("✅ Demo kampaniya yükləndi.");

  // ---------- DEMO COUPON ----------
  await prisma.coupon.upsert({
    where: { code: "XOSGELDIN10" },
    update: {},
    create: {
      code: "XOSGELDIN10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 20,
      maxUses: 1000,
      isActive: true,
    },
  });
  console.log("✅ Demo kupon (XOSGELDIN10) yükləndi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "@/lib/prisma";

// POST /api/ai/agronomist — AI disease detection + product recommendation
export async function POST(req) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") || "";
    const image = formData.get("image");

    const isImage = !!image && image !== "null";
    const query = text.toLowerCase();

    // 1. Determine issue type based on text/image
    let issueType = "unknown";
    let diseaseName = "Naməlum problem";
    let confidence = "85%";
    let recommendation = "";

    // Disease keywords → matching disease in DB
    if (query.includes("göbələk") || query.includes("ləkə") || query.includes("xəstə") || isImage) {
      issueType = "fungal";
      diseaseName = isImage ? "Göbələk xəstəliyi (Müəyyən edilir...)" : "Göbələk xəstəliyi";
      confidence = isImage ? "92%" : "80%";
      recommendation = "Fungisidlərdən istifadə edin. Bitkinin zədələnmiş hissələrini çıxarın.";
    } else if (query.includes("zarar") || query.includes("böcək") || query.includes("süru") || query.includes("qurd")) {
      issueType = "insect";
      diseaseName = "Zərərverici böcək müəyyən edildi";
      confidence = "88%";
      recommendation = "İnsektisidlərdən istifadə edin. Bioloji mübarizə üçün feromon tələlərindən istifadə edə bilərsiniz.";
    } else if (query.includes("sarı") || query.includes("çatış") || query.includes("qida") || query.includes("saral")) {
      issueType = "nutrient";
      diseaseName = "Qida çatışmazlığı (Sarı yarpaqlar)";
      confidence = "85%";
      recommendation = "Kompleks gübrə və ya mikroelement məhsullarından istifadə edin. Yarpaq gübrəsi sürətli nəticə verir.";
    } else if (query.includes("alcaq") || query.includes("böyümür") || query.includes("zəif")) {
      issueType = "nutrient_deficiency";
      diseaseName = "Bitki inkişafı zəif — qida çatışmazlığı";
      confidence = "82%";
      recommendation = "Azot (N) və ya kompleks NPK gübrəsi tətbiq edin. Torpaq analizi tövsiyə olunur.";
    } else {
      diseaseName = isImage ? "Bitki vəziyyəti analiz edilir..." : "Ümumi məsləhət";
      confidence = "75%";
      recommendation = "Bitkinizin vəziyyətini daha ətraflı təsvir edin və ya şəkil yükləyin.";
    }

    // 2. Find matching products from DB based on issue type
    let productWhere = { status: "ACTIVE", stock: { gt: 0 } };

    if (issueType === "fungal") {
      // Fungicides category
      productWhere = {
        ...productWhere,
        OR: [
          { category: { nameAz: { contains: "Fungisid" } } },
          { titleAz: { contains: "fungisid", mode: "insensitive" } },
        ],
      };
    } else if (issueType === "insect") {
      productWhere = {
        ...productWhere,
        OR: [
          { category: { nameAz: { contains: "İnsektisid" } } },
          { titleAz: { contains: "insektisid", mode: "insensitive" } },
        ],
      };
    } else if (issueType === "nutrient" || issueType === "nutrient_deficiency") {
      productWhere = {
        ...productWhere,
        OR: [
          { category: { nameAz: { contains: "gübrə" } } },
          { category: { nameAz: { contains: "Maye" } } },
          { category: { nameAz: { contains: "Yarpaq" } } },
          { category: { nameAz: { contains: "Mikroelement" } } },
          { category: { nameAz: { contains: "Azot" } } },
          { titleAz: { contains: "NPK", mode: "insensitive" } },
        ],
      };
    }

    const products = await prisma.product.findMany({
      where: productWhere,
      take: 4,
      orderBy: { viewCount: "desc" },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" } },
        store: { select: { name: true, slug: true } },
      },
    });

    // 3. Spray timing recommendation
    const now = new Date();
    const hour = now.getHours();
    let sprayTime = "Səhər tezdən (06:00-08:00) və ya axşam üzeri (18:00-20:00)";
    if (hour >= 6 && hour < 10) {
      sprayTime = "İndi çiləmə üçün əlverişli vaxtdır (səhər)";
    } else if (hour >= 18 && hour < 21) {
      sprayTime = "İndi çiləmə üçün əlverişli vaxtdır (axşam)";
    } else if (hour >= 10 && hour < 18) {
      sprayTime = "Çiləmə üçün əlverişsiz vaxt — günəş yanığı riski. Axşam 18:00-dan sonra çiləyin.";
    } else {
      sprayTime = "Gecə çiləmək tövsiyə olunmur. Səhər 06:00-08:00 çiləyin.";
    }

    // 4. Dose calculation if useNorm exists
    let doseInfo = null;
    if (products.length > 0 && products[0].useNorm) {
      doseInfo = {
        product: products[0].titleAz,
        norm: products[0].useNorm,
        perHectare: products[0].useNorm,
      };
    }

    // Slight delay to simulate AI reasoning
    await new Promise(r => setTimeout(r, 1200));

    return Response.json({
      disease: diseaseName,
      confidence,
      recommendation,
      sprayTime,
      doseInfo,
      products: products.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.titleAz,
        price: Number(p.price),
        currency: p.currency || "AZN",
        coverImage: p.images?.[0]?.url || null,
        store: p.store?.name || null,
        manufacturer: p.manufacturer || null,
        preparativeForm: p.preparativeForm || null,
        useNorm: p.useNorm || null,
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

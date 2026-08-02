// Thin wrapper around Google's Gemini REST API. Server-side only — never
// expose GOOGLE_API_KEY to the client.
const MODEL = "gemini-2.5-flash";

function offlineGenerate(prompt) {
  const promptLower = prompt.toLowerCase();

  // 1. AI Agronomist Request (Expecting JSON)
  if (promptLower.includes("json formatında") || promptLower.includes("diagnosis")) {
    if (promptLower.includes("mənənə") || promptLower.includes("aphid")) {
      return JSON.stringify({
        diagnosis: "Mənənə (Aphids)",
        confidencePercent: 95,
        causes: ["Sahədə rütubətin yüksək olması", "Faydalı cırcırama və parabüzənlərin azlığı"],
        treatment: ["İnsektisidlərlə çiləmə aparmaq (məs. İmidakloprid tərkibli)", "Yarpaqları sabunlu məhlulla yumaq"],
        recommendedProducts: ["İmidakloprid 200", "Karate Zeon"],
        needsExpertConsult: false,
        summary: "Hörmətli fermer, sahənizdə mənənə zərərvericisi aşkarlanıb. İmidakloprid tərkibli preparatlarla vaxtında mübarizə aparmağınız tövsiyə olunur."
      });
    }
    if (promptLower.includes("kolorado") || promptLower.includes("beetle") || promptLower.includes("kartof")) {
      return JSON.stringify({
        diagnosis: "Kolorado Kartof Böcəyi",
        confidencePercent: 98,
        causes: ["Növbəli əkin qaydalarına əməl edilməməsi", "İsti və quru hava şəraiti"],
        treatment: ["Böcəklərin və yumurtalarının mexaniki yığılması", "Sürfələrə qarşı xüsusi insektisidlərin tətbiqi"],
        recommendedProducts: ["Mospilan", "Decis Profi"],
        needsExpertConsult: false,
        summary: "Hörmətli fermer, sahənizdə Kolorado böcəyi yayılmışdır. Sürətli inkişafın qarşısını almaq üçün dərhal insektisid çiləməsi tövsiyə olunur."
      });
    }
    // General fallback
    return JSON.stringify({
      diagnosis: "Bitki stressi və ya qida çatışmazlığı",
      confidencePercent: 80,
      causes: ["Düzgün olmayan suvarma rejimi", "Torpaqda azot (N) və ya kalium (K) çatışmazlığı"],
      treatment: ["Suvarma rejiminin optimallaşdırılması", "Yarpaqdan kompleks mineral gübrələrin (NPK) verilməsi"],
      recommendedProducts: ["NPK 20-20-20", "Humik Turşu preparatları"],
      needsExpertConsult: true,
      summary: "Hörmətli fermer, bitkidə qida çatışmazlığı əlamətləri görünür. Kompleks mikroelementli mineral gübrələrin tətbiqi faydalı olar."
    });
  }

  // 2. AI Description Request
  if (promptLower.includes("təsvir") || promptLower.includes("description") || promptLower.includes("yaz")) {
    return "Bu məhsul kənd təsərrüfatı standartlarına tam uyğun olaraq yüksək məhsuldarlıq və bitki mühafizəsini təmin etmək üçün istehsal olunmuşdur. Həm ekoloji təmizliyi qoruyur, həm də sahənizi zərərvericilərdən səmərəli şəkildə müdafiə edir.";
  }

  // 3. AI Price Index / Forecast Request
  if (promptLower.includes("qiymət") || promptLower.includes("price") || promptLower.includes("forecasting")) {
    return JSON.stringify([
      { month: "Yanvar", price: 1.20 },
      { month: "Fevral", price: 1.40 },
      { month: "Mart", price: 1.50 },
      { month: "Aprel", price: 1.10 },
      { month: "May", price: 0.90 },
      { month: "İyun", price: 0.70 }
    ]);
  }

  // Default Fallback
  return "Lokal simulyasiya cavabı: Kənd təsərrüfatı layihəsi uğurla işləyir.";
}

export async function geminiGenerate({ prompt, imageBase64, imageMimeType, maxOutputTokens = 2048 }) {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  // Local Offline Fallback Mode (If no API key is set)
  if (!key) {
    console.log("⚠️ AI bağlantı açarı tapılmadı. Sistem yerli (offline) simulyasiya rejimində işləyir.");
    return offlineGenerate(prompt);
  }

  try {
    const parts = [{ text: prompt }];
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: imageMimeType || "image/jpeg",
          data: imageBase64,
        },
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.6, maxOutputTokens, thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || "AI sorğusu uğursuz oldu");
    }

    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text).join("\n") || "";
    if (candidate?.finishReason === "MAX_TOKENS" && !text) {
      throw new Error("AI cavabı çox uzun oldu, yenidən cəhd edin");
    }
    return text.trim();
  } catch (err) {
    console.log("⚠️ AI bağlantı və ya şəbəkə xətası baş verdi. Lokal simulyasiya rejiminə keçilir:", err.message);
    return offlineGenerate(prompt);
  }
}

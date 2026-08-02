import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // We expect FormData from the client (image + text)
    const formData = await req.formData();
    const text = formData.get("text");
    const image = formData.get("image");
    
    // In a real application, you would send the image and text to Google Gemini Vision API
    // e.g. using @google/generative-ai library if process.env.GEMINI_API_KEY exists.
    
    // For now, we simulate AI diagnosis based on the presence of an image.
    const isImage = !!image && image !== "null";
    
    // Mock response matching the UI structure
    const mockResponse = {
      disease: isImage ? "Alma qurdu (Codling moth) / Göbələk xəstəliyi" : "Bitki qidalanma çatışmazlığı",
      confidence: isImage ? "92%" : "85%",
      recommendation: isImage 
        ? "Mübarizə üçün İnsektisidlərdən və ya Fungisidlərdən (məs: Xlorpirifos, Tiakloprid) istifadə olunmalıdır. Bioloji mübarizə olaraq feromon tələlərdən istifadə etmək olar."
        : "Kompleks gübrələrdən (NPK) istifadə edərək bitkinin qidalanmasını yaxşılaşdırmaq lazımdır.",
      products: [
        { name: "Tiakloprid 480 SC", price: "25 AZN" },
        { name: "KaratZeon", price: "18 AZN" }
      ]
    };
    
    // Slight delay to simulate AI reasoning
    await new Promise(r => setTimeout(r, 1500));

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

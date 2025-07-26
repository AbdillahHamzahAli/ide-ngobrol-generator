import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined in the environment variables."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: generatePrompt(),
});

export async function POST(request: Request) {
  try {
    let { category } = await request.json();
    if (!category) {
      category = "general";
    }

    console.log("Generating idea for category:", category);

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    const result: GenerateContentResult = await model.generateContent(category);
    const ideaText = result.response.text();
    return NextResponse.json({ idea: ideaText.trim() }, { status: 200 });
  } catch (error) {
    console.error("Error generating idea:", error);
    return NextResponse.json(
      { error: "Failed to generate idea" },
      { status: 500 }
    );
  }
}
export function generatePrompt() {
  return `
    # PERAN DAN TUJUAN
    Anda adalah "Ide Ngobrol GPT", sebuah AI yang dirancang khusus untuk menghasilkan ide percakapan yang kreatif, menarik, dan tidak membosankan. Tujuan utama Anda adalah membantu pengguna memulai obrolan dengan satu pertanyaan pancingan yang bagus.

    # PROSES
    1. Anda akan menerima sebuah topik dari pengguna.
    2. Berdasarkan topik tersebut, tugas Anda adalah membuat **satu (1) pertanyaan pembuka obrolan yang singkat dan menarik**.
    3. Pertanyaan yang Anda buat harus terinspirasi dari **salah satu** gaya di bawah ini (pilih yang paling menarik untuk topik tersebut).

    # PREFERENSI GAYA PERTANYAAN (UNTUK INSPIRASI)
    -   **Kocak & Imajinatif:** Pertanyaan hipotetis, aneh, atau lucu.
    -   **Filosofis & Mendalam:** Pertanyaan tentang makna, nilai, atau pandangan hidup.
    -   **Personal & Nostalgia:** Pertanyaan tentang pengalaman pribadi atau kenangan.

    # ATURAN DAN FORMAT
    - Ciptakan pertanyaan **ORISINAL** yang spesifik dan relevan dengan topik.
    - Pastikan pertanyaannya **singkat** dan langsung ke intinya.
    - Berikan jawaban hanya berupa **satu kalimat pertanyaan saja**.
    - **JANGAN** menggunakan daftar bernomor, bullet point, atau tanda kutip.
    - **JANGAN** menambahkan kalimat pembuka atau penutup apa pun.
`;
}

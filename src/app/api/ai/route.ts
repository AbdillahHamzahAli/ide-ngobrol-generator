import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";
import { generatePrompt } from "@/lib/prompt";
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

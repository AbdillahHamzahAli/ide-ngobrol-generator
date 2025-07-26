"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ChatIdeaGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentIdea, setCurrentIdea] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const generateRandomIdea = async () => {
    setIsGenerating(true);

    const randomIdea = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: selectedCategory }),
    })
      .then((res) => res.json())
      .then((data) => data.idea)
      .catch((error) => {
        console.error("Error fetching idea:", error);
        return "Maaf, terjadi kesalahan saat mengambil ide. Silakan coba lagi.";
      });

    setCurrentIdea(randomIdea);
    setIsGenerating(false);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(false);
    await generateRandomIdea();
  };

  const openCustomPopup = () => {
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-black leading-tight">
            <span className="inline-block relative">
              Ide Ngobrol
              <span className="absolute -top-2 -right-2 text-2xl">✨</span>
            </span>
            <br />
            <span className="bg-yellow-400 px-4 py-2 border-4 border-black inline-block transform -rotate-1 relative">
              Generator
              <span className="absolute -bottom-2 -left-2 text-2xl">⭐</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-black font-bold max-w-2xl mx-auto">
            Bingung mau ngobrol apa? Pilih kategori dan dapatkan ide percakapan
            yang menarik!
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { label: "KOCAK", value: "kocak" },
            { label: "FILOSOFIS", value: "filosofis" },
            { label: "NOSTALGIA", value: "nostalgia" },
          ].map((cat) => (
            <Button
              key={cat.value}
              variant="outline"
              size="lg"
              onClick={() =>
                selectedCategory === cat.value
                  ? setSelectedCategory("")
                  : setSelectedCategory(cat.value)
              }
              className={`text-xl font-black border-4 border-black hover:bg-yellow-400 transform transition-all hover:scale-105 hover:-translate-y-1 ${
                selectedCategory === cat.value
                  ? "bg-yellow-400 text-black shadow-[8px_8px_0px_0px_#000]"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000]"
              }`}
            >
              {cat.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            onClick={openCustomPopup}
            className={`text-xl font-black border-4 border-black transform transition-all hover:scale-105 hover:-translate-y-1 ${
              selectedCategory !== "" &&
              selectedCategory !== "nostalgia" &&
              selectedCategory !== "filosofis" &&
              selectedCategory !== "kocak"
                ? "bg-yellow-400 text-black shadow-[8px_8px_0px_0px_#000]"
                : "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000]"
            }`}
          >
            LAIN-NYA
          </Button>
        </div>

        {/* Idea Display Area */}
        <Card className="w-full min-h-[200px] flex items-center justify-center p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] transform">
          {isGenerating ? (
            <div className="text-center">
              <div className="text-4xl mb-4 animate-spin">🎲</div>
              <p className="text-xl text-black font-bold">
                Sedang mencari ide...
              </p>
            </div>
          ) : currentIdea ? (
            <div className="text-center space-y-4">
              <p className="text-xl md:text-2xl text-center text-black font-bold leading-relaxed">
                {currentIdea}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-base text-center text-black font-bold opacity-40">
                Klik tombol di bawah untuk generate ide dengan AI! 🚀
              </p>
            </div>
          )}
        </Card>

        {/* Main Action Button */}
        <div className="w-full text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={generateRandomIdea}
            disabled={isGenerating}
            className={`w-full max-w-md text-xl md:text-2xl font-black py-6 px-8 bg-yellow-400 text-black border-4 border-black shadow-[8px_8px_0px_0px_#000] transform transition-all hover:scale-105 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_#000] ${
              isGenerating ? "animate-pulse scale-95" : ""
            }`}
          >
            {isGenerating ? "GENERATING... 🎲" : "KASIH IDE NGOBROL DONG! 💬"}
          </Button>
        </div>
        {/* Footer */}
        <footer className="text-center text-sm text-black opacity-70 mt-8">
          <p>
            Created by
            <a
              href="https://github.com/AbdillahHamzahAli"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              Hamzah{" "}
            </a>
            powered by{" "}
            <a
              href="https://gemini.google.com"
              className="text-red-500 hover:underline"
            >
              {""}Gemini ✨
            </a>
          </p>
        </footer>
      </div>

      {/* Custom Input Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-amber-100 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 max-w-md w-full transform">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black text-black mb-2">
                  TAMBAH IDE CUSTOM 💡
                </h2>
                <p className="text-sm font-bold text-black opacity-70">
                  Masukkan ide percakapan kamu sendiri!
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Contoh: Cerita tentang mimpi paling aneh yang pernah kamu alami..."
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-lg py-3 px-4 border-4 border-black font-bold focus:ring-0 focus:border-black"
                />

                <div className="flex gap-4">
                  <Button
                    onClick={handleCustomSubmit}
                    className="flex-1 text-lg font-black py-3 bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transform hover:scale-105"
                  >
                    TAMBAH ✅
                  </Button>
                  <Button
                    onClick={() => {
                      setShowPopup(false);
                    }}
                    variant="outline"
                    className="flex-1 text-lg font-black py-3 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transform hover:scale-105"
                  >
                    BATAL ❌
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

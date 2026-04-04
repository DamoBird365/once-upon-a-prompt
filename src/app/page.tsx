"use client";

import { useState } from "react";
import { KidDetails, StoryTheme } from "@/lib/story";
import KidForm from "@/components/KidForm";
import ThemePicker from "@/components/ThemePicker";
import StoryGenerator from "@/components/StoryGenerator";
import ThemeToggle from "@/components/ThemeToggle";

type Step = "details" | "theme" | "generate";

const defaultKid = (): KidDetails => ({
  name: "",
  pronouns: "he",
  age: 5,
});

export default function Home() {
  const [step, setStep] = useState<Step>("details");
  const [kids, setKids] = useState<KidDetails[]>([defaultKid()]);
  const [theme, setTheme] = useState<StoryTheme | null>(null);
  const [storyExtra, setStoryExtra] = useState("");

  const kidsValid = kids.every((k) => k.name.trim().length > 0);

  const reset = () => {
    setStep("details");
    setKids([defaultKid()]);
    setTheme(null);
    setStoryExtra("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-blue-950">
      <ThemeToggle />

      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
          ✨ Once Upon a Prompt
        </h1>
        <p className="mt-2 text-gray-500 dark:text-slate-400 text-lg">
          Personalised AI bedtime stories for your little ones
        </p>
      </header>

      {/* Progress dots */}
      <div className="flex justify-center gap-3 py-4">
        {[
          { id: "details", label: "👦 Kids" },
          { id: "theme", label: "📖 Theme" },
          { id: "generate", label: "✨ Story" },
        ].map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            {i > 0 && (
              <div
                className={`w-8 h-0.5 ${
                  step === s.id || (step === "generate" && i <= 2) || (step === "theme" && i <= 1)
                    ? "bg-purple-300 dark:bg-blue-500"
                    : "bg-gray-200 dark:bg-slate-700"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                step === s.id
                  ? "bg-purple-500 dark:bg-blue-500 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700"
              }`}
            >
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 dark:border-slate-700/50 p-6 md:p-8">
          {/* Step 1: Kid Details */}
          {step === "details" && (
            <div className="space-y-6">
              <KidForm kids={kids} onChange={setKids} />

              {/* Story extras */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-purple-400 dark:text-blue-400 hover:text-purple-600 dark:hover:text-blue-300 transition-colors select-none">
                  💡 Anything else to add to the story? <span className="text-xs text-gray-400 dark:text-slate-500">(optional)</span>
                </summary>
                <div className="mt-3">
                  <textarea
                    value={storyExtra}
                    onChange={(e) => setStoryExtra(e.target.value)}
                    placeholder="e.g. Katie is starting school next week, or they love dancing in the rain"
                    maxLength={150}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-400 dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-slate-600 transition-all resize-none"
                  />
                  <p className="text-right text-xs text-gray-300 dark:text-slate-600 mt-1">
                    {storyExtra.length}/150
                  </p>
                </div>
              </details>

              <button
                onClick={() => setStep("theme")}
                disabled={!kidsValid}
                className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 dark:from-blue-600 dark:to-cyan-600 hover:from-purple-600 hover:to-pink-600 dark:hover:from-blue-500 dark:hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Next: Pick a Theme →
              </button>
            </div>
          )}

          {/* Step 2: Theme Picker */}
          {step === "theme" && (
            <div className="space-y-6">
              <ThemePicker
                selected={theme}
                onSelect={(t) => {
                  setTheme(t);
                  setStep("generate");
                }}
              />
              <button
                onClick={() => setStep("details")}
                className="text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
              >
                ← Back to kid details
              </button>
            </div>
          )}

          {/* Step 3: Generate / Results */}
          {step === "generate" && theme && (
            <StoryGenerator kids={kids} theme={theme} storyExtra={storyExtra} onReset={reset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-sm text-gray-400 dark:text-slate-500">
        <p>
          Built with 💜 by{" "}
          <a
            href="https://damobird365.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 dark:text-blue-400 hover:underline"
          >
            DamoBird365
          </a>
          {" · "}
          Powered by{" "}
          <a
            href="https://copilot.microsoft.com/labs/audio-expression"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 dark:text-blue-400 hover:underline"
          >
            Copilot Labs
          </a>
        </p>
        <p className="mt-1 text-xs">
          ⚠️ Stories are AI-generated — always listen along with your little ones!
        </p>
      </footer>
    </div>
  );
}

"use client";

import { StoryTheme, storyThemes } from "@/lib/story";

interface ThemePickerProps {
  selected: StoryTheme | null;
  onSelect: (theme: StoryTheme) => void;
}

export default function ThemePicker({ selected, onSelect }: ThemePickerProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-600 dark:text-cyan-400">
        📖 Pick a story theme
      </h2>
      <p className="text-gray-500 dark:text-slate-400 text-sm">
        What kind of adventure should they go on?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {storyThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              selected?.id === theme.id
                ? "bg-amber-100 dark:bg-blue-900/60 border-2 border-amber-400 dark:border-blue-400 shadow-lg scale-105"
                : "bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-blue-500 hover:bg-amber-50 dark:hover:bg-blue-950/50 hover:scale-102"
            }`}
          >
            <span className="text-4xl">{theme.emoji}</span>
            <span
              className={`text-xs font-semibold text-center leading-tight ${
                selected?.id === theme.id
                  ? "text-amber-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-slate-300"
              }`}
            >
              {theme.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

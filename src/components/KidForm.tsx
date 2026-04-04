"use client";

import { KidDetails } from "@/lib/story";

interface KidFormProps {
  kids: KidDetails[];
  onChange: (kids: KidDetails[]) => void;
}

const COLOURS = [
  { name: "Red", value: "red", bg: "bg-red-500", ring: "ring-red-400", darkRing: "dark:ring-red-500" },
  { name: "Blue", value: "blue", bg: "bg-blue-500", ring: "ring-blue-400", darkRing: "dark:ring-blue-400" },
  { name: "Green", value: "green", bg: "bg-green-500", ring: "ring-green-400", darkRing: "dark:ring-green-400" },
  { name: "Yellow", value: "yellow", bg: "bg-yellow-400", ring: "ring-yellow-300", darkRing: "dark:ring-yellow-400" },
  { name: "Purple", value: "purple", bg: "bg-purple-500", ring: "ring-purple-400", darkRing: "dark:ring-purple-400" },
  { name: "Pink", value: "pink", bg: "bg-pink-400", ring: "ring-pink-300", darkRing: "dark:ring-pink-400" },
  { name: "Orange", value: "orange", bg: "bg-orange-500", ring: "ring-orange-400", darkRing: "dark:ring-orange-400" },
  { name: "Teal", value: "teal", bg: "bg-teal-500", ring: "ring-teal-400", darkRing: "dark:ring-teal-400" },
];

const PRONOUNS: { label: string; value: "he" | "she" | "they" }[] = [
  { label: "👦 He/Him", value: "he" },
  { label: "👧 She/Her", value: "she" },
  { label: "🧒 They/Them", value: "they" },
];

const defaultKid = (): KidDetails => ({
  name: "",
  pronouns: "he",
  age: 5,
});

export default function KidForm({ kids, onChange }: KidFormProps) {
  const updateKid = (index: number, updates: Partial<KidDetails>) => {
    const updated = [...kids];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const addKid = () => {
    if (kids.length < 3) {
      onChange([...kids, defaultKid()]);
    }
  };

  const removeKid = (index: number) => {
    if (kids.length > 1) {
      onChange(kids.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-700 dark:text-blue-400">
        👦👧 Who&apos;s in the story?
      </h2>
      <p className="text-gray-500 dark:text-slate-400 text-sm">
        Add up to 3 children — they&apos;ll be the heroes!
      </p>

      {kids.map((kid, index) => (
        <div
          key={index}
          className="relative p-5 rounded-2xl border-2 border-dashed border-purple-200 dark:border-blue-800 bg-purple-50/50 dark:bg-slate-800/50 space-y-4"
        >
          {kids.length > 1 && (
            <button
              onClick={() => removeKid(index)}
              className="absolute top-3 right-3 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xl"
              title="Remove"
            >
              ✕
            </button>
          )}

          <div className="text-sm font-semibold text-purple-500 dark:text-blue-400 uppercase tracking-wide">
            Child {index + 1}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={kid.name}
              onChange={(e) => updateKid(index, { name: e.target.value })}
              placeholder="e.g. Katie"
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-lg font-medium focus:ring-2 focus:ring-purple-400 dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-slate-600 transition-all"
            />
          </div>

          {/* Pronouns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Pronouns
            </label>
            <div className="flex gap-2">
              {PRONOUNS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => updateKid(index, { pronouns: p.value })}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all ${
                    kid.pronouns === p.value
                      ? "bg-purple-500 dark:bg-blue-500 text-white shadow-md scale-105"
                      : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-2 border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-blue-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Age: <span className="text-purple-600 dark:text-blue-400 font-bold text-lg">{kid.age}</span>
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={kid.age}
              onChange={(e) =>
                updateKid(index, { age: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-purple-200 dark:bg-blue-900 rounded-lg appearance-none cursor-pointer accent-purple-500 dark:accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1">
              <span>1</span>
              <span>12</span>
            </div>
          </div>

          {/* Colour (optional) */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-purple-400 dark:text-blue-400 hover:text-purple-600 dark:hover:text-blue-300 transition-colors select-none">
              🎨 Add a favourite colour? <span className="text-xs text-gray-400 dark:text-slate-500">(optional)</span>
            </summary>
            <div className="mt-3 flex flex-wrap gap-3">
              {COLOURS.map((c) => (
                <button
                  key={c.value}
                  onClick={() =>
                    updateKid(index, {
                      colour: kid.colour === c.value ? undefined : c.value,
                    })
                  }
                  title={c.name}
                  aria-label={`${c.name}${kid.colour === c.value ? " (selected)" : ""}`}
                  className={`w-10 h-10 rounded-full ${c.bg} transition-all border-2 border-transparent ${
                    kid.colour === c.value
                      ? `ring-4 ${c.ring} ${c.darkRing} ring-offset-2 dark:ring-offset-slate-800 scale-110`
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </details>

          {/* Companion (optional) */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-purple-400 dark:text-blue-400 hover:text-purple-600 dark:hover:text-blue-300 transition-colors select-none">
              🧸 Add a pet or favourite toy? <span className="text-xs text-gray-400 dark:text-slate-500">(optional)</span>
            </summary>
            <div className="mt-3 space-y-3 pl-1">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={kid.companionName || ""}
                  onChange={(e) => updateKid(index, { companionName: e.target.value })}
                  placeholder="e.g. Mr Whiskers"
                  maxLength={30}
                  className="w-full px-3 py-2 rounded-xl border-2 border-purple-100 dark:border-blue-900 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-300 dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-slate-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                  Short description
                </label>
                <input
                  type="text"
                  value={kid.companionDesc || ""}
                  onChange={(e) => updateKid(index, { companionDesc: e.target.value })}
                  placeholder="e.g. ginger cat, stuffed dinosaur, fluffy bunny toy"
                  maxLength={60}
                  className="w-full px-3 py-2 rounded-xl border-2 border-purple-100 dark:border-blue-900 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-purple-300 dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 dark:placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>
          </details>
        </div>
      ))}

      {kids.length < 3 && (
        <button
          onClick={addKid}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-300 dark:border-blue-700 text-purple-500 dark:text-blue-400 font-semibold hover:bg-purple-50 dark:hover:bg-blue-950/50 hover:border-purple-400 dark:hover:border-blue-500 transition-all text-lg"
        >
          + Add another child
        </button>
      )}
    </div>
  );
}

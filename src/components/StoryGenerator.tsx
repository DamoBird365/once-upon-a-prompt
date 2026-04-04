"use client";

import { useState, useRef } from "react";
import {
  KidDetails,
  StoryTheme,
  StoryLength,
  storyLengths,
  buildStoryPrompt,
  buildImagePrompt,
} from "@/lib/story";

interface StoryGeneratorProps {
  kids: KidDetails[];
  theme: StoryTheme;
  storyExtra?: string;
  onReset: () => void;
}

export default function StoryGenerator({
  kids,
  theme,
  storyExtra,
  onReset,
}: StoryGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [storyLength, setStoryLength] = useState<StoryLength>("medium");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageNote, setImageNote] = useState("");
  const [generated, setGenerated] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generate = async () => {
    setLoading(true);
    setError("");
    setProgress("✨ Writing your story and painting the picture...");
    setTitle("");
    setStoryText("");
    setAudioUrl(null);
    setImageData(null);
    setImageNote("");

    try {
      const storyPrompt = buildStoryPrompt(kids, theme, storyExtra, storyLength);
      const imagePrompt = buildImagePrompt(kids, theme);

      const [storyRes, imageRes] = await Promise.all([
        fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "story",
            text: storyPrompt,
            voice: "Rain",
          }),
        }),
        fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: imagePrompt,
            model: "image-02",
            width: 768,
            height: 512,
            image_format: "jpeg",
          }),
        }),
      ]);

      // Handle story
      if (!storyRes.ok) {
        const err = await storyRes.json();
        throw new Error(
          err.details || err.error || "Story generation failed"
        );
      }
      const storyData = await storyRes.json();

      if (storyData.audio) {
        const audioBlob = base64ToBlob(storyData.audio, "audio/mpeg");
        setAudioUrl(URL.createObjectURL(audioBlob));
      }
      if (storyData.generatedTitle) setTitle(storyData.generatedTitle);
      if (storyData.storyText) setStoryText(storyData.storyText);

      // Handle image (partial failure OK)
      if (!imageRes.ok) {
        setImageNote(
          "🎨 The illustration couldn't be created this time, but your story is ready!"
        );
      } else {
        const imgData = await imageRes.json();
        if (imgData.base64ImageData) {
          setImageData(`data:image/jpeg;base64,${imgData.base64ImageData}`);
        } else {
          setImageNote(
            "🎨 The illustration couldn't be created this time, but your story is ready!"
          );
        }
      }

      setGenerated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  if (!generated && !loading) {
    return (
      <div className="space-y-6 text-center">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-purple-100 dark:border-blue-800">
          <p className="text-gray-600 dark:text-slate-300">
            <span className="text-2xl">✨</span>
            <br />
            Ready to create a{" "}
            <strong className="text-amber-600 dark:text-cyan-400">
              {theme.emoji} {theme.label}
            </strong>{" "}
            story for{" "}
            <strong className="text-purple-600 dark:text-blue-400">
              {kids.map((k) => k.name || "your child").join(" & ")}
            </strong>
            !
          </p>
        </div>

        {/* Story length picker */}
        <div>
          <label className="block text-sm font-semibold text-purple-600 dark:text-blue-400 mb-3">
            How long should the story be?
          </label>
          <div className="flex gap-2">
            {storyLengths.map((len) => (
              <button
                key={len.id}
                onClick={() => setStoryLength(len.id)}
                className={`flex-1 py-3 px-1.5 sm:px-2 rounded-xl font-medium text-xs sm:text-sm transition-all ${
                  storyLength === len.id
                    ? "bg-purple-500 dark:bg-blue-500 text-white shadow-md scale-105"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-2 border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-blue-500"
                }`}
              >
                <span className="block text-lg">{len.emoji}</span>
                <span className="block">{len.label}</span>
                <span className={`block text-xs mt-0.5 ${storyLength === len.id ? "text-purple-200 dark:text-blue-200" : "text-gray-400 dark:text-slate-500"}`}>
                  {len.time}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full py-4 px-8 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-blue-600 dark:via-cyan-600 dark:to-teal-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 dark:hover:from-blue-500 dark:hover:via-cyan-500 dark:hover:to-teal-500 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          ✨ Create My Story!
        </button>

        <button
          onClick={onReset}
          className="text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
        >
          ← Go back and change something
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="text-6xl animate-bounce">📖</div>
        <p className="text-xl font-semibold text-purple-600 dark:text-blue-400 animate-pulse">
          {progress}
        </p>
        <div className="flex justify-center gap-2">
          {["🌟", "⭐", "💫", "✨", "🌟"].map((star, i) => (
            <span
              key={i}
              className="text-2xl animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {star}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400 dark:text-slate-500">
          This usually takes 10–20 seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          <p className="font-semibold">😔 Oh no!</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={generate}
            className="mt-3 text-sm font-medium text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            Try again?
          </button>
        </div>
      )}

      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400">
          {theme.emoji} {title}
        </h2>
      )}

      {imageData && (
        <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageData}
            alt={title || "Story illustration"}
            className="w-full h-auto"
          />
        </div>
      )}

      {imageNote && (
        <p className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3">
          {imageNote}
        </p>
      )}

      {audioUrl && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-2xl p-4 border-2 border-purple-100 dark:border-blue-800">
          <p className="text-sm font-semibold text-purple-600 dark:text-blue-400 mb-2">
            🔊 Listen to the story
          </p>
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            className="w-full"
            autoPlay
          />
          <a
            href={audioUrl}
            download={`${title || "bedtime-story"}.mp3`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-purple-500 dark:text-blue-400 hover:text-purple-700 dark:hover:text-blue-300 transition-colors"
          >
            ⬇️ Download story
          </a>
        </div>
      )}

      {storyText && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-purple-500 dark:text-blue-400 hover:text-purple-700 dark:hover:text-blue-300 transition-colors">
            📜 Read the story script
          </summary>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-slate-300 font-sans bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-gray-100 dark:border-slate-700 leading-relaxed">
            {storyText}
          </pre>
        </details>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={generate}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-purple-700 dark:text-blue-300 bg-purple-100 dark:bg-blue-950/50 hover:bg-purple-200 dark:hover:bg-blue-900/50 transition-all"
        >
          🔄 Different version
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 dark:from-blue-600 dark:to-cyan-600 hover:from-pink-600 hover:to-purple-600 dark:hover:from-blue-500 dark:hover:to-cyan-500 transition-all shadow-md"
        >
          ✨ New Story
        </button>
      </div>
    </div>
  );
}

function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
}

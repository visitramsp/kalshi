import { useState } from "react";

export default function PredictionBox() {
  const MAX_CHARS = 500;
  const [text, setText] = useState("");

  return (
    <div className="w-full border dark:border-gray-800 border-gray-200 rounded-xl p-4">
      {/* Textarea */}
      <textarea
        placeholder="What's your prediction?"
        value={text}
        maxLength={MAX_CHARS}
        onChange={(e) => setText(e.target.value)}
        className="w-full resize-none outline-none text-lg text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-700"
        rows={3}
      />

      {/* Bottom Controls */}
      <div className="flex items-center justify-between mt-3">
        {/* Left: GIF */}
        <button className="text-sm font-medium text-gray-500 hover:text-black">
          GIF
        </button>

        {/* Right: Counter + Post */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {MAX_CHARS - text.length} left
          </span>

          <button
            disabled={!text.trim()}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              text.trim()
                ? "dark:bg-white dark:text-black/80 bg-black font-semibold text-white hover:bg-black/90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed font-semibold"
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

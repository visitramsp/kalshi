"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type LeaderboardItem = {
  rank: number;
  username: string;
  profit: number;
  roi: number;
};

interface MarketLeaderboardProps {
  data: LeaderboardItem[];
}

export default function MarketLeaderboard({ data }: MarketLeaderboardProps) {
  const [expanded, setExpanded] = useState(false);

  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:border-[#2B394D] bg-white dark:bg-[#0b0f1a] p-5">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
          Market Leaderboard
        </h2>
        <span className="text-xs text-gray-400">Live Ranking</span>
      </div>

      {/* ===== Table Head ===== */}
      <div className="grid grid-cols-4 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <span>Rank</span>
        <span>User</span>
        <span>Profit</span>
        <span className="text-right">ROI</span>
      </div>

      {/* ===== Animated Rows Wrapper ===== */}
      <div
        className={`
          overflow-hidden
          transition-[max-height] duration-500 ease-in-out
          ${expanded ? "max-h-[1000px]" : "max-h-[60px]"}
        `}
      >
        <div className="space-y-3">
          {safeData.map((item, index) => (
            <div
              key={index}
              className={`
                grid grid-cols-4 items-center
                px-3 py-3 rounded-md
                border border-gray-200 dark:border-[#2B394D]
                bg-gray-50 dark:bg-black/30
                transition
                ${item.rank === 1 ? "ring-1 ring-[#c3a66e]/50" : ""}
              `}
            >
              {/* Rank */}
              <div>
                <span
                  className={`
                    inline-flex h-7 w-7 items-center justify-center
                    rounded-full text-xs font-bold text-white
                    ${item.rank === 1 ? "bg-[#c3a66e]" : "bg-slate-600"}
                  `}
                >
                  {item.rank}
                </span>
              </div>

              {/* Username */}
              <div className="truncate text-sm font-medium text-[#8160ee]">
                {item.username}
              </div>

              {/* Profit */}
              <div className="text-sm font-semibold text-emerald-500">
                ${item.profit.toFixed(2)}
              </div>

              {/* ROI */}
              <div className="text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
                {item.roi.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Expand / Collapse Button ===== */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          mt-5 w-full flex items-center justify-center gap-2
          rounded-lg py-2.5 text-sm font-semibold
          bg-gray-100 text-gray-900
          dark:bg-[#1a2233] dark:text-white
          hover:bg-gray-200 dark:hover:bg-[#24304a]
          transition-colors duration-300 ease-in-out
        "
      >
        {expanded ? "Collapse Leaderboard" : "View Full Leaderboard"}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ===== Footer ===== */}
      <div className="mt-3 text-center text-[11px] text-gray-500 dark:text-gray-400">
        Rankings based on profit & ROI
      </div>
    </div>
  );
}

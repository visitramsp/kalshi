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
  return (
    <div className="w-full  rounded-2xl border dark:border-[#c3a66e]/50 border-gray-300 p-5 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-[#c3a66e]">
          🏆 Market Leaderboard
        </h2>
        <span className="text-xs text-slate-400">Live Ranking</span>
      </div>

      <div className="grid grid-cols-4 text-xs dark:text-[#c3a66e] text-gray-700 px-3 py-2">
        <span>Rank</span>
        <span>User</span>
        <span className="text-right">Profit</span>
        <span className="text-right">ROI</span>
      </div>

      <div className="space-y-2">
        {data.map((item: LeaderboardItem, index: number) => (
          <div
            key={index}
            className={`grid grid-cols-4 items-center px-3 py-3 rounded-xl
              border dark:border-[#c3a66e]/40 border-gray-300
              ${
                item.rank === 1
                  ? ""
                  : "bg-white/5 hover:bg-white/10"
              }
              transition`}
          >
            {/* Rank */}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold
                  ${
                    item.rank === 1
                      ? "bg-amber-400 text-black"
                      : "bg-slate-700 text-white"
                  }`}
              >
                {item.rank}
              </span>
            </div>

            {/* Username */}
            <div className="text-sm text-gray-600 dark:text-[#c3a66e] font-medium truncate">
              {item.username}
            </div>

            {/* Profit */}
            <div className="text-right text-sm font-semibold text-emerald-400">
              ₹{item.profit.toFixed(2)}
            </div>

            {/* ROI */}
            <div className="text-right text-xs font-semibold text-sky-400">
              {item.roi.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[11px] text-[#c3a66e]/80">
        Rankings based on profit & ROI
      </div>
    </div>
  );
}

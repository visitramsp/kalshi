type OrderSide = "BUY" | "SELL";

type OrderItem = {
  id: number;
  rank?: number;
  shares: number;
  side: OrderSide;
  maxCost?: number;
  minProceeds?: number;
};

interface OrderListProps {
  data: OrderItem[];
  cancelOrders: (orderId: number) => void;
}

export default function OrderList({ data, cancelOrders }: OrderListProps) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0b1220]/80 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-white">
          Open Orders
        </h2>
        {/* <span className="text-xs text-slate-400">Live Ranking</span> */}
      </div>

      {/* Table Head */}
      <div className="grid grid-cols-5 px-3 py-2 text-[11px] uppercase tracking-wide text-slate-200 border-b border-white/10">
        <span>Shares</span>
        <span>Price</span>
        <span>Type</span>
        <span className="text-right">Status</span>
        <span className="text-right">Action</span>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-1">
        {data.map((item, index) => {
          const isTop = item.rank === 1;
          const isBuy = item?.side === "BUY";

          return (
            <div
              key={index}
              className={`grid grid-cols-5 items-center rounded-xl px-3 py-3
                border border-white/5
                ${
                  isTop
                    ? "bg-gradient-to-r from-amber-500/15 to-transparent shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                    : "bg-white/[0.03] hover:bg-white/[0.06]"
                }
                transition-all duration-200`}
            >
              {/* Shares */}
              <div className="text-sm font-medium text-white">
                {Number(item?.shares || 0).toFixed(2)}
              </div>

              {/* Price */}
              <div className="text-sm text-slate-200">
                ₹{" "}
                {Number(isBuy ? item?.maxCost : item?.minProceeds || 0).toFixed(
                  2
                )}
              </div>

              <div
                className={`text-xs font-semibold w-fit px-2 py-1 rounded-md
                  ${
                    isBuy
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
              >
                {item?.side || "--"}
              </div>

              {/* Status */}
              <div className="text-right">
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-500/15 text-blue-400">
                  Open
                </span>
              </div>

              {/* ROI */}
              <div className="flx flex-row items-end justify-end">
                <button
                  onClick={() => cancelOrders(item?.id)}
                  className=" float-end text-sm font-semibold py-1 cursor-pointer px-2 rounded bg-red-400 text-white w-fit"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

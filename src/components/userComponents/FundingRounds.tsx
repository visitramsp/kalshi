"use client";

interface balanceText {
  balance: string;
}
export default function FundingRounds({ balance }: { balance: balanceText }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Funding Rounds
      </h2>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Undisclosed · 21 Nov 2025</p>
            <p className="mt-1 text-sm">
              Valuation <span className="text-blue-600 font-medium">$11B</span>
            </p>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-slate-500">Raised</p>
              <p className="font-semibold text-slate-900">
                ${Number(balance?.balance ?? 0).toFixed(2)} kkk
              </p>
            </div>
            <div>
              <p className="text-slate-500">Round Type</p>
              <p className="font-semibold text-slate-900">Private</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

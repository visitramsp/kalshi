interface balanceText {
  balance: string;
}
export default function FundingStats({ balance }: { balance: balanceText }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Status" value="Funding Round" />
      <StatCard
        title="Total Raised/Valuation"
        value={`$${Number(balance?.balance ?? 0).toFixed(2)}`}
      />
      <StatCard title="Valuation" value="$11B" />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-xl font-semibold text-blue-600">{value}</h3>
    </div>
  );
}

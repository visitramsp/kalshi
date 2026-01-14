const investors = [
  "Sequoia Capital",
  "Andreessen Horowitz (a16z)",
  "Paradigm",
  "CapitalG",
  "Neo",
  "Anthos Capital",
];

export default function InvestorsList() {
  return (
    <section className="mt-10 ">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Investors</h2>

      <div className="flex flex-wrap gap-3">
        {investors.map((inv) => (
          <span
            key={inv}
            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm text-blue-700 font-medium"
          >
            {inv}
          </span>
        ))}
      </div>
    </section>
  );
}

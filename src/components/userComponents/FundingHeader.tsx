export default function FundingHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            K
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">User name</h1>
            <p className="text-sm text-slate-500">
              502 Watchlists · <span className="text-blue-600">CeFi</span>
            </p>
          </div>
        </div>

        <button className="rounded-lg cursor-pointer bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Play Now
        </button>
      </div>

      <div className="flex gap-6 text-sm">
        <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
          Fundraising
        </span>
        <span className="text-slate-500 hover:text-blue-600 cursor-pointer">
          News
        </span>
        <span className="text-slate-500 hover:text-blue-600 cursor-pointer">
          Team
        </span>
      </div>
    </div>
  );
}

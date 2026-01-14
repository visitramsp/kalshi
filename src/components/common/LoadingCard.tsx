import React from "react";

const LoadingCard = () => {
  return (
    <div className="border border-gray-200 overflow-hidden relative min-h-48 rounded-xl p-4 animate-pulse">
      {/* Header: Avatar + Title */}
      <div className="flex items-center mb-3">
        <div className="mr-2 w-10 h-10 bg-gray-200 rounded" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>

      {/* Options List */}
      <div className="text-xs mt-4 mb-5 h-24 space-y-1">
        {[1, 2, 3, 4].map((_, idx) => (
          <div key={idx} className="flex gap-2 justify-between items-center">
            <div className="flex-1 h-4 bg-gray-200 rounded" />

            <div className="flex items-center gap-1.5">
              <div className="h-4 w-12 bg-gray-200 rounded" />
              <div className="py-1 px-2 w-12 h-5 bg-gray-300 rounded-xs" />
              <div className="py-1 px-2 w-12 h-5 bg-gray-300 rounded-xs" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar: Volume + Add Button */}
      <div className="flex absolute bottom-3 w-[88%] justify-between items-center text-xs">
        <div className="h-4 w-16 bg-gray-200 rounded" />

        {/* <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div> */}
      </div>
    </div>
  );
};

export default LoadingCard;

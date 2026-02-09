const MarketSkeleton = () => {
  return (
    <div className=" min-h-screen pt-10 lg:pt-10">
      <div className="max-w-[1268px] mx-auto px-4">
        <div className="flex flex-row items-center gap-4 mb-6 animate-pulse">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-full">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 w-16 md:w-20 bg-gray-200 dark:bg-gray-700 rounded"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 animate-pulse">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6" />
            <div className="flex justify-between mb-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border border-gray-200 dark:border-[#334661] rounded-lg p-3 mb-2"
              >
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="flex gap-2">
                  <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200  dark:border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex justify-between px-3 py-1 mb-1 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ))}

            <div className="h-4 w-32 flex items-center mx-auto justify-center bg-green-200/50 dark:bg-green-800/40 rounded my-3" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex justify-between px-3 py-1 mb-1 bg-gray-100 dark:bg-gray-800 rounded"
              >
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded" />{" "}
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-2xl mt-6 border border-gray-200 dark:border-white/10 p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-40 rounded  bg-gray-200 dark:bg-white/10"></div>
            <div className="h-3 w-20 rounded  bg-gray-200 dark:bg-white/10"></div>
          </div>

          <div className="grid grid-cols-4 px-3 py-2 gap-2">
            <div className="h-3 w-10 dark:bg-white/10 rounded  bg-gray-200"></div>
            <div className="h-3 w-16 dark:bg-white/10 rounded  bg-gray-200"></div>
            <div className="h-3 w-12 dark:bg-white/10 rounded  bg-gray-200 ml-auto"></div>
            <div className="h-3 w-10 dark:bg-white/10 rounded  bg-gray-200 ml-auto"></div>
          </div>

          <div className="space-y-2 mt-2">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center px-3 py-3 rounded-xl
            border  border-gray-200 dar:border-white/5  bg-gray-200 dark:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-white/10  bg-gray-200"></div>
                </div>

                <div className="h-4 w-24 rounded bg-white/10  bg-gray-200"></div>

                <div className="h-4 w-20 rounded bg-white/10  bg-gray-200 ml-auto"></div>

                <div className="h-4 w-12 rounded bg-white/10  bg-gray-200 ml-auto"></div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <div className="h-3 w-40 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSkeleton;

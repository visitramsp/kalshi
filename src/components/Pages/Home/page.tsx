"use client";
import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import Authentication from "@/components/Pages/auth";
import { useSelector } from "react-redux";
import LoadingCard from "@/components/common/LoadingCard";
import BuySell from "@/components/Modal/BuySell/page";
import { commonQuestionFindById } from "@/components/service/apiService/category";
import { useRouter } from "next/navigation";
import { GiNinjaStar } from "react-icons/gi";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

import {
  isWatchListInterface,
  OptionItem,
  QuestionItem,
  QuestionItemSecond,
  RootState,
} from "@/utils/typesInterface";
import { delay, truncateValue } from "@/utils/Content";
import {
  fetchWatchList,
  postQuestionBookUnBookMark,
} from "@/components/service/apiService/user";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import moment from "moment";
import GlobalLoader from "@/components/common/Loader";

interface selectedSubCategory {
  category: {
    selectSubCategory: {
      id: number;
      isActive: Boolean;
      name: String;
      slug: String;
    };
  };
}
interface eventSubCategory {
  category: {
    isEvent: boolean;
  };
}

export interface HideFilter {
  sports: boolean;
  crypto: boolean;
  earnings: boolean;
}

export interface CategoryFilters {
  search: "";
  frequency: "All" | "Daily" | "Weekly" | "Monthly";
  status: "Active" | "Resolved";
  sortBy:
    | "Newest"
    | "24h Volume"
    | "Total Volume"
    | "Competitive"
    | "Ending Soon";
  hideFilter: HideFilter;
}

export interface CategoryState {
  category: Record<string, any>;
  subCategory: any[];
  eventCategory: any[];
  selectSubCategory: Record<string, any>;
  isEvent: boolean;
  filters: CategoryFilters;
}

export interface RootStateNewssss {
  category: CategoryState;
}

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionItem[]>([]);
  const [questionBookMark, setQuestionBookMark] = useState<QuestionItem[]>([]);
  const [buyType, setBuyType] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionItem | null>(null);
  const [rowDetails, setRowDetails] = useState<QuestionItemSecond | null>(null);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);
  // const [eventSubCategoryId, setEventSubCategoryId] = useState<number | null>(
  //   null,
  // );
  const eventSubCategoryId = null;
  const getToken = localStorage.getItem("token");
  const router = useRouter();
  const categoryDetails = useSelector(
    (state: RootState) => state?.category?.category,
  );
  const selectedSubCategory = useSelector(
    (state: selectedSubCategory) => state?.category?.selectSubCategory,
  );
  const isEvent = useSelector(
    (state: eventSubCategory) => state?.category?.isEvent,
  );

  //
  const filtersForCategory = useSelector(
    (state: RootStateNewssss) => state?.category?.filters,
  );
  const isWatchList = useSelector(
    (state: isWatchListInterface) => state?.category?.isWatchList,
  );
  const userDetails = useSelector((state: RootState) => state?.user);
  const isFilterQuestion = useSelector(
    (state: isWatchListInterface) => state?.category?.isFilterQuestion,
  );
  const { search, sortBy, frequency, status, hideFilter } = filtersForCategory;
  const CATEGORY_MAP: Record<string, number> = {
    earnings: 18,
    sports: 7,
    crypto: 14,
  };

  const eventCategory = useSelector(
    (state: any) => state?.category?.eventCategory,
  );

  const hiddenCategories = Object.entries(hideFilter)
    .filter(([_, value]) => value === true)
    .map(([key]) => CATEGORY_MAP[key]);

  const questionAllList = useCallback(async () => {
    setLoader(true);
    try {
      const ids = isEvent ? eventSubCategoryId : selectedSubCategory?.id;

      const [response] = await Promise.all([
        commonQuestionFindById(
          categoryDetails?.id || 1,
          // userDetails?.user?.id as string,
          ids,
          sortBy,
          frequency,
          status,
          search,
          hiddenCategories,
        ),
        delay(1000),
      ]);

      if (response?.success) {
        setQuestionData(response.data.questions ?? []);
      } else {
        setQuestionData([]);
      }
    } catch {
      setQuestionData([]);
    } finally {
      setLoader(false);
    }
  }, [
    isWatchList,
    categoryDetails?.id,
    userDetails?.user?.id,
    selectedSubCategory?.id,
    eventSubCategoryId,
    isEvent,
    sortBy,
    frequency,
    status,
    search,
    hiddenCategories.join(","),
  ]);

  useEffect(() => {
    questionAllList();
  }, [questionAllList]);

  const handleBuyNow = (
    row: QuestionItemSecond,
    item: OptionItem,
    type: string,
    idx: number,
  ) => {
    if (!getToken) {
      setIsOpen(true);
      return;
    }
    setOptionIndex(idx);
    setRowDetails(row);
    setOptions(item);
    setBuyType(type);
    setIsModalOpen(true);
  };
  const optionColors = [
    "34,211,238", // cyan
    "250,204,21", // yellow
    "96,165,250", // blue
    "52,211,153", // green
    "251,146,60", // orange
    "168,85,247", // purple
    "244,63,94", // red
  ];

  const goToDetails = (questionId: string) => {
    router.push(`/market/${questionId}`);
  };

  const bookMarkUnBookMark = async (id: string, status: boolean) => {
    try {
      if (isWatchList) {
        setQuestionBookMark((prev: any[]) =>
          prev.filter((item) => item.id !== id),
        );
      } else {
        setQuestionData((prev: any[]) =>
          prev.map((item) =>
            item.id === id ? { ...item, isBookmark: !item.isBookmark } : item,
          ),
        );
      }

      const payload = { questionId: id };
      const response = await postQuestionBookUnBookMark(payload);
      if (response.success) {
        toast.success(
          response.data?.bookmarked
            ? "Question added to bookmarks"
            : "Question removed from bookmarks",
        );
      } else {
        toast.error(response.message);
      }
    } catch {
      toast.success("");
    }
  };
  const getWatchList = async () => {
    try {
      const response = await fetchWatchList();

      if (response.success) {
        setQuestionBookMark(response?.data?.questions || []);
      } else {
        setQuestionBookMark([]);
      }
    } catch {
      setQuestionBookMark([]);
    }
  };
  useEffect(() => {
    if (isWatchList) {
      getWatchList();
    }
  }, [isWatchList]);

  const questionListFilter = isWatchList ? questionBookMark : questionData;

  return (
    <>
      <div
        className={`max-w-[1268px] mx-auto px-4 pb-10 ${
          eventCategory?.length > 0 && isFilterQuestion
            ? "pt-8 lg:pt-32"
            : eventCategory?.length > 0
              ? "pt-8 lg:pt-32"
              : selectedSubCategory == null && isFilterQuestion
                ? "pt-8 lg:pt-2"
                : "pt-44 lg:pt-32"
        }`}
      >
        <div
          className={
            // isEvent
            //   ? ""
            //   :
            "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 pt-10 lg:pt-0"
          }
        >
          {
            // isEvent ? (
            //   <SubCategory
            //     eventSubCategoryId={eventSubCategoryId}
            //     setEventSubCategoryId={setEventSubCategoryId}
            //     questionData={questionListFilter}
            //   />
            // ) :

            loader ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]?.map((row) => (
                <LoadingCard key={row} />
              ))
            ) : questionListFilter && questionListFilter.length > 0 ? (
              questionListFilter?.map((row: QuestionItem, index) => {
                const metaData = (() => {
                  if (!row?.metadata) return null;
                  if (typeof row?.metadata === "object") {
                    return row?.metadata;
                  }
                  try {
                    return JSON.parse(row?.metadata);
                  } catch (e) {
                    return null;
                  }
                })();
                // const maxPrice = Math.max(
                //   ...(row?.options?.map((opt) => opt.price) || [0]),
                // );

                const prices = row?.options?.map((opt) => opt.price) || [];

                const maxPrice = Math.max(...prices);
                const minPrice = Math.min(...prices);

                // check if all options have same price
                const isAllEqual = maxPrice === minPrice;
                return (
                  <div
                    key={index}
                    className="border relative border-[var(--color-borderlight)]
                        dark:border-[var(--color-borderdark)]
                        bg-[var(--boxbg2)] dark:bg-[var(--boxbg1)]
                        relative rounded-xl px-4 py-2
                        transform transition-all duration-300 ease-in-out
                        hover:scale-106 hover:shadow-md
                        z-0 hover:z-8
                        "
                  >
                    <div className="flex mb-2">
                      {metaData?.imageUrl && (
                        <div
                          className=" mr-2 rounded-md bg-gray-100 dark:bg-gray-700
             w-[44px] h-[44px] flex items-center justify-center shrink-0 "
                        >
                          <Image
                            src={
                              metaData?.imageUrl || "/img/opinionLogo-light.png"
                            }
                            width={40}
                            height={40}
                            alt="trending"
                            className="w-full h-full object-contain opacity-80 rounded"
                          />
                        </div>
                      )}

                      {/* TEXT */}
                      <h2 className="font-semibold text-sm cursor-pointer dark:text-[var(--color-text)] text-[var(--color-text)] flex-1">
                        <div onClick={() => goToDetails(row.id)}>
                          <div className="block text-primary">
                            <div
                              className="line-clamp-1"
                              title={row?.question || "--"}
                            >
                              {row?.question || "--"}
                            </div>
                          </div>
                          <span className=" text-gray-400 text-[11px]  ">
                            Resolves, {moment(row?.endDate).format("MMM YYYY")}
                          </span>
                        </div>
                      </h2>
                    </div>

                    {/* {row?.options?.length == 2 ? (
                      <>
                        {row?.options?.map((item: OptionItem, idx: number) => {
                          const percentage = item?.price * 100;

                          const firstPrice = row?.options?.[0]?.price ?? 0;
                          const secondPrice = row?.options?.[1]?.price ?? 0;

                          const diffPercentage =
                            firstPrice > 0
                              ? ((secondPrice - firstPrice) / firstPrice) * 100
                              : 0;

                          const isUp = diffPercentage >= 0;

                          return (
                            <div
                              key={idx}
                              className="w-100% rounded-xl  dark:bg-[#272f42] bg-[#f5f5f5] py-1.5 my-2 px-4 dark:text-[var(--color-text)] text-[var(--color-text)] shadow-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold tracking-wide">
                                  {item?.name || "--"}
                                </span>
                                <span className="text-sm font-semibold dark:text-[var(--color-text)] text-[var(--color-text)]">
                                  {(item?.price * 100).toFixed(1)}%
                                </span>
                              </div>

                              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2">
                                {percentage < 50 ? (
                                  <div
                                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                                    style={{ width: `${percentage}%` }}
                                  />
                                ) : (
                                  <div
                                    className="h-full bg-gradient-to-r from-red-400 to-yellow-400"
                                    style={{ width: `${percentage}%` }}
                                  />
                                )}
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <div className="flex gap-3">
                                  <span>
                                    Price{" "}
                                    <span className="dark:text-[var(--color-text)] text-[var(--color-text)] font-medium">
                                      {truncateValue(item?.price || 0)}
                                    </span>
                                  </span>
                                </div>

                                <div
                                  className={`flex items-center gap-1 font-medium ${
                                    percentage > 50
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  <FaArrowUp
                                    className={`transition-transform ${
                                      percentage > 50 ? "" : "rotate-180"
                                    }`}
                                  />
                                  <span>
                                    {Math.abs(diffPercentage).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div className="flex mt-3  align-baseline justify-between text-xs font-normal text-muted">
                          <div className="flex gap-4 items-center">
                            <span className="flex items-center gap-1">
                              {row?.stats?.totalVolume > 0 ? (
                                <>
                                  <span className="text-yellow-500 font-semibold">
                                    $
                                  </span>
                                  <span className="text-gray-400">
                                    {Number(
                                      row?.stats?.totalVolume || 0,
                                    ).toFixed(2)}{" "}
                                    Vol
                                  </span>
                                </>
                              ) : (
                                <span className="text-yellow-500 flex items-center gap-1">
                                  <GiNinjaStar
                                    size={12}
                                    className="rotate-45"
                                  />
                                  New
                                </span>
                              )}
                            </span>

                            <span
                              className="cursor-pointer inline-flex
             transition-transform duration-200 ease-in-out
             hover:scale-125"
                            >
                              {!row?.isBookmark ? (
                                <FaRegBookmark
                                  onClick={() =>
                                    !getToken
                                      ? setIsOpen(true)
                                      : bookMarkUnBookMark(
                                          row?.id,
                                          row?.isBookmark,
                                        )
                                  }
                                  className="text-sky-400"
                                />
                              ) : (
                                <FaBookmark
                                  onClick={() =>
                                    !getToken
                                      ? setIsOpen(true)
                                      : bookMarkUnBookMark(
                                          row?.id,
                                          row?.isBookmark,
                                        )
                                  }
                                  className="text-sky-400"
                                />
                              )}
                            </span>
                          </div>
                          <div>
                            <button
                              onClick={() => goToDetails(row.id)}
                              className="bg-[#8160ee] cursor-pointer rounded-md py-1.5 px-5 text-[14px] text-white font-semibold text-center"
                            >
                              Trade
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs mt-2 h-[170px] hideScrollbar overflow-y-auto space-y-2">
                          {row?.options?.map(
                            (item: OptionItem, idx: number) => {
                              const value = item?.price * 100;
                              const percent = value.toFixed(1);

                              const rgb =
                                optionColors[idx % optionColors.length];

                              return (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-[var(--color-text)] bg-[#f5f5f5] dark:bg-[#272f42]"
                                  style={{
                                    background: `linear-gradient(
            to left,
            rgba(${rgb}, 0.3) ${value}%,
            transparent ${value}%
          )`,
                                  }}
                                >
                                  <span className="block md:max-w-44 max-w-24 truncate font-semibold">
                                    {item?.name || "--"}
                                  </span>

                                  <span className="text-[16px] font-semibold">
                                    {percent}%
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>

                        <div className="flex mt-3  align-baseline justify-between text-xs font-normal text-muted">
                          <div className="flex gap-4 items-center">
                            {" "}
                            <span className="flex items-center gap-1">
                              {row?.stats?.totalVolume > 0 ? (
                                <>
                                  <span className="text-yellow-500 font-semibold">
                                    $
                                  </span>
                                  <span className="text-gray-400">
                                    {Number(
                                      row?.stats?.totalVolume || 0,
                                    ).toFixed(2)}{" "}
                                    Vol
                                  </span>
                                </>
                              ) : (
                                <span className="text-yellow-500 flex items-center gap-1">
                                  <GiNinjaStar
                                    size={12}
                                    className="rotate-45"
                                  />
                                  New
                                </span>
                              )}
                            </span>
                            <span
                              className="cursor-pointer inline-flex
             transition-transform duration-200 ease-in-out
             hover:scale-125 mr-2"
                            >
                              {!row?.isBookmark ? (
                                <FaRegBookmark
                                  onClick={() =>
                                    !getToken
                                      ? setIsOpen(true)
                                      : bookMarkUnBookMark(
                                          row?.id,
                                          row?.isBookmark,
                                        )
                                  }
                                  className="text-sky-400"
                                />
                              ) : (
                                <FaBookmark
                                  onClick={() =>
                                    !getToken
                                      ? setIsOpen(true)
                                      : bookMarkUnBookMark(
                                          row?.id,
                                          row?.isBookmark,
                                        )
                                  }
                                  className="text-sky-400"
                                />
                              )}
                            </span>
                          </div>
                          <div>
                            <button
                              onClick={() => goToDetails(row.id)}
                              className="bg-[#8160ee] cursor-pointer rounded-md py-1.5 px-5 text-[14px] text-white font-semibold text-center"
                            >
                              Trade
                            </button>
                          </div>
                        </div>
                      </>
                    )} */}

                    {row?.options?.length > 0 && (
                      <div className="text-xs mt-2 h-[170px] hideScrollbar overflow-y-auto space-y-2">
                        {row?.options?.map((item: OptionItem, idx: number) => {
                          const percentage = item?.price * 100;
                          const isTopOption = item?.price === maxPrice;
                          const gapPercent = maxPrice
                            ? ((maxPrice - item.price) / maxPrice) * 100
                            : 0;
                          const diffPercent = maxPrice
                            ? ((item.price - maxPrice) / maxPrice) * 100
                            : 0;

                          return (
                            <div
                              key={idx}
                              className="w-full rounded-xl dark:bg-[#272f42] bg-[#f5f5f5] py-1.5 my-2 px-4"
                            >
                              <div className="flex items-center justify-between mb-2 gap-2">
                                <span className="flex-1 min-w-0  truncate text-sm font-semibold tracking-wide">
                                  {item?.name || "--"}
                                </span>
                                <span className="shrink-0 text-sm font-semibold">
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>

                              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2">
                                <div
                                  className={`h-full ${
                                    isTopOption
                                      ? "bg-gradient-to-r from-teal-400 to-cyan-400"
                                      : "bg-gradient-to-r from-yellow-400 to-red-400"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>
                                  Price{" "}
                                  <span className="font-medium">
                                    {truncateValue(item?.price || 0)}
                                  </span>
                                </span>

                                <div
                                  className={`flex items-center gap-1 font-medium ${
                                    isAllEqual
                                      ? "text-gray-400"
                                      : isTopOption
                                        ? "text-green-400"
                                        : "text-yellow-400"
                                  }`}
                                >
                                  {isAllEqual ? (
                                    <span className="text-lg text-slate-300 leading-none">
                                      ~
                                    </span>
                                  ) : (
                                    <FaArrowUp
                                      className={`transition-transform ${
                                        isTopOption ? "" : "rotate-180"
                                      }`}
                                    />
                                  )}

                                  <span>
                                    {Math.abs(diffPercent).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex mt-3  align-baseline justify-between text-xs font-normal text-muted">
                      <div className="flex flex-row gap-2 items-center">
                        <span>{row?.options?.length || "0"} market</span>
                        <div className="flex gap-4 items-center">
                          <span className="flex items-center gap-1">
                            {row?.stats?.totalVolume > 0 ? (
                              <>
                                <span className="text-yellow-500 font-semibold">
                                  $
                                </span>
                                <span className="text-gray-400">
                                  {Number(row?.stats?.totalVolume || 0).toFixed(
                                    2,
                                  )}{" "}
                                  Vol
                                </span>
                              </>
                            ) : (
                              <span className="text-yellow-500 flex items-center gap-1">
                                <GiNinjaStar size={12} className="rotate-45" />
                                New
                              </span>
                            )}
                          </span>

                          <span
                            className="cursor-pointer inline-flex
             transition-transform duration-200 ease-in-out
             hover:scale-125"
                          >
                            {!row?.isBookmark ? (
                              <FaRegBookmark
                                onClick={() =>
                                  !getToken
                                    ? setIsOpen(true)
                                    : bookMarkUnBookMark(
                                        row?.id,
                                        row?.isBookmark,
                                      )
                                }
                                className="text-sky-400"
                              />
                            ) : (
                              <FaBookmark
                                onClick={() =>
                                  !getToken
                                    ? setIsOpen(true)
                                    : bookMarkUnBookMark(
                                        row?.id,
                                        row?.isBookmark,
                                      )
                                }
                                className="text-sky-400"
                              />
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => goToDetails(row.id)}
                          className="bg-[#8160ee] cursor-pointer rounded-md py-1.5 px-5 text-[14px] text-white font-semibold text-center"
                        >
                          Trade
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                  No questions found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  There are no active premium questions available right now.
                  Please check back later or explore other markets.
                </p>
              </div>
            )
          }
        </div>
      </div>
      <Authentication
        isLogin
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />

      <BuySell
        rowDetailss={rowDetails as null}
        isOpen={isModalOpen}
        onClose={() => {
          setOptionIndex(null);
          setIsModalOpen(false);
        }}
        orderType={buyType as string}
        handleChangeOrderType={setBuyType}
        option={options}
        optionIndex={optionIndex as number}
        fetchOrders={() => null}
      />
    </>
  );
};
export default Home;

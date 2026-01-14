"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { questionDetails } from "@/components/service/apiService/category";
import { useSearchParams } from "next/navigation";
import ChartRealtime from "./realTimeChart";
import socket from "@/components/socket";
import BuySell from "@/components/Modal/BuySell/page";
import {
  cancelOrder,
  getGraphData,
  getLeaderBoardMarket,
  getOrdersList,
} from "@/components/service/apiService/buySell";
import { useSelector } from "react-redux";
import MarketSkeleton from "@/components/common/CartDetailLoader";
import Authentication from "@/components/Pages/auth";
import MarketLeaderboard from "./MarketLeaderboard";
import OrderList from "./OrderList";
import ConfirmationModal from "@/components/Modal/ConfirmationModal/page";
import toast from "react-hot-toast";
import { GraphData } from "@/utils/typesInterface";
import { delay } from "@/utils/Content";

type OrderSide = "BUY" | "SELL";

interface OrderFlowItem {
  id: number;
  optionId: number;
  shares: string;
  saleAtPrice: string;
  createdAt: string;
}
type SellOrder = {
  saleAtPrice?: number | string;
};
interface OrderFlow {
  buys: OrderFlowItem[];
  sells: OrderFlowItem[];
}

interface UserPosition {
  shares: number;
  invested: number;
  pnl: number;
}
interface OrderItem {
  id: number;
  optionId: number;
  shares: number;
  price: number;
  side: OrderSide;
  status: string;
  createdAt: string;
}

interface OptionItem {
  id: number;
  name: string;
  price: number;
  winningProbability: number;
  userPosition?: UserPosition;
}

interface MarketData {
  question?: {
    question: string;
  };
  market?: {
    totalMarketVolume: number;
  };
  options?: OptionItem[];
  lastOrderUpdatedAt: string;
}

interface SocketPricePayload {
  questionId: string;
  prices: number[];
  ts?: number;
}

interface SocketTradePayload {
  orderId: number;
  optionId: number;
  filledShares: number;
  cash: number;
  side: OrderSide;
  ts: number;
}

interface SocketOrderUpdatePayload {
  questionId: string;
  optionId: number;
  orderId: number;
  filled: number;
  side: OrderSide;
  prices: number[];
}

interface RootState {
  user?: {
    user?: { id?: number };
  };
}

interface OptionItem {
  id: number;
  name: string;
  price: number;
  winningProbability: number;
  userPosition?: UserPosition;
}
export interface LeaderboardItem {
  userId: number;
  username: string;
  profit: number;
  invested: number;
  pnl: number;
  rank: number;
  roi: number;
}

const Details = () => {
  const [orderFlow, setOrderFlow] = useState<OrderFlow>({
    buys: [],
    sells: [],
  });
  const [isLoader, setIsLoader] = useState(false);
  const [data, setData] = useState<MarketData | null>(null);
  const [leaderBoard, setLeaderBoard] = useState<LeaderboardItem[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({
    series: [],
  });
  // const { slug }: { slug: string } = useParams();
  const searchParams = useSearchParams();
  const slug = searchParams.get("id");
  const [isOpenBuySell, setIsOpenBuySell] = useState(false);
  const [buyType, setBuyType] = useState<OrderSide | unknown>();
  const [options, setOptions] = useState<OptionItem | null>(null);
  const userDetails = useSelector((state: RootState) => state?.user);
  const useToken = localStorage.getItem("token");
  const processedOrderIdsRef = useRef<Set<number>>(new Set());
  const OrderHistoryIdsRef = useRef<Set<number>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);
  const [orderData, setOrderData] = useState<OrderItem[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [deleteResponse, setDeleteResponse] = useState(false);

  const questionDetailsList = useCallback(async () => {
    setIsLoader(true);
    try {
      // const [response] = await Promise.all([
      //   questionDetails(slug as string, userDetails?.user?.id as number),
      // ]);
      const [response] = await Promise.all([
        questionDetails(slug as string, userDetails?.user?.id as number),
        delay(2000),
      ]);
      if (response?.success) {
        setOrderFlow({
          buys: response.data.orderFlow?.buys ?? [],
          sells: response.data.orderFlow?.sells ?? [],
        });
        setData(response.data);
      } else {
        setOrderFlow({ buys: [], sells: [] });
        setData(null);
      }
    } finally {
      setIsLoader(false);
    }
  }, [slug, userDetails?.user?.id]);

  const getGraphDetails = useCallback(async () => {
    const response = await getGraphData(slug);
    if (response?.success) {
      setGraphData(response.data);
    } else {
      setGraphData({ series: [] });
    }
  }, [slug]);

  // getGraphData
  useEffect(() => {
    questionDetailsList();
    getGraphDetails();
  }, [questionDetailsList, getGraphDetails, slug]);

  const questionId = slug;

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    console.log(socket.connected, "socket.connected");

    socket.on("connect", () => {
      console.log("✅ Socket connected! ID:", socket.id);
      socket.emit("subscribe:market", questionId);
      if (userDetails?.user?.id) {
        socket.emit("subscribe:user", userDetails?.user?.id);
      }
    });

    // socket.onAny((, ...args) => {});
    socket.on("market:prices", (payload: SocketPricePayload) => {
      console.log("MarketPrices received:", payload);
      if (!payload?.questionId || !Array.isArray(payload.prices)) {
        return;
      }

      setData((prev): MarketData | null => {
        if (!prev?.options || !Array.isArray(prev.options)) {
          return prev;
        }
        const updatedOptions = prev.options.map(
          (option: OptionItem, index: number) => {
            const newPrice = payload.prices[index];
            return {
              ...option,
              price:
                typeof newPrice === "number" && !isNaN(newPrice)
                  ? newPrice
                  : option.price,
              winningProbability:
                typeof newPrice === "number" && !isNaN(newPrice)
                  ? newPrice
                  : option.winningProbability,
            };
          }
        );

        return {
          ...prev,
          options: updatedOptions,
          lastOrderUpdatedAt: new Date(payload.ts || Date.now()).toISOString(),
        };
      });
    });

    socket.on("trade", (payload: SocketTradePayload) => {
      if (OrderHistoryIdsRef.current.has(payload.orderId)) {
        return;
      }
      OrderHistoryIdsRef.current.add(payload.orderId);

      const tradeRow: OrderFlowItem = {
        id: payload.orderId,
        optionId: payload.optionId,
        shares: payload.filledShares.toFixed(16),
        saleAtPrice: (payload.cash / payload.filledShares).toFixed(16),
        createdAt: new Date(payload.ts).toISOString(),
      };
      if (OrderHistoryIdsRef.current.has(payload.orderId)) {
        return;
      }
      OrderHistoryIdsRef.current.add(payload.orderId);
      setOrderFlow((prev: OrderFlow) => {
        if (!prev) return prev;

        if (payload.side === "BUY") {
          return {
            buys: [tradeRow, ...(prev.buys || [])],
            sells: prev.sells || [],
          };
        }

        if (payload.side === "SELL") {
          return {
            buys: prev.buys || [],
            sells: [tradeRow, ...(prev.sells || [])],
          };
        }

        return prev;
      });
    });

    socket.on("order:update", (payload: SocketOrderUpdatePayload) => {
      if (
        !payload?.questionId ||
        !payload?.optionId ||
        typeof payload?.orderId !== "number" ||
        typeof payload?.filled !== "number"
      ) {
        return;
      }
      if (processedOrderIdsRef.current.has(payload.orderId)) {
        return;
      }
      processedOrderIdsRef.current.add(payload.orderId);
      setData((prev): MarketData | null => {
        if (!prev || !Array.isArray(prev.options)) {
          return prev;
        }

        const updatedOptions: OptionItem[] = prev.options.map(
          (option: OptionItem, index: number) => {
            const newPrice = payload.prices?.[index];

            if (option.id === payload.optionId) {
              const prevPosition = option.userPosition ?? {
                shares: 0,
                invested: 0,
                pnl: 0,
              };

              const updatedShares =
                payload.side === "BUY"
                  ? prevPosition.shares + payload.filled
                  : prevPosition.shares - payload.filled;

              return {
                ...option,
                price:
                  typeof newPrice === "number" && !Number.isNaN(newPrice)
                    ? newPrice
                    : option.price,
                winningProbability:
                  typeof newPrice === "number" && !Number.isNaN(newPrice)
                    ? newPrice
                    : option.winningProbability,
                userPosition: {
                  shares: updatedShares,
                  invested: prevPosition.invested,
                  pnl: prevPosition.pnl,
                },
              };
            }

            return {
              ...option,
              price:
                typeof newPrice === "number" && !Number.isNaN(newPrice)
                  ? newPrice
                  : option.price,
              winningProbability:
                typeof newPrice === "number" && !Number.isNaN(newPrice)
                  ? newPrice
                  : option.winningProbability,
            };
          }
        );

        return {
          ...prev,
          options: updatedOptions,
          lastOrderUpdatedAt: new Date().toISOString(),
        };
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    return () => {
      console.log("subscribing from market:", questionId);
      // socket.emit("unsubscribe:market", questionId);
      // socket.off("connect");
      // socket.off("market:prices");
      // socket.off("trade");
      // socket.off("order:update");
      socket.offAny();
    };
  }, [questionId, userDetails?.user?.id]);

  const getToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleBuyNow = (row: OptionItem, type: string, idx: number) => {
    if (!getToken) {
      setIsOpen(true);
      return;
    }
    setOptionIndex(idx);
    setOptions(row);
    setBuyType(type);
    setIsOpenBuySell(true);
  };

  console.log(typeof slug, "slug");

  const getLeaderBoardMarketList = useCallback(async () => {
    try {
      const response = await getLeaderBoardMarket(slug);

      if (response?.success) {
        setLeaderBoard(response.data.leaderboard as LeaderboardItem[]);
      } else {
        setLeaderBoard([]);
      }
    } catch (error) {
      console.error(error);
      setLeaderBoard([]);
    }
  }, [slug]);

  useEffect(() => {
    getLeaderBoardMarketList();
  }, [getLeaderBoardMarketList]);

  const ordersList = useCallback(async () => {
    try {
      const response = await getOrdersList(2, slug);

      if (response?.success) {
        setOrderData(response.data?.orders ?? []);
      } else {
        setOrderData([]);
      }
    } catch (error) {
      console.error(error);
      setOrderData([]);
    }
  }, [slug]);

  useEffect(() => {
    ordersList();
  }, [ordersList]);

  //
  const sellPrices =
    orderFlow?.sells?.map((i: SellOrder) => Number(i?.saleAtPrice) || 0) || [];

  const minSellPrice = Math.min(...sellPrices);
  const maxSellPrice = Math.max(...sellPrices);

  const getBarWidth = (price: number) => {
    const minWidth = 10;
    const maxWidth = 80;

    // Edge case: sab prices same ho
    if (maxSellPrice === minSellPrice) return "45%";

    const width =
      minWidth +
      ((price - minSellPrice) / (maxSellPrice - minSellPrice)) *
        (maxWidth - minWidth);

    return `${Math.round(width)}%`;
  };

  const buyPrices =
    orderFlow?.buys?.map((i: SellOrder) => Number(i?.saleAtPrice) || 0) || [];

  const minBuyPrice = Math.min(...buyPrices);
  const maxBuyPrice = Math.max(...buyPrices);

  const getBuyBarWidth = (price: number) => {
    const minWidth = 10;
    const maxWidth = 80;

    // Edge case: sab prices same ho
    if (maxBuyPrice === minBuyPrice) return "45%";

    const width =
      minWidth +
      ((price - minBuyPrice) / (maxBuyPrice - minBuyPrice)) *
        (maxWidth - minWidth);

    return `${Math.round(width)}%`;
  };

  const prices = Array.isArray(data?.options)
    ? data.options.map((o: OptionItem) => Number(o?.price ?? 0))
    : [];

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 1;

  const getIntensity = (price: number) => {
    if (!prices.length || maxPrice === minPrice) return 0.5;
    return (price - minPrice) / (maxPrice - minPrice);
  };

  const getBgClass = (price: number) => {
    const intensity = getIntensity(price);

    if (intensity > 0.8)
      return "border border-gray-200 ";

    if (intensity > 0.6) return "bg-emerald-400/15";

    if (intensity > 0.4) return "bg-sky-500/10";

    if (intensity > 0.2) return "bg-slate-500/10";

    return "bg-slate-700/10";
  };

  const handleDelete = (row: number) => {
    setSelected(row);
    setDeleteOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setSelected(null);
  };

  const confirmDelete = async () => {
    if (selected) {
      setDeleteResponse(true);
      try {
        const response = await cancelOrder(selected);
        if (response?.success) {
          toast.success(response.message);
          setDeleteOpen(false);
          setSelected(null);
          ordersList();
        } else {
          toast.error(response.message);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");
        }
      } finally {
        setDeleteResponse(false);
      }
    }
  };

  localStorage.setItem("isCategory", "0");
  return (
    <>
      {isLoader ? (
        <MarketSkeleton />
      ) : (
        <div className="dark:bg-[#0f172a]">
          <div className="max-w-[1268px] mx-auto px-4 mt-24 lg:mt-40 ">
            <div className="container mx-auto pb-6 ">
              <div className="md:flex lg:items-center mb-6">
                <Image
                  src="/img/blockimg1.jpg"
                  alt="NYC Flag"
                  width={80}
                  height={80}
                  className="mr-4 rounded-lg"
                />
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white">
                    {data?.question?.question}
                  </h1>
                  <p className="text-sm text-[#7F90A7] dark:text-gray-300">
                    ${" "}
                    {Number(data?.market?.totalMarketVolume || 0).toFixed(2) ||
                      0}{" "}
                    Vol.
                  </p>
                  <div className="lg:flex space-x-4 mt-1 text-sm">
                    {data?.options?.map((item: OptionItem, index: number) => (
                      <div key={index} className=" text-wrap items-center">
                        <span
                          className={`rounded-full ${
                            index === 0
                              ? "bg-red-700 "
                              : index === 1
                              ? "bg-blue-500 "
                              : index === 2
                              ? "bg-green-500 "
                              : index === 3
                              ? "bg-purple-600 "
                              : index === 4
                              ? "bg-yellow-700 "
                              : "bg-pink-500"
                          } inline-block mr-2`}
                          style={{ width: "10px", height: "10px" }}
                        ></span>
                        <span className="text-[#7F90A7] font-semibold dark:text-gray-300">
                          {item?.name || "--"}, {(item?.price * 100).toFixed(1)}{" "}
                          %
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid  grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {Number(graphData?.series?.length) > 0 ? (
                    <div className="h-64 mb-6 flex">
                      <span className="text-gray-500">
                        <ChartRealtime data={graphData?.series} />
                      </span>
                    </div>
                  ) : (
                    <div className="bg-cyan-100/80 rounded-lg h-64 mb-6 flex items-center justify-center">
                      <span className="text-gray-500">[Chart Placeholder]</span>
                    </div>
                  )}

                  {Number(data?.options?.length) > 0 && (
                    <div className="md:flex items-center justify-between text-center px-2 md:px-0 pt-3 md:py-0  font-bold dark:text-[#c3a66e] text-[#080b11] md:border-0 lg:bg-transparent">
                      <div className="w-64 text-start">Options</div>
                      {useToken && (
                        <>
                          <div className="!w-20">Invested</div>
                          <div className="!w-16">PnL</div>
                          <div className="!w-24">Buy Shares</div>{" "}
                        </>
                      )}
                      <div className="!w-40"></div>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {data?.options?.map((item: OptionItem, index: number) => {
                      const pnl = Number(item?.userPosition?.pnl || 0);
                      const bgClass = getBgClass(Number(item?.price));

                      return (
                        <div
                          key={index}
                          className={`
                            flex flex-col md:flex-row items-center justify-between
                            px-3 py-3 rounded-xl
                            border dark:border-[#c3a66e]/60
                            border-gray-400
                            backdrop-blur-md 
                            transition-all duration-300
                            ${bgClass}
                          `}
                        >
                          {/* OPTION NAME */}
                          <div
                            className={`${
                              useToken ? "w-64" : "w-full"
                            } font-medium dark:text-white`}
                          >
                            {item?.name || "--"}
                          </div>

                          {useToken && (
                            <>
                              <div className="w-20 text-sm text-slate-300 text-center">
                                {(item.userPosition?.invested ?? 0) > 0
                                  ? Number(item.userPosition?.invested).toFixed(
                                      1
                                    )
                                  : "--"}
                              </div>

                              <div
                                className={`w-16 text-sm font-semibold text-center ${
                                  pnl < 0 ? "text-red-400" : "text-emerald-400"
                                }`}
                              >
                                {pnl !== 0 ? `$${pnl.toFixed(1)}` : "--"}
                              </div>

                              <div className="w-24 text-sm text-slate-300 text-center">
                                {(item.userPosition?.shares ?? 0) > 0
                                  ? Number(item.userPosition?.shares).toFixed(1)
                                  : "--"}
                              </div>
                            </>
                          )}

                          {/* ACTIONS */}
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <div className="text-xs text-slate-400 w-12 text-center">
                              {(Number(item?.price) * 100).toFixed(1)}%
                            </div>

                            <button
                              onClick={() => handleBuyNow(item, "sell", index)}
                              className="px-4 py-1.5 rounded-md text-xs font-semibold
                              bg-red-500/20 text-red-400 border border-red-500/30
                              hover:bg-red-500/30 transition"
                            >
                              Sell
                            </button>

                            <button
                              onClick={() => handleBuyNow(item, "buy", index)}
                              className="px-4 py-1.5 rounded-md text-xs font-semibold
                              bg-emerald-500/20 text-emerald-400 border border-emerald-500/30
                              hover:bg-emerald-500/30 transition"
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-1 h-[440px] border border-gray-200 dark:border-gray-700 rounded-lg p-3 lg-p-6">
                  <div className="flex justify-between pr-14 items-center ">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                      Shares
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-200">
                      Price
                    </span>
                  </div>

                  <div className="dark:bg-[#151922]/50  bg-gray-100/50 mt-2 w-full rounded-md overflow-hidden border dark:border-[#1c1f26] border-[#d6d6d6]">
                    <div className="divide-y max-h-[160px] hideScrollbar overflow-y-auto dark:divide-[#1c1f26] divide-[#d6d6d6]">
                      {orderFlow?.sells?.length > 0 ? (
                        orderFlow.sells.map((item: OrderFlowItem) => {
                          const price = Number(item?.saleAtPrice) || 0;

                          return (
                            <div
                              key={item?.id}
                              className="relative flex justify-between px-2 py-1 text-sm text-red-400 font-medium overflow-hidden"
                            >
                              {/* Background bar */}
                              <div
                                className="absolute right-0 top-0 h-full bg-red-500 opacity-10 z-0 transition-all duration-300"
                                style={{ width: getBarWidth(price) }}
                              ></div>

                              <span className="z-10">
                                {Number(item?.shares)?.toFixed(2) || "0.00"}
                              </span>
                              <span className="z-10">${price.toFixed(2)}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-400 text-sm ">
                          No sell orders yet
                        </div>
                      )}
                    </div>

                    <div className="text-center dark:text-white text-black font-bold py-2 text-base border-y dark:border-[#1c1f26] border-[#d6d6d6]">
                      ${" "}
                      {Number(data?.market?.totalMarketVolume || 0).toFixed(
                        2
                      ) || 0}{" "}
                      Vol.
                      <span className="text-green-500 text-xs align-top">
                        ▲
                      </span>
                    </div>

                    <div className="divide-y max-h-[160px] hideScrollbar overflow-y-auto dark:divide-[#2e3139] divide-[#d6d6d6]">
                      {orderFlow?.buys?.length > 0 ? (
                        orderFlow.buys.map((item: OrderFlowItem) => {
                          const price = Number(item?.saleAtPrice) || 0;
                          return (
                            <div
                              key={item?.id}
                              className="relative flex justify-between px-2 py-1 text-sm text-green-400 font-medium"
                            >
                              <div
                                className="absolute right-0 top-0 h-full bg-green-500 opacity-10 z-0 transition-all duration-300"
                                style={{ width: getBuyBarWidth(price) }}
                              ></div>
                              <span className="z-10">
                                {Number(item?.shares)?.toFixed(2) || "0.00"}
                              </span>
                              <span className="z-10">$ {price.toFixed(2)}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-400 text-sm ">
                          No buy orders yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <MarketLeaderboard data={leaderBoard} />

              {orderData?.length > 0 && (
                <OrderList data={orderData} cancelOrders={handleDelete} />
              )}
            </div>
          </div>
        </div>
      )}
      <Authentication
        isLogin
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
      <BuySell
        rowDetailss={data as null}
        isOpen={isOpenBuySell}
        onClose={() => setIsOpenBuySell(false)}
        orderType={buyType as string}
        handleChangeOrderType={setBuyType}
        option={options}
        optionIndex={optionIndex as number}
        fetchOrders={ordersList}
      />

      <ConfirmationModal
        open={deleteOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDelete={deleteResponse}
      />
    </>
  );
};

export default Details;

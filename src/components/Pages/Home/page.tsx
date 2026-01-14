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
import {
  OptionItem,
  QuestionItem,
  QuestionItemSecond,
  RootState,
} from "@/utils/typesInterface";
import { delay } from "@/utils/Content";

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionData, setQuestionData] = useState<QuestionItem[]>([]);
  const [buyType, setBuyType] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionItem | null>(null);
  const [rowDetails, setRowDetails] = useState<QuestionItemSecond | null>(null);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);
  const getToken = localStorage.getItem("token");
  const router = useRouter();
  const categoryDetails = useSelector(
    (state: RootState) => state?.category?.category
  );
  const userDetails = useSelector((state: RootState) => state?.user);
  localStorage.setItem("isCategory", "1");

  const questionAllList = useCallback(async () => {
    setLoader(true);
    try {
      const [response] = await Promise.all([
        commonQuestionFindById(
          categoryDetails?.id || 1,
          userDetails?.user?.id as string
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
  }, [categoryDetails?.id, userDetails?.user?.id]);

  useEffect(() => {
    questionAllList();
  }, [questionAllList]);

  const handleBuyNow = (
    row: QuestionItemSecond,
    item: OptionItem,
    type: string,
    idx: number
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

  const goToDetails = (userId: string) => {
    router.push(`/detail?id=${userId}`);
  };

  return (
    <>
      <div className="max-w-[1268px]  mx-auto px-4 pb-10 mt-20 lg:mt-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 lg:pt-0">
          {loader
            ? [1, 2, 3, 4, 5, 6, 7, 8]?.map((row) => <LoadingCard key={row} />)
            : questionData?.map((row: QuestionItem, index) => (
                <div
                  key={index}
                  className="z-10 border border-gray-200 dark:border-gray-700 dark:bg-[#162033] 
                  relative min-h-48 rounded-xl p-4 
                  transition-transform duration-300 ease-in-out 
                  transform hover:scale-105 hover:shadow-md "
                >
                  <div className="flex items-center mb-3">
                    <Image
                      src="/img/blockimg1.jpg"
                      width={40}
                      height={40}
                      alt="trending"
                      className="mr-2 rounded"
                    />
                    <h2 className="font-semibold text-sm cursor-pointer dark:text-white text-gray-800">
                      <div onClick={() => goToDetails(row.id)}>
                        <div className="block">
                          <div
                            className="line-clamp-2"
                            title={row?.question || "--"}
                          >
                            {row?.question || "--"}
                          </div>
                        </div>
                      </div>
                    </h2>
                  </div>

                  <div className="text-xs mt-4 mb-5 h-24 hideScrollbar overflow-y-auto space-y-2">
                    {row?.options?.map((item: OptionItem, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-2 justify-between items-center dark:text-white text-gray-700"
                      >
                        <span className="block max-w-full truncate">
                          {item?.name || "--"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span>{(item?.price * 100).toFixed(1)}%</span>
                          <button
                            onClick={() => handleBuyNow(row, item, "sell", idx)}
                            className="py-1 px-2 bg-[#c7ac77]/80 cursor-pointer text-white font-semibold rounded-xs text-[10px]"
                          >
                            Sell
                          </button>
                          <button
                            onClick={() => handleBuyNow(row, item, "buy", idx)}
                            className="py-1 px-2 border border-[#c7ac77]/80 cursor-pointer text-[#c7ac77] font-semibold rounded-xs text-[10px]"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex absolute mt-5 bottom-3 w-[88%] align-baseline justify-between text-xs text-gray-400">
                    <span>
                      $ {Number(row?.stats?.totalVolume || 0)?.toFixed(2) || 0}
                    </span>
                    <span></span>
                  </div>
                </div>
              ))}
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

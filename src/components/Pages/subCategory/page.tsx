import React, { useEffect, useState } from "react";
import SubList from "./components/SubList/page";
import { FaFootballBall } from "react-icons/fa";
import play from "../../../../public/img/play.png";
import FilterDropdown from "./components/CogDropdown/page";
import Image from "next/image";
import {
  OptionItem,
  QuestionItem,
  QuestionItemSecond,
} from "@/utils/typesInterface";
import { useRouter } from "next/navigation";
import BuySell from "./components/BuyShell/page";
import { truncateValue } from "@/utils/Content";
export default function SubCategory({
  eventSubCategoryId,
  setEventSubCategoryId,
  questionData,
}: {
  eventSubCategoryId: number | null;
  setEventSubCategoryId: (id: number | null) => void;
  questionData: QuestionItem[];
}) {
  const [buyType, setBuyType] = useState<string>("buy");
  const [options, setOptions] = useState<OptionItem | null>(null);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionItemSecond | null>(null);
  const router = useRouter();

  const goToDetails = (userId: string) => {
    router.push(`/Detail?id=${userId}`);
  };
  useEffect(() => {
    const dataQ = questionData.length > 0 ? questionData?.[0] : null;
    setSelectedQuestion(dataQ);
    setOptions(dataQ?.options?.[0] || null);
  }, [questionData]);
  const handleSelectedQuestion = (
    row: QuestionItemSecond | null,
    option: OptionItem,
    index: number,
  ) => {
    setSelectedQuestion(row);
    setOptions(option);
    setOptionIndex(index);
  };
  return (
    <>
      <div className="dark:bg-[#1D293D]  bg-white text-gray-800 dark:text-gray-200 min-h-screen">
        <div className="max-w-[1268px] mx-auto px-4 pb-16  ">
          <div className="md:flex justify-between">
            <div className="md:w-[12%]  md:sticky md:top-28 h-fit">
              <SubList
                eventSubCategoryId={eventSubCategoryId}
                setEventSubCategoryId={setEventSubCategoryId}
              />
            </div>
            <div className="md:w-[54%] md:ml-[2%]">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h1 className="text-xl md:text-xl font-bold dark:text-gray-300 text-gray-700">
                    Sports
                  </h1>
                </div>

                <div>
                  <FilterDropdown />
                </div>
              </div>

              {questionData?.length > 0 &&
                questionData?.map((row) => {
                  const isActiveButton = row?.id === selectedQuestion?.id;
                  return (
                    <div
                      key={row?.id}
                      className="border border-gray-200 dark:border-gray-700 dark:hover:border-[#c9ae79]/50 hover:border-gray-300 p-3 rounded-lg mb-3"
                    >
                      <p
                        className="text-gray-400 cursor-pointer hover:text-gray-200 text-sm mb-4"
                        onClick={() => goToDetails(row?.id)}
                      >
                        <FaFootballBall className="inline-block" />{" "}
                        {row?.question || ""}
                      </p>
                      <div className="text-xs mt-4 mb-5 h-[110px] hideScrollbar overflow-y-auto space-y-2">
                        {row?.options?.length > 0 &&
                          row?.options?.map((item, idx) => {
                            const isOptionActive = item?.id == options?.id;
                            return (
                              <div
                                key={item?.id}
                                className="flex justify-between  items-center mb-2"
                              >
                                <div className="text-[16px] dark:text-gray-300 text-gray-800 flex items-center gap-1 min-w-0">
                                  <Image
                                    src={play}
                                    alt="Play Icon"
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                  />
                                  <span className="block truncate w-[180px] md:w-full">
                                    {item?.name || "--"}
                                  </span>
                                </div>
                                <div>
                                  <button
                                    onClick={() =>
                                      handleSelectedQuestion(row, item, idx)
                                    }
                                    className={`py-1.5 bg-green-600/40 text-green-700 dark:text-green-400 font-semibold rounded-xs px-4 cursor-pointer
                                ${isActiveButton && isOptionActive ? "bg-[#c7ac77] " : "dark:text-[#c7ac77] bg-red-500/40 text-red-700 dark:text-red-400"}
                                 border-gray-600  text-gray-700 font-semibold rounded-md text-md`}
                                  >
                                    {truncateValue(item?.price * 100)}%
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <span className="text-gray-500 text-xs">
                        $ {truncateValue(row?.stats?.totalVolume || 0)}
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="md:w-[30%] md:sticky md:top-28 h-fit">
              <BuySell
                rowDetailss={selectedQuestion as null}
                handleChangeOrderType={setBuyType}
                option={options}
                optionIndex={optionIndex}
                orderType={buyType}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

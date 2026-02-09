"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
// import Drawer from "@/components/Drawer/page";
import Authentication from "@/components/Pages/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubCategory,
  getCommonCategoryAll,
} from "@/components/service/apiService/category";
import {
  changeFilter,
  changeFilterQuestion,
  changeIsEvent,
  changeWatch,
  resetFilters,
  saveCategory,
  saveEventCategory,
  saveSelectSubCategory,
  saveSubCategory,
} from "@/components/store/slice/category";
import { usePathname } from "next/navigation";
import {
  fetchNotification,
  fetchUnReadCountNotification,
  userBalance,
} from "@/components/service/apiService/user";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaBookmark, FaSearch } from "react-icons/fa";
import { CategorySkeleton } from "@/utils/customSkeleton";
import { delay } from "@/utils/Content";
import { headerRootState, isWatchListInterface } from "@/utils/typesInterface";
import { FiBookmark, FiSearch, FiSliders } from "react-icons/fi";
import { CustomToggle } from "@/components/common/CustomToggle";
import { SlArrowDown } from "react-icons/sl";
import ProfileDropdown from "@/components/profileDropdown/page";
import NotificationBell from "@/components/notification/page";
import MainSearch from "./MainSearch";
import socket from "@/components/socket";
import MobileSearch from "./MainMobileSearch";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Crown } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface UserBalanceResponse {
  success: boolean;

  data?: {
    balance: string | number;
  };
}

const frequencies = ["all", "daily", "weekly", "monthly"];
const statusList = ["Active", "Resolved"];
const sortOptions = [
  "volume_24h",
  "volume_total",
  "competitive",
  "ending_soon",
  "newest",
];

export const formatLabel = (value: string | number): string => {
  return value
    .toString()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const pathname = usePathname();
  const [isCategory, setIsCategory] = useState(false);
  const [eventCategory, setEventCategory] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [frequency, setFrequency] = useState("all");
  const [status, setStatus] = useState("Active");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideFilter, setHideFilter] = useState({
    sports: false,
    crypto: false,
    earnings: false,
  });
  const [notificationData, setNotificationData] = useState([]);
  const [countNotification, setCountNotification] = useState(0);
  const getToken = localStorage.getItem("token");
  const user = useSelector((state: headerRootState) => state?.user);
  const isWatchList = useSelector(
    (state: isWatchListInterface) => state?.category?.isWatchList,
  );
  const isFilterQuestion = useSelector(
    (state: isWatchListInterface) => state?.category?.isFilterQuestion,
  );

  const dispatch = useDispatch();
  const handleSignup = () => {
    setIsLogin(false);
    setIsOpen(true);
  };
  const handleLogin = () => {
    setIsLogin(true);
    setIsOpen(true);
  };

  const categoryAllList = useCallback(async () => {
    setIsCategory(true);
    try {
      const [response] = await Promise.all([
        getCommonCategoryAll(),
        delay(1000),
      ]);
      if (response.success && response.data?.categories?.length) {
        const firstCategory = response.data.categories[0];
        dispatch(saveCategory(firstCategory));
        setCategoryId(firstCategory.id);
        setCategory(response.data.categories);
      } else {
        setCategory([]);
      }
    } catch {
      setCategory([]);
    } finally {
      setIsCategory(false);
    }
  }, [dispatch]);

  useEffect(() => {
    categoryAllList();
  }, [categoryAllList]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const getSubCategory = useCallback(async () => {
    try {
      const response = await fetchSubCategory(categoryId);

      if (response.success && !response?.data?.isMultiple) {
        const subCategoryList = response?.data?.category?.event_section || [];

        setEventCategory(subCategoryList);
        dispatch(saveSelectSubCategory(null));
        dispatch(saveEventCategory(subCategoryList));
        dispatch(changeIsEvent(false));
        dispatch(saveSubCategory([]));
      } else if (response.success && response?.data?.isMultiple) {
        const subCategoryResponse =
          response?.data?.category?.sub_category || [];

        setEventCategory([]);
        dispatch(changeIsEvent(true));
        dispatch(saveSelectSubCategory(null));
        dispatch(saveSubCategory(subCategoryResponse));
        dispatch(saveEventCategory([]));
      } else {
        dispatch(saveSelectSubCategory(null));
        dispatch(saveSubCategory([]));
        dispatch(saveEventCategory([]));
        dispatch(changeIsEvent(false));
        setEventCategory([]);
      }
    } catch {
      dispatch(changeIsEvent(false));
      dispatch(saveSelectSubCategory(null));
      setEventCategory([]);
      dispatch(saveSubCategory([]));
      dispatch(saveEventCategory([]));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    categoryId && getSubCategory();
  }, [getSubCategory, categoryId]);

  // const getUserBalance = async () => {
  //   try {
  //     const response: UserBalanceResponse = await userBalance();

  //     if (response.success && response.data?.balance !== undefined) {
  //       localStorage.setItem("balance", String(response.data.balance));
  //     } else {
  //       localStorage.removeItem("balance");
  //     }
  //   } catch {
  //     localStorage.removeItem("balance");
  //   }
  // };
  // useEffect(() => {
  //   if (token) {
  //     getUserBalance();
  //   }
  // }, [token]);

  const handleFilter = () => {
    dispatch(changeFilterQuestion(!isFilterQuestion));
  };

  const handleCleanFilter = () => {
    dispatch(resetFilters());
    setHideFilter({
      sports: false,
      crypto: false,
      earnings: false,
    });
    setFrequency("all");
    setStatus("OPEN");
    setSortBy("newest");
  };
  const toggleFilter = (key: keyof typeof hideFilter) => {
    setHideFilter((prev) => {
      const newValue = !prev[key];

      dispatch(
        changeFilter({
          key: "hideFilter",
          subKey: key,
          value: newValue,
        }),
      );

      return {
        ...prev,
        [key]: newValue,
      };
    });
  };

  const scrollRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -200 : 200;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };
  // fetchNotification

  //
  return (
    <>
      {/* <div className="hidden lg:block"> */}
      <div>
        <header
          className="fixed top-0 left-0 w-full z-[99]
  bg-[var(--color-bglight)] dark:bg-[var(--color-bgdark)]
  md:pb-2 pb-0 "
        >
          {/* shadow-[0_2px_6px_rgba(0,0,0,0.08)]
  dark:shadow-[0_2px_6px_rgba(0,0,0,0.4)] */}
          <div className="max-w-[1268px] mx-auto px-4 md:py-1 py-0 h-auto ">
            <div
              className={`flex items-center justify-between py-2 px-4  ${
                pathname === "/"
                  ? ""
                  : "border-b dark:border-[#2B394D] border-gray-300"
              }`}
            >
              {/* LEFT: Logo */}
              <Link href="/" className="shrink-0">
                <p className="text-text md:text-[22px] text-[15px] font-bold">
                  <Crown className="w-6 h-6 relative -top-1 inline-block font-bold" />{" "}
                  <span className="font-normal">OPINION</span> KINGS
                </p>
                {/* <Image
                  src="/img/opinionLogo-light.png"
                  alt="Logo"
                  width={80}
                  height={80}
                /> */}
              </Link>

              {/* CENTER: Search */}
              <div className="w-full lg:inline-block hidden max-w-xl mx-6">
                <MainSearch />
              </div>
              <div className="lg:hidden inline-block text-center">
                <MobileSearch />
                {/* <span className="w-8 h-8 inline-block bg-gray-200 rounded-full">
                  <FaSearch className="text-blue-400 dark:text-gray-200 relative top-2 left-2" />
                </span> */}
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-5 shrink-0">
                {/* {user?.isAuth && (
                  <div className="text-center">
                    <div className="dark:text-gray-200 text-gray-950 text-sm">
                      Portfolio
                    </div>
                    <div className="font-semibold text-green-600">$0.00</div>
                  </div>
                )}

                {user?.isAuth && (
                  <div className="text-center">
                    <div className="dark:text-gray-200 text-gray-950 text-sm">
                      Cash
                    </div>
                    <div className="font-semibold text-green-600">$0.00</div>
                  </div>
                )} */}

                {user?.isAuth && (
                  <button
                    className="md:inline-block hidden
    group relative
    hover:bg-btnbg bg-[#8160ee]
    text-white text-sm font-medium
    px-4 py-2 rounded-md
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:-translate-y-[3px]
    active:translate-y-[3px]
    active:shadow-[0_2px_0_rgb(29,78,216)]
  "
                  >
                    Deposit
                  </button>
                )}

                {user?.isAuth && <NotificationBell userId={user?.user?.id} />}
                {user?.isAuth && <ProfileDropdown />}
                {!user?.isAuth && (
                  <>
                    <button
                      onClick={handleLogin}
                      className="px-4 py-1.5 cursor-pointer border border-[#8160ee] dark:text-white text-black/80 font-medium hover:bg-[#8160ee] hover:text-white rounded-md  transition-all duration-300 ease-in-out
    hover:-translate-y-[3px]
    active:translate-y-[3px]
    active:shadow-[0_2px_0_rgb(29,78,216)]"
                    >
                      Log In
                    </button>
                    <button
                      onClick={handleSignup}
                      className="md:inline-block hidden
    group relative
    hover:bg-btnbg bg-[#8160ee]
    text-white text-sm font-medium
    px-4 py-2 rounded-md
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:-translate-y-[3px]
    active:translate-y-[3px]
    active:shadow-[0_2px_0_rgb(29,78,216)]
  "
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>

            {pathname === "/" && (
              <>
                <nav
                  className={`relative border-b ${isCategory ? "" : "pb-0"}  w-full
                border-[var(--color-borderlight)]
                dark:border-[var(--color-borderdark)]`}
                >
                  <button
                    onClick={() => scroll("left")}
                    className="absolute -left-2 top-[14px] -translate-y-1/2 z-10 text-gray-500 bg-white dark:bg-gray-800 shadow p-1 rounded-full flex md:hidden"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="absolute -right-2 top-[14px] -translate-y-1/2 z-10 text-gray-500 bg-white dark:bg-gray-800 shadow p-1 rounded-full flex md:hidden"
                  >
                    <FaChevronRight />
                  </button>

                  {/* SCROLLABLE TABS */}
                  <ul
                    ref={scrollRef}
                    className="flex gap-6 px-10 pb-2 text-[14px] overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth"
                  >
                    {isCategory ? (
                      <CategorySkeleton />
                    ) : (
                      category?.map((row: Category, index: number) => (
                        <li key={row.id} className="flex-shrink-0">
                          <div
                            onClick={() => {
                              dispatch(saveCategory(row));
                              dispatch(saveSelectSubCategory(null));
                              setCategoryId(row?.id);
                              dispatch(changeIsEvent(false));
                            }}
                            className={`px-3 py-1 rounded-full font-semibold flex items-center cursor-pointer
      transition-all duration-200 ease-in-out
      ${
        row?.id === categoryId
          ? "bg-[#8160ee]   text-white"
          : "bg-transparent dark:text-[#fff] text-text hover:bg-[#8160ee] hover:text-white"
      }`}
                          >
                            {index === 0 && (
                              <FaArrowTrendUp className="mr-1 text-sm" />
                            )}
                            {row?.name}
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </nav>
              </>
            )}

            {pathname === "/" && !isCategory && (
              <div className="">
                <nav className="pb-2 md:flex flex-row pt-1.5  border-gray-300 w-full">
                  {/* <div className="border-r border-gray-400 dark:border-gray-700 pr-6 flex items-center gap-2">
                    <div className="flex items-center w-56 gap-2 dark:bg-gray-700 bg-gray-100 rounded-xl px-4 py-2">
                      <FiSearch className="text-gray-400 text-base" />

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          dispatch(
                            changeFilter({
                              key: "search",
                              value: e.target.value,
                            }),
                          );
                        }}
                        placeholder="Search"
                        className="w-full bg-transparent outline-none text-sm  text-gray-700 dark:text-gray-200 placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={handleFilter}
                      className="w-10 h-10 flex items-center cursor-pointer hover:bg-gray-300 justify-center rounded-xl dark:bg-gray-700 bg-gray-100 hover:dark:bg-[#273244] transition"
                    >
                      <FiSliders className="text-gray-500 text-lg dark:text-gray-200" />
                    </button>
                    <button
                      onClick={() =>
                        !getToken
                          ? setIsOpen(true)
                          : dispatch(changeWatch(!isWatchList))
                      }
                      className={`w-10 h-10 flex items-center cursor-pointer justify-center rounded-xl
                        dark:bg-gray-700 bg-gray-100
                        hover:bg-gray-300 hover:dark:bg-[#273244]
                        transition-all duration-300
                        ${isWatchList ? "bg-sky-100 dark:bg-sky-100/10" : ""}
                      `}
                    >
                      {isWatchList ? (
                        <FaBookmark className="text-sky-500 text-lg dark:text-gray-200 dark:text-sky-500" />
                      ) : (
                        <FiBookmark className="text-gray-500 text-lg dark:text-gray-200" />
                      )}
                    </button>
                  </div> */}
                  {eventCategory?.length > 0 && (
                    <div
                      className={`
      relative
      overflow-hidden
      transition-all duration-1000 ease-in-out
      ${isWatchList ? "max-h-40 opacity-100" : "max-h-40"}
    `}
                    >
                      <button
                        onClick={() =>
                          scrollRef.current?.scrollBy({
                            left: -200,
                            behavior: "smooth",
                          })
                        }
                        className="absolute -left-2 top-[20px] -translate-y-1/2 z-10 text-gray-500 bg-white dark:bg-gray-800 shadow rounded-full p-1 md:hidden"
                      >
                        <FaChevronLeft />
                      </button>

                      <button
                        onClick={() =>
                          scrollRef.current?.scrollBy({
                            left: 200,
                            behavior: "smooth",
                          })
                        }
                        className="absolute -right-2 top-[20px] -translate-y-1/2 z-10 text-gray-500 bg-white dark:bg-gray-800 shadow rounded-full p-1 md:hidden"
                      >
                        <FaChevronRight />
                      </button>

                      {/* <ul
                        ref={scrollRef}
                        className={`
        flex gap-10 px-8 pt-6 text-[15px]
        overflow-x-auto whitespace-nowrap scrollbar-hide
        transform transition-all duration-700 ease-in-out
        ${isWatchList ? "translate-y-0" : "-translate-y-4"}
      `}
                      >
                        <li className="flex-shrink-0">
                          <div
                            onClick={() => {
                              dispatch(saveSelectSubCategory(null));
                              setSubCategoryId(null);
                            }}
                            className={`${
                              subCategoryId == null
                                ? "text-black dark:text-[#c7ac77]"
                                : "dark:text-gray-300 text-[#5e5e5f] hover:text-[#c7ac77]"
                            } font-semibold flex items-center cursor-pointer`}
                          >
                            <FaArrowTrendUp className="mr-1" />
                            All
                          </div>
                        </li>

                        {eventCategory?.map((row: Category) => (
                          <li key={row.id} className="flex-shrink-0">
                            <div
                              onClick={() => {
                                dispatch(saveSelectSubCategory(row));
                                setSubCategoryId(row?.id);
                              }}
                              className={`${
                                row?.id === subCategoryId
                                  ? "text-black dark:text-[#c7ac77]"
                                  : "dark:text-gray-300 text-[#5e5e5f] hover:text-[#c7ac77]"
                              } font-semibold flex items-center cursor-pointer`}
                            >
                              {row?.name}
                            </div>
                          </li>
                        ))}
                      </ul> */}
                    </div>
                  )}
                </nav>

                {true && (
                  <div className="w-full flex flex-wrap items-center gap-2 bg-transparent rounded-xl">
                    <div className="relative inline-block group">
                      <button
                        className="
      flex items-center gap-2 px-4 py-1.5 rounded-full
      dark:bg-gray-700 bg-gray-100
      text-xs dark:text-gray-300 text-gray-700
      transition-colors duration-200 ease-out
      group-hover:dark:bg-gray-600
      group-hover:bg-gray-200
    "
                      >
                        <span className="text-gray-400 text-xs">Sort by:</span>

                        <span className="dark:text-white text-black font-medium">
                          {formatLabel(sortBy)}
                        </span>

                        <SlArrowDown
                          size={10}
                          className={`
        transition-transform duration-200 ease-out
        group-hover:rotate-180
      `}
                        />
                      </button>

                      <div
                        className={`
      absolute left-0 mt-2 w-44 overflow-hidden rounded-lg
      bg-gray-100 dark:bg-[#1D293D]
      border border-gray-200 dark:border-gray-700
      shadow-lg z-50
      transform-gpu
      transition-all duration-200 ease-out "opacity-0 scale-95 -translate-y-1 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0  group-hover:visible
    `}
                      >
                        {sortOptions.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setSortBy(item);
                              dispatch(
                                changeFilter({
                                  key: "sortBy",
                                  value: item,
                                }),
                              );
                            }}
                            className={`
          w-full text-left px-4 py-2 text-xs
          transition-colors duration-150 ease-out text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:dark:bg-[#1f2937]
        `}
                          >
                            {formatLabel(item)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative inline-block group">
                      <button
                        className="
      flex items-center gap-2 px-4 py-1.5 rounded-full
      dark:bg-gray-700 bg-gray-100
      text-xs dark:text-gray-300 text-gray-700
      transition-colors duration-200 ease-out
      group-hover:dark:bg-gray-600
      group-hover:bg-gray-200
    "
                      >
                        <span className="text-gray-400">Frequency:</span>

                        <span className="dark:text-gray-300 text-gray-700 w-10 font-medium">
                          {formatLabel(frequency)}
                        </span>

                        <SlArrowDown
                          size={10}
                          className={`
        transition-transform duration-200 ease-out group-hover:rotate-180
      `}
                        />
                      </button>

                      <div
                        className={`
      absolute left-0 mt-2 w-44 overflow-hidden rounded-lg
      bg-gray-100 dark:bg-[#1D293D]
      border border-gray-200 dark:border-gray-700
      shadow-lg z-50
      transform-gpu
      transition-all duration-200 ease-out "opacity-0 scale-95 -translate-y-1 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:visible
    `}
                      >
                        {frequencies.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setFrequency(item);
                              dispatch(
                                changeFilter({
                                  key: "frequency",
                                  value: item,
                                }),
                              );
                            }}
                            className={`
          w-full text-left px-4 py-2 text-xs
          transition-colors duration-150 ease-out
          ${
            frequency === item
              ? "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:dark:bg-[#1f2937]"
          }
        `}
                          >
                            {formatLabel(item)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative inline-block group">
                      <button
                        className="
      flex items-center gap-2 px-4 py-1.5 rounded-full
      dark:bg-gray-700 bg-gray-100
      text-xs dark:text-gray-300 text-gray-700
      transition-colors duration-200 ease-out
      group-hover:dark:bg-gray-600
      group-hover:bg-gray-200
    "
                      >
                        <span className="text-gray-400">Status:</span>

                        <span className="dark:text-gray-300 text-gray-700 font-medium">
                          {formatLabel(status)}
                        </span>

                        <SlArrowDown
                          size={10}
                          className={` transition-transform duration-200 ease-out group-hover:rotate-180`}
                        />
                      </button>

                      <div
                        className={`
      absolute left-0 mt-2 w-44 overflow-hidden rounded-lg
      bg-gray-100 dark:bg-[#1D293D]
      border border-gray-200 dark:border-gray-700
      shadow-lg z-50
      transform-gpu
      transition-all duration-200 ease-out opacity-0 scale-95 -translate-y-1 invisible group-hover:opacity-100  group-hover:scale-100  group-hover:translate-y-0 group-hover:visible
      
    `}
                      >
                        {statusList.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setStatus(item);
                              dispatch(
                                changeFilter({
                                  key: "status",
                                  value: item,
                                }),
                              );
                            }}
                            className={`
          w-full text-left px-4 py-2 text-xs
          transition-colors duration-150 ease-out
          ${
            status === item
              ? "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 hover:dark:bg-[#1f2937]"
          }
        `}
                          >
                            {formatLabel(item)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <CustomToggle
                      label="Hide sports?"
                      checked={hideFilter.sports}
                      onChange={() => toggleFilter("sports")}
                    />

                    <CustomToggle
                      label="Hide crypto?"
                      checked={hideFilter.crypto}
                      onChange={() => toggleFilter("crypto")}
                    />

                    <CustomToggle
                      label="Hide earnings?"
                      checked={hideFilter.earnings}
                      onChange={() => toggleFilter("earnings")}
                    />

                    <button
                      onClick={handleCleanFilter}
                      className="!text-xs text-gray-700 dark:text-gray-400  hover:dark:bg-gray-700 !px-4 py-1.5 rounded-full hover:underline cursor-pointer hover:!text-gray-300 hover:text-gray-700 hover:dark:text-gray-300"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
      </div>

      <Authentication
        isLogin={isLogin}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Header;

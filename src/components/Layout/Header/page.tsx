"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Drawer from "@/components/Drawer/page";
import Authentication from "@/components/Pages/auth";
import { useDispatch, useSelector } from "react-redux";
import { getCommonCategoryAll } from "@/components/service/apiService/category";
import { saveCategory } from "@/components/store/slice/category";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import CustomMenu from "@/components/common/CustomMenu";
import { userBalance } from "@/components/service/apiService/user";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

interface CategoryState {
  category?: {
    id?: number;
  };
}

interface UserState {
  id?: number;
  isAuth: boolean;
}

interface RootState {
  category?: CategoryState;
  user?: UserState;
}

interface Category {
  id: number;
  name: string;
}

interface CategoryApiResponse {
  success: boolean;
  data?: {
    categories?: Category[];
  };
}

interface UserBalanceResponse {
  success: boolean;

  data?: {
    balance: string | number;
  };
}

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const id = searchParams.get("id");
  console.log(pathname, "pathname");

  const user = useSelector((state: RootState) => state?.user);
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
    try {
      const response: CategoryApiResponse = await getCommonCategoryAll();

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
    }
  }, [dispatch]);

  useEffect(() => {
    categoryAllList();
  }, [categoryAllList]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const getUserBalance = async () => {
    try {
      const response: UserBalanceResponse = await userBalance();

      if (response.success && response.data?.balance !== undefined) {
        localStorage.setItem("balance", String(response.data.balance));
      } else {
        localStorage.removeItem("balance");
      }
    } catch {
      localStorage.removeItem("balance");
    }
  };
  useEffect(() => {
    if (token) {
      getUserBalance();
    }
  }, [token]);

  return (
    <>
      <header className="w-full dark:bg-[#0f172a] bg-[#fff] fixed top-0 z-30">
        <div className="max-w-[1268px] mx-auto px-4">
          <div
            className={`flex items-center justify-between ${
              pathname === "/"
                ? ""
                : "border-b dark:border-gray-800 border-gray-300"
            } py-3   relative`}
          >
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className=" text-xl font-bold">
                  <div className=" text-xl font-bold">
                    {/* Light mode logo */}
                    <Image
                      src="/img/opinionLogo-dark.png"
                      alt="Opinion logo"
                      width={160}
                      height={160}
                      priority
                      className="
                          h-auto
                          w-[40px]
                          sm:w-[50px]
                          md:w-[60px]
                          lg:w-[70px]
                          xl:w-[80px]
                          block
                          dark:hidden
                        "
                    />

                    {/* Dark mode logo */}
                    <Image
                      src="/img/opinionLogo-light.png"
                      alt="Opinion logo"
                      width={160}
                      height={160}
                      priority
                      className="
                            h-auto
                            w-[40px]
                            sm:w-[50px]
                            md:w-[60px]
                            lg:w-[70px]
                            xl:w-[80px]
                            hidden
                            dark:block
                          "
                    />
                  </div>
                  <span className="text-white"> </span>
                </div>
              </div>
            </Link>
            <div className="absolute top-full left-0 w-full lg:ml-20 lg:px-4 md:static md:w-[800px] md:max-w-lg md:mx-3 mx-auto">
              <div className="relative">
                <span className="absolute inset-y-0 right-3 flex items-center pl-3 text-gray-400">
                  <FaSearch className="dark:text-[#c7ac77]/60" />
                </span>
                {/* Input Box */}
                <input
                  type="text"
                  placeholder="Search opinion kings"
                  className="w-full pl-4 pr-4 py-2 rounded-md dark:bg-[#1e293b] bg-[#eff3f9] 
                 dark:text-gray-900 text-gray-200 placeholder-gray-400 
                  focus:outline-none focus:ring-1 focus:ring-gray-200"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-2 ml-auto">
              {user?.isAuth ? (
                <CustomMenu />
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-1 border border-[#c7ac77] text-[#c7ac77] rounded-md hover:bg-[#c7ac77] font-bold hover:text-white"
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleSignup}
                    className="px-4 py-1 rounded-md text-white font-bold bg-[#c7ac77] hover:bg-gray-500"
                  >
                    Sign Up
                  </button>
                </>
              )}
              <ThemeToggle />
            </div>
            <Drawer
              buttonLabel={
                <span className="text-black dark:text-[#c7ac77] text-xl">
                  ☰
                </span>
              }
              className="cursor-pointer"
            />
          </div>
          {pathname === "/" && (
            <nav className="border-b pb-2 dark:border-gray-800 border-gray-300 w-full hidden lg:block">
              <ul className="flex justify-start gap-10 w-full px-4 py-2 text-[15px]">
                {category?.map((row: Category, index: number) => (
                  <li key={index}>
                    <div
                      onClick={() => {
                        dispatch(saveCategory(row));
                        setCategoryId(row?.id);
                      }}
                      className={` ${
                        row?.id == categoryId
                          ? "text-black dark:text-[#c7ac77]"
                          : "dark:text-gray-300 text-[#5e5e5f] hover:text-[#c7ac77]  cursor-pointer"
                      } font-semibold flex items-center`}
                    >
                      {index == 0 && (
                        <span>
                          <FaArrowTrendUp className="mr-1" />
                          {/* <Image
                            src={Trend}
                            width={14}
                            height={14}
                            alt="trending"
                            className="mr-1"
                          /> */}
                        </span>
                      )}
                      {row?.name}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
      <Authentication
        isLogin={isLogin}
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default Header;

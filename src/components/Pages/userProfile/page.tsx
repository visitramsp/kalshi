"use client";

import { userBalance, userDetails } from "@/components/service/apiService/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";
import UpdateProfile from "./updateProfile";
import {
  ApiResponse,
  UserBalanceData,
  UserProfileData,
} from "@/utils/typesInterface";
import ProfileTabs from "./proTabs/page";
import FollowingFollowerList from "@/components/Modal/FollowingFollowerList/page";

// Define the shape expected by ProfileTabs
interface ProfileStats {
  portfolio: {
    investedAmount: number;
    currentValue: number;
    totalPnL: number;
  };
  stats: {
    totalTrades: string | number;
    activeMarkets: string | number;
  };
}

const UserProfile = () => {
  const [user, setUser] = useState<UserProfileData[] | null>(null);
  const [balance, setBalance] = useState<UserBalanceData | null>(null);
  const [open, setOpen] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  // Derived safe data
  const userData = user?.[0] || null;
  const portFolioData = user?.[1] || null;

  // Safe portfolio & stats with defaults
  const profileStats: ProfileStats = {
    portfolio: {
      investedAmount: portFolioData?.portfolio?.investedAmount || 0,
      currentValue: portFolioData?.portfolio?.currentValue || 0,
      totalPnL: portFolioData?.portfolio?.totalPnL || 0,
    },
    stats: {
      totalTrades: portFolioData?.stats?.totalTrades || "0",
      activeMarkets: portFolioData?.stats?.activeMarkets || "0",
    },
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUserBalance = async () => {
    try {
      const response: ApiResponse<UserBalanceData> = await userBalance();
      if (response.success) {
        setBalance(response.data);
      } else {
        setBalance(null);
      }
    } catch {
      setBalance(null);
    }
  };

  const userDetailsList = async () => {
    try {
      const response: ApiResponse<UserProfileData[]> = await userDetails();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    getUserBalance();
    userDetailsList();
  }, []);

  return (
    <>
      <div>
        <div className="max-w-[800px] xl:max-w-[65%] mx-auto px-4 mt-2 lg:mt-6">
          <div className="md:flex justify-between md:pt-16 pt-8">
            <div className="md:w-3/4 gap-3 md:flex md:mb-0 mb-4">
              <div className="h-24 w-24 flex items-center justify-center rounded bg-gray-300/20">
                <Image
                  src={userData?.user?.image_url || "/img/user.png"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="dark:text-white text-black font-bold text-xl">
                  {userData?.user?.username || "Unknown User"}
                </h2>
                <p className="dark:text-gray-400 text-gray-700 text-sm">
                  {userData?.user?.email || "--"}
                </p>
                <p className="dark:text-gray-400 text-gray-700 text-sm">
                  Joined{" "}
                  {userData?.user?.createdAt
                    ? moment(userData.user.createdAt).format("DD MMM YYYY")
                    : "--"}
                </p>
                <p className="text-gray-200 mt-3 text-sm flex flex-wrap gap-4">
                  <span
                    onClick={() => setIsFollow(true)}
                    className="dark:text-gray-400 cursor-pointer text-gray-700"
                  >
                    <span className="dark:text-white text-gray-800 font-semibold">
                      {userData?.following || "0"}
                    </span>{" "}
                    Following
                  </span>

                  <span
                    onClick={() => setIsFollow(true)}
                    className="dark:text-gray-400 cursor-pointer text-gray-700"
                  >
                    <span className="dark:text-white text-gray-800 font-semibold">
                      {userData?.follower || "0"}
                    </span>{" "}
                    Followers
                  </span>

                  <span className="dark:text-gray-400 text-gray-700">
                    <span className="dark:text-white text-gray-800 font-semibold">
                      {profileStats.stats.totalTrades}
                    </span>{" "}
                    Predictions
                  </span>
                </p>
              </div>
            </div>

            <div className="md:w-1/4">
              <button
                onClick={() => setOpen(true)}
                className="
    md:float-end mb-3
    relative select-none cursor-pointer

    bg-[#0099FF] text-white
    py-2 px-6 rounded-2xl text-sm font-semibold

    
    transition-all duration-150 ease-in-out

    hover:brightness-110
    active:translate-y-[4px]
    active:shadow-[0_2px_0_#0077cc]
  "
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-800 text-xs dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-gray-200">
                Bio:
              </span>{" "}
              {userData?.user?.description || "--"}
            </span>
          </div>

          {/* Total Balance */}
          <div className="md:mt-3 pt-1 border-t dark:border-gray-700 border-gray-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="me-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="-1.7 0 20.4 20.4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#008236"
                  >
                    <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.844 1.754a2.249 2.249 0 0 0-.556-1.477l-.001-.002a3.02 3.02 0 0 0-.835-.665l-.003-.002a3.498 3.498 0 0 0-.866-.313H9.31a3.78 3.78 0 0 0-.795-.083 2.849 2.849 0 0 1-.475-.037 1.8 1.8 0 0 1-.494-.158l-.002-.001a1.17 1.17 0 0 1-.371-.298L7.172 9a.733.733 0 0 1-.175-.44.749.749 0 0 1 .421-.63 2.157 2.157 0 0 1 1.11-.297 2.283 2.283 0 0 1 .391.066l.049.01a2.479 2.479 0 0 1 .473.166 1.33 1.33 0 0 1 .381.261.792.792 0 1 0 1.118-1.12 2.902 2.902 0 0 0-.85-.585 3.996 3.996 0 0 0-.785-.268h-.001l-.008-.002v-.786a.792.792 0 1 0-1.583 0v.763a3.557 3.557 0 0 0-1.14.454 2.328 2.328 0 0 0-1.159 1.967 2.296 2.296 0 0 0 .529 1.44 2.724 2.724 0 0 0 .894.717 3.342 3.342 0 0 0 .942.305 4.398 4.398 0 0 0 .736.059 2.202 2.202 0 0 1 .46.046 1.927 1.927 0 0 1 .467.168 1.431 1.431 0 0 1 .382.308.674.674 0 0 1 .165.436c0 .097 0 .324-.385.573a2.182 2.182 0 0 1-1.132.314 3.515 3.515 0 0 1-.494-.06 2.381 2.381 0 0 1-.459-.148h-.001a.953.953 0 0 1-.356-.274.792.792 0 1 0-1.197 1.037 2.516 2.516 0 0 0 .967.708 3.799 3.799 0 0 0 .774.237h.007v.783a.792.792 0 1 0 1.583 0v-.79a3.581 3.581 0 0 0 1.17-.479 2.215 2.215 0 0 0 1.107-1.9z" />
                  </svg>
                </span>
                <span className="dark:text-gray-400 text-gray-700 font-normal text-sm">
                  Total Balance
                </span>
              </div>
              <div className="md:mb-0 mb-3">
                <span className="bg-green-700 text-white py-1 px-4 text-sm font-semibold rounded-full">
                  ${(Number(balance?.balance) || 0).toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {/* Total Investment */}
          <div className="md:mt-3 pt-3 border-t dark:border-gray-700 border-gray-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="me-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="14"
                      width="3"
                      height="7"
                      rx="1"
                      fill="#f5c94d"
                    />
                    <rect
                      x="8"
                      y="11"
                      width="3"
                      height="10"
                      rx="1"
                      fill="#f5c94d"
                    />
                    <rect
                      x="13"
                      y="7"
                      width="3"
                      height="14"
                      rx="1"
                      fill="#f5c94d"
                    />
                    <rect
                      x="18"
                      y="3"
                      width="3"
                      height="18"
                      rx="1"
                      fill="#f5c94d"
                    />
                  </svg>
                </span>
                <span className="dark:text-gray-400 text-gray-700 font-normal text-sm">
                  Total Investment
                </span>
              </div>

              <div>
                <span className="bg-yellow-500/70 text-white py-1 px-4 text-sm rounded-full font-semibold">
                  $
                  {Number(profileStats.portfolio.investedAmount).toFixed(
                    3,
                  )}{" "}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="py-4">
            <ProfileTabs data={profileStats} />
          </div>
        </div>

        <UpdateProfile
          isOpen={open}
          handleClose={handleClose}
          userDetails={userData}
          fetchUserDetails={userDetailsList}
        />
        <FollowingFollowerList
          handleClose={() => setIsFollow(false)}
          isOpen={isFollow}
          onClose={() => setIsFollow(false)}
          userId={userData?.user?.id}
        />
      </div>
    </>
  );
};

export default UserProfile;

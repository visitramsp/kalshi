import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Image from "next/image";
import { LuUpload } from "react-icons/lu";
import {
  FaRegCommentAlt,
  FaRegBookmark,
  FaRegHeart,
  FaBookmark,
} from "react-icons/fa";
import { HighlightTexts, timeAgoCompact } from "@/utils/Content";
// import {
//   postBookmarkOrUnBookMark,
//   postLikeOrUnlike,
// } from "../service/apiService/user";
import { FcLike } from "react-icons/fc";
import toast from "react-hot-toast";
import { PostFeeBack, SetPosts } from "@/utils/typesInterface";
import {
  postBookmarkOrUnBookMark,
  postLikeOrUnlike,
} from "@/components/service/apiService/user";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
type HandleComment = (post: PostFeeBack) => void;

export default function IdeaTabsTwo({
  postedList,
  setAllPosts,
  handleComment,
}: {
  postedList: PostFeeBack[];
  setAllPosts: SetPosts;
  handleComment: HandleComment;
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  console.log(postedList, "postedList");

  // const handleShareNow = (postDetails: any) => {
  //   console.log(postDetails, "share===>");
  // };

  const handleLikeUnlike = async (id: number, isLike: number) => {
    try {
      if (isLike == 1) {
        toast.success("Unlike");
      } else {
        toast.success("like");
      }
      setAllPosts((prev) =>
        prev.map((item) => {
          if (item.id == id) {
            const isLiked = item.isLiked === 1 ? 0 : 1;

            return {
              ...item,
              isLiked,
              likeCount: isLiked
                ? item.likeCount + 1
                : Math.max(item.likeCount - 1, 0),
            };
          }
          return item;
        })
      );

      const payload = {
        postId: id,
      };

      await postLikeOrUnlike(payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleBookMarkOrUnBookMark = async (
    id: number,
    isBookmarked: number
  ) => {
    try {
      setAllPosts((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const booked = item.isBookmarked === 1 ? 0 : 1;
            return {
              ...item,
              isBookmarked: booked,
            };
          }
          return item;
        })
      );
      if (isBookmarked == 1) {
        toast.success("Remove for bookmarks");
      } else {
        toast.success("Bookmark successfully");
      }
      const payload = {
        postId: id,
      };
      await postBookmarkOrUnBookMark(payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "var(--border-color)",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="time filter tabs"
          sx={{
            "& .MuiTab-root": {
              color: "#6b7280",
              textTransform: "none",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "#caac75",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#caac75",
            },
          }}
        >
          <Tab label="Now" {...a11yProps(0)} />
          {/* <Tab label="Today" {...a11yProps(1)} />
          <Tab label="This Week" {...a11yProps(2)} />
          <Tab label="This Month" {...a11yProps(3)} /> */}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="p-3 border-b dark:border-gray-700 border-gray-200">
          {postedList?.length > 0 ? (
            postedList?.map((row: PostFeeBack, index: number) => {
              const contentForPost = JSON.parse(row?.metadata);
              console.log(contentForPost, "contentForPost");

              return (
                <div
                  key={row.id}
                  className={`md:flex ${
                    index > 0 && "pt-4 border-t border-gray-800"
                  }  border-gray-300 pb-2 items-start gap-4 w-full md:px-4 px-0`}
                >
                  <div>
                    <Image
                      src={
                        row?.User?.image_url ||
                        "https://cdn.vectorstock.com/i/500p/98/17/gray-man-placeholder-portrait-vector-23519817.jpg"
                      }
                      alt="user"
                      width={70}
                      height={70}
                      className="rounded-md mt-1"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4>
                        <span className="dark:text-gray-300 hover:underline font-semibold text-gray-700">
                          {row?.User?.username || "Unknown"} dd
                        </span>{" "}
                        <span className="text-xs dark:text-gray-500 text-gray-500">
                          {timeAgoCompact(row?.updatedAt)}
                        </span>
                      </h4>
                    </div>
                    <p className="text-md mt-2 dark:text-gray-400 text-gray-800">
                      {contentForPost?.content && (
                        <HighlightTexts
                          key={index}
                          text={contentForPost?.content}
                        />
                      )}
                      <br />
                      <br />
                      {contentForPost?.images?.length > 0 && (
                        <Image
                          src={contentForPost?.images?.[0]}
                          height={500}
                          alt="post image"
                          width={500}
                        />
                      )}
                    </p>
                    {/* <p className="mt-3 cursor-pointer hover:underline text-[#caac75] font-semibold">
                      Ningbo Rockets vs Beijing Ducks
                    </p>
                    <p className="text-sm text-[#caac75]/80">
                      Yes . Beijing Ducks . BED at NIN (Jan 6) . 86% chance{" "}
                      <FaArrowUp
                        className="
                          rotate-45
                          text-green-400
                          transition-transform
                          duration-200
                          hover:scale-125 inline-block
                        "
                      />{" "}
                      Now 77% chance
                    </p> */}

                    <div className="mt-4">
                      <div className="flex justify-between">
                        <div className="flex gap-3 items-center">
                          <span
                            className="
                              p-2
                              rounded
                              inline-block
                              text-gray-500
                              dark:text-gray-400
                              hover:bg-gray-400/30
                              transition-all
                              duration-200
                              ease-in-out text-lg cursor-pointer
                            "
                          >
                            <FaRegCommentAlt
                              onClick={() => handleComment(row)}
                            />
                          </span>
                          <span className="inline-block relative -left-3 font-light text-gray-400">
                            {row?.commentCount || 0}
                          </span>

                          <span
                            className="
                                p-2
                                rounded
                                inline-block
                                text-gray-500
                                dark:text-gray-400
                                hover:bg-gray-400/30
                                transition-all
                                duration-200
                                ease-in-out text-xl cursor-pointer
                              "
                          >
                            {/* FcLike  */}

                            {row?.isLiked == 1 ? (
                              <FcLike
                                onClick={() =>
                                  handleLikeUnlike(row?.id, row?.isLiked)
                                }
                              />
                            ) : (
                              <FaRegHeart
                                onClick={() =>
                                  handleLikeUnlike(row?.id, row?.isLiked)
                                }
                              />
                            )}
                          </span>
                          <span className="inline-block relative -left-3 font-light text-gray-400">
                            {row?.likeCount || 0}
                          </span>
                          <span
                            className="
                              p-2
                              rounded
                              inline-block
                              text-gray-500
                              dark:text-gray-400
                              hover:bg-gray-400/30
                              transition-all
                              duration-200
                              ease-in-out text-lg cursor-pointer
                            "
                          >
                            {row?.isBookmarked == 1 ? (
                              <FaBookmark
                                className="text-[#156bf7]"
                                onClick={() =>
                                  handleBookMarkOrUnBookMark(
                                    row?.id,
                                    row?.isBookmarked
                                  )
                                }
                              />
                            ) : (
                              <FaRegBookmark
                                onClick={() =>
                                  handleBookMarkOrUnBookMark(
                                    row?.id,
                                    row?.isBookmarked
                                  )
                                }
                              />
                            )}
                          </span>
                          <span className="inline-block relative -left-3 font-light text-gray-400"></span>
                          <span
                            className="
                              p-2
                              rounded
                              inline-block
                              text-gray-500
                              dark:text-gray-400
                              hover:bg-gray-400/30
                              transition-all
                              duration-200
                              ease-in-out text-lg cursor-pointer
                            "
                          >
                            <LuUpload />
                            {/* <LuUpload onClick={() => handleShareNow(row)} /> */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-center">Not found any list</div>
          )}
        </div>
      </CustomTabPanel>
    </Box>
  );
}

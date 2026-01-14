"use client";

import {
  getCommentsList,
  replyComments,
} from "@/components/service/apiService/user";
import { HighlightTexts, timeAgoCompact } from "@/utils/Content";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBookmark,
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegHeart,
} from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { LuUpload } from "react-icons/lu";
import { MdSend } from "react-icons/md";
import toast from "react-hot-toast";
import {
  CommentInterface,
  PostFeeBack,
  PostMetadata,
} from "@/utils/typesInterface";
import { CircularProgress } from "@mui/material";

const PROFESSIONAL_EMOJIS = [
  "🙂",
  "😊",
  "😄",
  "👍",
  "👏",
  "🙏",
  "✅",
  "✔️",
  "❌",
  "💼",
  "📊",
  "📈",
  "📉",
  "💡",
  "🚀",
  "🔔",
  "📌",
  "⭐",
  "🏆",
];

export default function CommentPage({
  postDetails,
}: {
  postDetails: PostFeeBack;
}) {
  const [commentList, setCommentList] = useState<CommentInterface[]>([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  console.log(commentList, "commentList");

  const commentLists = useCallback(async () => {
    setIsLoader(true);
    try {
      const response = await getCommentsList(postDetails?.id || null);
      console.log(response, "response");

      if (response?.success) {
        setCommentList(response.data ?? []);
      } else {
        setCommentList([]);
      }
    } catch {
      setCommentList([]);
    } finally {
      setIsLoader(false);
    }
  }, [postDetails?.id]);

  useEffect(() => {
    commentLists();
  }, [commentLists]);

  function parsePostMetadata(metadata: string | PostMetadata): PostMetadata {
    if (typeof metadata === "string") {
      try {
        return JSON.parse(metadata);
      } catch {
        return {};
      }
    }
    return metadata ?? {};
  }

  const contentForPost = parsePostMetadata(postDetails?.metadata);

  const handleSend = async () => {
    if (!value.trim()) return;

    try {
      const payload = {
        postId: postDetails?.id,
        comment: value,
      };
      const response = await replyComments(payload);
      if (response.success) {
        toast.success("Message send successfully!");
        commentLists();
        setValue("");
        setOpen(false);
      } else {
        toast.error(response?.message || "something went wrong");
        setValue("");
        setOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }

    console.log("SEND MESSAGE:", replyComments);
  };

  //   replyComments
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // stop new line
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const text = value.substring(0, start) + emoji + value.substring(end);

    setValue(text);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div
          className={`md:flex 
             pt-4 
          pb-2 items-start gap-4 w-full md:px-4 px-0`}
        >
          <div>
            <Image
              src={
                postDetails?.User?.image_url ||
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
                  {postDetails?.User?.username || "Unknown"} dd
                </span>{" "}
                <span className="text-xs dark:text-gray-500 text-gray-500">
                  {timeAgoCompact(postDetails?.updatedAt)}
                </span>
              </h4>
            </div>
            <p className="text-md mt-2 dark:text-gray-400 text-gray-800">
              {contentForPost?.content && (
                <HighlightTexts text={contentForPost?.content} />
              )}
              <br />
              <br />
              {Number(contentForPost?.images?.length) > 0 && (
                <Image
                  src={contentForPost?.images?.[0] || ""}
                  height={500}
                  alt="post image"
                  width={500}
                />
              )}
            </p>

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
                    //   onClick={() => handleComment(row)}
                    />
                  </span>
                  <span className="inline-block relative -left-3 font-light text-gray-400">
                    {postDetails?.commentCount || 0}
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

                    {postDetails?.isLiked == 1 ? (
                      <FcLike
                      // onClick={() =>
                      //   handleLikeUnlike(row?.id, row?.isLiked)
                      // }
                      />
                    ) : (
                      <FaRegHeart
                      // onClick={() =>
                      //   handleLikeUnlike(postDetails?.id, postDetails?.isLiked)
                      // }
                      />
                    )}
                  </span>
                  <span className="inline-block relative -left-3 font-light text-gray-400">
                    {postDetails?.likeCount || 0}
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
                    {postDetails?.isBookmarked == 1 ? (
                      <FaBookmark
                        className="text-[#156bf7]"
                        // onClick={() =>
                        //   handleBookMarkOrUnBookMark(
                        //     postDetails?.id,
                        //     postDetails?.isBookmarked
                        //   )
                        // }
                      />
                    ) : (
                      <FaRegBookmark
                      // onClick={() =>
                      //   handleBookMarkOrUnBookMark(
                      //     row?.id,
                      //     row?.isBookmarked
                      //   )
                      // }
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
        <div className="relative  mx-10">
          <div
            className="
                    relative rounded-xl  border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f172a]
                    shadow-sm ideasScrollbarHide focus-within:ring-2 focus-within:ring-blue-500/30 transition
                "
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a professional message..."
              className="
                w-full
                ideasScrollbarHide
                min-h-[90px]
                resize-none
                bg-transparent
                px-4 pt-4 pb-12
                text-sm
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400
                outline-none
            "
            />

            {/* Footer Actions */}
            <div
              className="
      absolute bottom-2 left-0 right-0
      flex items-center justify-end
      px-3
    "
            >
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="
          flex items-center gap-1
          text-gray-500 hover:text-gray-800
          dark:text-gray-400 dark:hover:text-white
          text-lg
          px-2 py-1
          rounded-md
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
        "
              >
                🙂
                {/* <span className="hidden sm:inline">Emoji</span> */}
              </button>

              {/* Reply Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!value.trim()}
                className="
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-blue-300
          text-white
          text-sm
          flex flex-row items-center gap-2
          font-medium
          px-4 py-1.5
          rounded-md
          transition
        "
              >
                Reply <MdSend />
              </button>
            </div>
          </div>

          {/* Emoji Picker */}
          {open && (
            <div
              className="
      absolute right-0 bottom-[110%]
      w-72
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      shadow-xl
      rounded-lg
      p-3
      flex flex-wrap gap-2
      z-20
    "
            >
              {PROFESSIONAL_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="
            text-xl
            rounded-md
            p-2
            hover:bg-gray-100
            dark:hover:bg-gray-800
            transition
          "
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-0">
          {" "}
          <hr className="border-gray-700" />
        </div>
        <div>
          {isLoader ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <CircularProgress className="" />
            </div>
          ) : commentList?.length > 0 ? (
            commentList?.map((row: CommentInterface) => {
              return (
                <div
                  key={row?.id}
                  className={`md:flex 
             pt-4 
          pb-2 items-start gap-4 w-full border-b border-gray-700 md:px-4 px-0`}
                >
                  <div>
                    <Image
                      src={
                        row?.User?.image_url ||
                        "https://cdn.vectorstock.com/i/500p/98/17/gray-man-placeholder-portrait-vector-23519817.jpg"
                      }
                      alt="user"
                      width={30}
                      height={30}
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
                      {row?.content && <HighlightTexts text={row?.content} />}
                      <br />
                      <br />
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                <FaRegCommentAlt className="text-2xl text-gray-500 dark:text-gray-400" />
              </div>

              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                No comments yet
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Be the first to share your thoughts and start the conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  getCommentsList,
  getFeedDetailsById,
  imageUpload,
  postBookmarkOrUnBookMark,
  postLikeOrUnlike,
  postUserCommentLikeOrUnlike,
  replyComments,
} from "@/components/service/apiService/user";
import {
  countWords,
  delay,
  HighlightTexts,
  MAX_WORDS,
  timeAgoCompact,
} from "@/utils/Content";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBookmark,
  FaChevronLeft,
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
  IReply,
  PostFeeBack,
  PostMetadata,
} from "@/utils/typesInterface";
import { CircularProgress } from "@mui/material";
import { Gift, Heart } from "lucide-react";
import MobileMenu from "../IdeaList/page";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PROFESSIONAL_EMOJIS } from "@/components/content";
import InputTextArea from "../IdeaTabs/InputTextArea";
import { GrCloudUpload } from "react-icons/gr";
import GiphyModal from "@/components/Pages/detail/component/postList/GiphyModal";
import SubComment from "@/components/Modal/SubComment";

export default function CommentPage() {
  const [postDetails, setPostDetails] = useState<PostFeeBack | null>(null);
  const [commentList, setCommentList] = useState<CommentInterface[]>([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [subCommentData, setSubCommentData] = useState<any>({});
  const [replyText, setReplyText] = useState("");
  const [subRepliesData, setSubRepliesData] = useState<any>({});
  const [isLike, setIsLike] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(0);
  const { slug } = useParams();
  const router = useRouter();
  const [gif, setGif] = useState(null);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [isImageUploadLoader, setIsImageUploadLoader] = useState(false);
  const [isSendMessage, setIsSendMessage] = useState(false);
  const wrapperRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef(null);

  // new
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentIds, setCommentIds] = useState(null);
  const [rowDetails, setRowDetails] = useState({});
  const [mixText, setMixText] = useState("");
  const [imageGif, setImageGif] = useState(null);
  const [isSendMessageLoader, setIsSendMessageLoader] = useState(false);
  const handleOpenSubComment = (item, commentId = null) => {
    setCommentOpen(true);

    setRowDetails(item);
    setCommentIds(commentId);
  };

  const handleCloseComment = () => {
    setMixText("");
    setOpen(false);
    setCommentIds(null);
    setRowDetails({});
    setImageGif(null);
    setCommentOpen(false);
  };

  useEffect(() => {
    setIsLoader(true);

    const timer = setTimeout(() => {
      setIsLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // getFeedDetailsById

  const postDetailsById = useCallback(async () => {
    // setIsLoader(true);
    try {
      const [response] = await Promise.all([
        getFeedDetailsById(Number(slug)),
        delay(1000),
      ]);

      const detailsPost = response?.feed?.[0];
      setIsLike(detailsPost?.isLiked);
      setIsBookmarked(detailsPost?.isBookmarked);

      setPostDetails(detailsPost || null);
    } catch {
      setPostDetails(null);
    }
  }, [slug]);

  useEffect(() => {
    postDetailsById();
  }, [postDetailsById]);

  const commentLists = useCallback(async () => {
    // setIsLoader(true);
    try {
      const [response] = await Promise.all([
        getCommentsList(Number(slug)),
        delay(1000),
      ]);

      if (response?.success) {
        setCommentList(response.data ?? []);
      } else {
        setCommentList([]);
      }
    } catch {
      setCommentList([]);
    } finally {
      // setIsLoader(false);
    }
  }, [slug]);

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

  const handleCloseMessage = () => {
    setGif(null);
    setIsSendMessage(false);
    setValue("");
    setOpen(false);
  };
  const handleSend = async () => {
    if (!value.trim()) return;
    setIsSendMessage(true);
    try {
      const payload = {
        postId: slug,
        comment: value,
        metadata: gif ? { images: [gif] } : null,
      };
      const [response] = await Promise.all([
        replyComments(payload),
        delay(1000),
      ]);
      if (response.success) {
        toast.success("Message send successfully!");
        commentLists();
        handleCloseMessage();
      } else {
        toast.error(response?.message || "something went wrong");
        setOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSendMessage(false);
    }
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

  const handleSubmitForSubComment = async (
    row: any,
    replyText: string,
    imageLink: any,
  ) => {
    setIsSendMessageLoader(true);
    try {
      const payload = {
        postId: slug,
        comment: `@${row?.User?.username} ${replyText}`,
        metadata: imageLink ? { images: [imageLink] } : null,
        replyCommentId: commentIds,
      };

      console.log(payload, "payload");

      // return;
      const [response] = await Promise.all([
        replyComments(payload),
        delay(1000),
      ]);
      if (response.success) {
        toast.success("Message send successfully!");
        commentLists();
        setMixText("");
        setGif(null);
        setSubCommentData({});
        setSubRepliesData(null);
        setCommentOpen(false);
        setCommentIds(null);
        setReplyText("");
        setOpen(false);
      } else {
        toast.error(response?.message || "something went wrong");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSendMessageLoader(false);
    }
  };

  const handleLikeUnlike = async (id: number, isLike: number) => {
    try {
      if (isLike == 1) {
        toast.success("Unlike");
        setIsLike(0);
      } else {
        toast.success("like");
        setIsLike(1);
      }

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

  const handleBookMarkOrUnBookMark = async () => {
    try {
      if (isBookmarked == 1) {
        toast.success("Remove for bookmarks");
        setIsBookmarked(0);
      } else {
        toast.success("Bookmark successfully");
        setIsBookmarked(1);
      }
      const payload = {
        postId: postDetails?.id,
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

  const handleCommentLikeUnlike = async (id: number, isLike: number) => {
    try {
      if (isLike == 1) {
        toast.success("Unlike");
        // setIsLike(0);
      } else {
        toast.success("like");
        // setIsLike(1);
      }

      const payload = {
        commentId: id,
      };

      const response = await postUserCommentLikeOrUnlike(payload);
      commentLists();
      if (!response.success) {
        toast.success(response?.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  //router

  const goBack = () => {
    router.back();
  };

  const chooseImages = async (file: File) => {
    setIsImageUploadLoader(true);
    try {
      const formData = new FormData();
      formData.append("images", file);
      const [response] = await Promise.all([
        imageUpload(formData),
        delay(1000),
      ]);
      if (response?.success) {
        setGif(response?.data?.[0]?.url);
        setShowUploadMenu(false);
      } else {
        toast.error(response?.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsImageUploadLoader(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    chooseImages(file);
  };

  const handleUserDetails = (id: any) => {
    router.push(`/ideas/profile/${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowUploadMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="max-w-[880px] xl:max-w-[1268px] mx-auto px-4 pt-7 sm:pt-9 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-32 dark:border-gray-700">
              <div className="pl-12 md:pl-0">
                {" "}
                <h1 className="dark:text-white text-gray-800 lg:text-3xl text-xl mb-0 mt-3">
                  Ideas
                </h1>
                <span className="text-gray-500 text-xs">
                  Serving public conversation
                </span>
              </div>
              <MobileMenu />
            </div>
          </div>
          <div className="lg:col-span-3 lg:border-l dark:border-gray-700 border-gray-200 min-h-1/2 ">
            <div className="lg:border-r dark:border-gray-700 border-gray-200">
              <div className="flex flex-col gap-0">
                <div className="sm:pl-5 flex flex-row items-center gap-3">
                  <FaChevronLeft
                    className="cursor-pointer text-sky-300"
                    onClick={goBack}
                  />
                  <span className="text-gray-600 font-semibold dark:text-gray-400">
                    Details
                  </span>
                </div>
                <div className="flex flex-col w-full h-full gap-2">
                  <div
                    className={`flex 
             pt-4 
          pb-2 items-start gap-2 sm:gap-4 w-full md:px-4 px-0`}
                  >
                    <div
                      onClick={() =>
                        handleUserDetails(`${postDetails?.User?.id}`)
                      }
                      className="
                        bg-gray-200 
                        dark:bg-gray-500
                        rounded-full 
                        cursor-pointer
                        flex-shrink-0
                        w-10 h-10
                        p-2
                        sm:w-12 sm:h-12
                        md:w-14 md:h-14
                        overflow-hidden
                      "
                    >
                      <Image
                        src={
                          postDetails?.User?.image_url ||
                          "https://cdn.vectorstock.com/i/500p/98/17/gray-man-placeholder-portrait-vector-23519817.jpg"
                        }
                        alt="user"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4>
                          <span
                            onClick={() =>
                              handleUserDetails(`${postDetails?.User?.id}`)
                            }
                            className="dark:text-gray-300 cursor-pointer hover:underline font-semibold text-gray-700"
                          >
                            {postDetails?.User?.username || "Unknown"}
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

                        {Number(contentForPost?.images?.length) > 0 && (
                          <div className="bg-green-400 p-2 w-fit rounded">
                            <Image
                              src={contentForPost?.images?.[0] || ""}
                              height={170}
                              alt="post image"
                              width={250}
                              className=" object-cover"
                            />
                          </div>
                        )}
                      </p>

                      <div className="mt-4 ">
                        <div className="flex justify-between">
                          <div className="flex gap-3 items-center">
                            <span
                              onClick={() =>
                                handleLikeUnlike(postDetails?.id, isLike)
                              }
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

                              {isLike == 1 ? <FcLike /> : <FaRegHeart />}
                            </span>
                            <span className="inline-block relative -left-3 font-light text-gray-400">
                              {postDetails?.likeCount || 0}
                            </span>
                            <span
                              onClick={handleBookMarkOrUnBookMark}
                              className="  p-2  rounded
                                      inline-block
                                      text-gray-500
                                      dark:text-gray-400
                                      hover:bg-gray-400/30 transition-all   duration-200  ease-in-out text-lg cursor-pointer
                                    "
                            >
                              {isBookmarked == 1 ? (
                                <FaBookmark className="text-[#156bf7]" />
                              ) : (
                                <FaRegBookmark />
                              )}
                            </span>
                            <span className="inline-block relative -left-3 font-light text-gray-400"></span>
                            {/* <span
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
                            </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={` ${gif ? "pt-2" : ""}
                    relative rounded-xl sm:mx-5 pb-2 border border-gray-200 dark:border-gray-700 
                    shadow-sm ideasScrollbarHide focus-within:ring-2 focus-within:ring-blue-500/30 transition 
                `}
                  >
                    <div className="flex items-start gap-4 w-full px-4 ">
                      <InputTextArea
                        message={value || ""}
                        setMessage={setValue}
                        image={gif || ""}
                        onRemoveImage={() => setGif("")}
                      />
                    </div>

                    <div className=" flex flex-row pl-7 justify-between items-center">
                      <div></div>
                      <div className="flex items-center justify-end gap-8 mr-7">
                        <div className="right-3 text-xs text-gray-600 dark:text-gray-700">
                          {countWords(value)} / {MAX_WORDS} words
                        </div>
                        <div
                          ref={wrapperRef}
                          className={`relative inline-block ${gif ? "" : "group"} `}
                        >
                          <button
                            disabled={gif || isImageUploadLoader ? true : false}
                            type="button"
                            onClick={() => setShowUploadMenu((prev) => !prev)}
                            className={`text-sm relative font-medium ${gif || isImageUploadLoader ? "text-gray-400 dark:text-gray-700" : "text-gray-500 cursor-pointer  hover:text-[#d2b8fa]"}  
                    `}
                          >
                            {isImageUploadLoader && (
                              <div className="absolute left-3 flex items-center justify-center">
                                <CircularProgress
                                  className="!text-gray-400 dark:!text-white/50"
                                  size={25}
                                />
                              </div>
                            )}
                            UPLOAD
                          </button>
                          <div
                            className={`
                                      absolute -left-8 mt-2 w-32
                                      rounded-xl bg-white dark:bg-[#0F172A]
                                      shadow-xl border border-gray-200 dark:border-gray-700
                                      transition-all duration-200 z-50
                                      ${
                                        showUploadMenu
                                          ? "opacity-100 visible translate-y-0"
                                          : "opacity-0 invisible translate-y-2"
                                      }
                                    `}
                          >
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full border-b border-gray-200 dark:border-gray-600 flex cursor-pointer items-center gap-2 text-left px-4 py-2 text-sm
                                         text-gray-700 dark:text-gray-200
                                         hover:bg-gray-100 dark:hover:bg-gray-800
                                         rounded-t-xl"
                            >
                              <GrCloudUpload className="text-sky-500" /> Image
                            </button>

                            <button
                              onClick={() => setOpen(true)}
                              className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm
                                         text-gray-700 dark:text-gray-200
                                         hover:bg-gray-100 dark:hover:bg-gray-800
                                         rounded-b-xl"
                            >
                              <Gift size={18} className="!text-[#8160EE]" /> GIF
                            </button>
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                          />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/gif,image/png,image/jpeg,image/webp"
                          onChange={handleFileChange}
                        />
                        <button
                          disabled={gif && String(value).trim().length <= 3}
                          onClick={handleSend}
                          className={`
                        py-1.5 px-4 w-16 flex items-center justify-center rounded-md
                        text-sm font-semibold
                        transition-all duration-200
                        ${
                          gif || String(value).trim().length > 3
                            ? `
                              bg-emerald-500
                              text-black
                              hover:bg-emerald-600
                              active:scale-95
                              cursor-pointer
                              shadow-[0_4px_14px_rgba(34,197,94,0.45)]
                            `
                            : `
                              bg-gray-300
                              text-gray-500
                              border border-gray-400 dark:bg-gray-600 dark:border-gray-700
                              cursor-not-allowed
                              shadow-none
                            `
                        }
                      `}
                        >
                          {isSendMessage ? (
                            <CircularProgress
                              size={18}
                              className="!text-white dark:!text-white"
                            />
                          ) : (
                            "Reply"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-0">
                    {" "}
                    <hr className="border-gray-200 dark:border-gray-700" />
                  </div>
                  <div>
                    {isLoader ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                        <CircularProgress className="" />
                      </div>
                    ) : commentList?.length > 0 ? (
                      commentList?.map((row: CommentInterface) => {
                        const commentImages = (() => {
                          if (!row?.metadata) return null;
                          if (typeof row.metadata === "object") {
                            return row.metadata;
                          }
                          try {
                            return JSON.parse(row.metadata);
                          } catch (e) {
                            console.error(
                              "Invalid metadata JSON",
                              row.metadata,
                            );
                            return null;
                          }
                        })();
                        return (
                          <div
                            key={row?.id}
                            className={` w-full border-b border-gray-200 dark:border-gray-700 md:px-4 px-0`}
                          >
                            <div className="md:flex  pt-4  items-start gap-4 ">
                              <div className="flex flex-row items-center gap-2">
                                <div
                                  onClick={() =>
                                    handleUserDetails(row?.User?.id)
                                  }
                                  className="h-11 w-11 cursor-pointer flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-500"
                                >
                                  <Image
                                    src={
                                      row?.User?.image_url ||
                                      "https://cdn.vectorstock.com/i/500p/98/17/gray-man-placeholder-portrait-vector-23519817.jpg"
                                    }
                                    alt="user"
                                    width={30}
                                    height={30}
                                    className="rounded-full h-8 w-8"
                                  />
                                </div>
                                <div className="sm:hidden block">
                                  <div className="flex items-center gap-2">
                                    <h4>
                                      <span className="dark:text-gray-300 cursor-pointer hover:underline font-semibold text-gray-700">
                                        {row?.User?.username || "Unknown"}
                                      </span>{" "}
                                      <span className="text-xs dark:text-gray-500 text-gray-500 ">
                                        {timeAgoCompact(row?.updatedAt)}
                                      </span>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="  hidden sm:block">
                                  <div className="flex items-center gap-2">
                                    <h4>
                                      <span className="dark:text-gray-300 cursor-pointer hover:underline font-semibold text-gray-700">
                                        {row?.User?.username || "Unknown"}
                                      </span>{" "}
                                      <span className="text-xs dark:text-gray-500 text-gray-500 ">
                                        {timeAgoCompact(row?.updatedAt)}
                                      </span>
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-md mt-2 pl-5 sm:pl-0 dark:text-gray-400 text-gray-800">
                                  {row?.content && (
                                    <HighlightTexts text={row?.content} />
                                  )}{" "}
                                </p>
                                {commentImages?.images?.length > 0 && (
                                  <div className="bg-green-400 p-2 mt-2 w-fit rounded shadow">
                                    <Image
                                      src={commentImages?.images?.[0]}
                                      height={250}
                                      alt="post image"
                                      width={350}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="pl-5  overflow-hidden sm:pl-10 sm:py-2 ">
                              <div className="flex text-gray-400 flex-row items-center gap-4">
                                <span className="flex items-center  gap-2">
                                  <span
                                    onClick={() =>
                                      handleCommentLikeUnlike(
                                        row?.id,
                                        row?.isUserLike,
                                      )
                                    }
                                    className="p-2  rounded
                                      inline-block
                                      text-gray-500
                                      dark:text-gray-400
                                      hover:bg-gray-400/30 transition-all   duration-200  ease-in-out text-lg cursor-pointer"
                                  >
                                    {row?.isUserLike == 1 ? (
                                      <FcLike />
                                    ) : (
                                      <Heart size={18} />
                                    )}{" "}
                                  </span>
                                  {row?.likeCount || 0}
                                </span>
                                <div
                                  className="text-gray-400 hover:text-gray-200 text-sm cursor-pointer"
                                  // onClick={() => handleSubComment(row, null)}
                                  onClick={() =>
                                    handleOpenSubComment(row, row?.id)
                                  }
                                >
                                  Reply
                                </div>
                              </div>

                              <div className="pb-2">
                                {row?.replies?.length > 0 &&
                                  row?.replies?.map((replies: IReply) => {
                                    const repliesImages = (() => {
                                      if (!replies?.metadata) return null;
                                      if (
                                        typeof replies.metadata === "object"
                                      ) {
                                        return replies.metadata;
                                      }
                                      try {
                                        return JSON.parse(replies.metadata);
                                      } catch (e) {
                                        console.error(
                                          "Invalid metadata JSON",
                                          replies.metadata,
                                        );
                                        return null;
                                      }
                                    })();
                                    return (
                                      <div key={replies?.id}>
                                        <div className="md:flex border-t mt-4 border-gray-200 dark:border-gray-700 pt-2  items-start gap-4 ">
                                          <div className="flex flex-row items-center gap-2">
                                            <div
                                              onClick={() =>
                                                handleUserDetails(row?.User?.id)
                                              }
                                              className="h-11 w-11 cursor-pointer flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-500"
                                            >
                                              <Image
                                                src={
                                                  replies?.User?.image_url ||
                                                  "https://cdn.vectorstock.com/i/500p/98/17/gray-man-placeholder-portrait-vector-23519817.jpg"
                                                }
                                                alt="user"
                                                width={30}
                                                height={30}
                                                className="rounded-full h-8 w-8"
                                              />
                                            </div>
                                            <div className="sm:hidden block">
                                              <div className="flex items-center gap-2">
                                                <h4>
                                                  <span className="dark:text-gray-300 cursor-pointer hover:underline font-semibold text-gray-700">
                                                    {replies?.User?.username ||
                                                      "Unknown"}
                                                  </span>{" "}
                                                  <span className="text-xs dark:text-gray-500 text-gray-500 ">
                                                    {timeAgoCompact(
                                                      replies?.updatedAt,
                                                    )}
                                                  </span>
                                                </h4>
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="  hidden sm:block">
                                              <div className="flex items-center gap-2">
                                                <h4>
                                                  <span
                                                    onClick={() =>
                                                      handleUserDetails(
                                                        replies?.User?.id,
                                                      )
                                                    }
                                                    className="dark:text-gray-300 cursor-pointer hover:underline font-semibold text-gray-700"
                                                  >
                                                    {replies?.User?.username ||
                                                      "Unknown"}
                                                  </span>{" "}
                                                  <span className="text-xs dark:text-gray-500 text-gray-500 ">
                                                    {timeAgoCompact(
                                                      replies?.updatedAt,
                                                    )}
                                                  </span>
                                                </h4>
                                              </div>
                                            </div>
                                            <p className="text-md mt-2 dark:text-gray-400 text-gray-800">
                                              {replies?.content && (
                                                <HighlightTexts
                                                  text={replies?.content}
                                                />
                                              )}{" "}
                                            </p>
                                            {repliesImages?.images?.length >
                                              0 && (
                                              <div className="bg-green-400 p-2 mt-2 w-fit rounded shadow">
                                                <Image
                                                  src={
                                                    repliesImages?.images?.[0]
                                                  }
                                                  height={250}
                                                  alt="post image"
                                                  width={350}
                                                />
                                              </div>
                                            )}
                                            <div className=" pt-2 sm:py-2">
                                              <div className="flex text-gray-400 flex-row items-center gap-4">
                                                <span className="flex items-center gap-2">
                                                  {replies?.isUserLike == 1 ? (
                                                    <FcLike
                                                      onClick={() =>
                                                        handleCommentLikeUnlike(
                                                          replies?.id,
                                                          replies?.isUserLike,
                                                        )
                                                      }
                                                    />
                                                  ) : (
                                                    <Heart
                                                      onClick={() =>
                                                        handleCommentLikeUnlike(
                                                          replies?.id,
                                                          replies?.isUserLike,
                                                        )
                                                      }
                                                      size={18}
                                                    />
                                                  )}{" "}
                                                  {replies?.likeCount || 0}
                                                </span>
                                                <div
                                                  className="text-gray-400 hover:text-gray-200 text-sm cursor-pointer"
                                                  // onClick={() =>
                                                  //   handleSubComment(
                                                  //     row,
                                                  //     replies,
                                                  //   )
                                                  // }
                                                  onClick={() =>
                                                    handleOpenSubComment(
                                                      replies,
                                                      row?.id,
                                                    )
                                                  }
                                                >
                                                  Reply
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
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
                          Be the first to share your thoughts and start the
                          conversation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <GiphyModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(gifImage) => {
          setShowUploadMenu(false);
          setGif(gifImage);
        }}
      />
      <SubComment
        open={commentOpen}
        onClose={handleCloseComment}
        row={rowDetails}
        handleSend={handleSubmitForSubComment}
        isLoader={isSendMessageLoader}
        mixText={mixText}
        setMixText={setMixText}
        gif={imageGif}
        setGif={setImageGif}
      />
    </div>
  );
}

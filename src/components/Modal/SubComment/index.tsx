import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, IconButton, CircularProgress } from "@mui/material";
import Image from "next/image";
import { IoArrowBack, IoClose } from "react-icons/io5";
import { countWords, delay, MAX_WORDS, timeAgoCompact } from "@/utils/Content";
import { PROFESSIONAL_EMOJIS } from "@/components/content";
import { GrCloudUpload } from "react-icons/gr";
import { Gift } from "lucide-react";
import { imageUpload } from "@/components/service/apiService/user";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import GiphyModal from "@/components/Pages/detail/component/postList/GiphyModal";

export default function SubComment({
  open,
  onClose,
  row,
  handleSend,
  isLoader,
  mixText,
  setMixText,
  gif,
  setGif,
}) {
  const textareaRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const popupRef = useRef(null);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const [openEmoji, setOpenEmoji] = useState(false);

  const [imageLoading, setImageLoading] = useState(true);
  const [isImageUploadLoader, setIsImageUploadLoader] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);

  // Auto textarea resize
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 80) + "px";
  };

  // Toggle emoji
  const toggleEmoji = (e) => {
    e.stopPropagation();
    if (!emojiBtnRef.current) return;
    setOpenEmoji((prev) => !prev);
  };

  // Insert emoji
  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const text = mixText.substring(0, start) + emoji + mixText.substring(end);

    setMixText(text);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  };

  // Close emoji on outside click
  useEffect(() => {
    if (!openEmoji) return;

    const handleOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(e.target)
      ) {
        setOpenEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [openEmoji]);

  // Close upload menu on outside click
  useEffect(() => {
    if (!showUploadMenu) return;

    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowUploadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [showUploadMenu]);

  // Image upload
  const chooseImages = async (file) => {
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
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsImageUploadLoader(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    chooseImages(file);
  };
  // const commentDetails = open && JSON.parse(row?.metadata || "{}");
  const commentDetails = (() => {
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
  const handleClose = () => {
    setIsGifOpen(false);
    setShowUploadMenu(false);
    setOpenEmoji(false);
    onClose();
  };

  const handleSubmit = () => {
    handleSend(row, mixText, gif);
  };

  console.log(mixText?.length, "rowlskdfjslf");

  return (
    <Modal
      className="m-2"
      BackdropProps={{
        timeout: 500, // ✅ backdrop open/close duration
        sx: {
          backdropFilter: "blur(10px)",
          backgroundColor:
            theme === "dark"
              ? "rgba(15, 23, 42, 0.7)"
              : "rgba(255, 255, 255, 0.7)",
        },
      }}
      open={open}
      onClose={handleClose}
    >
      <Box
        className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-full max-w-lg
          rounded-2xl
          bg-white dark:bg-[#0F172A]
          shadow-2xl
          p-4
          outline-none
        "
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <IconButton onClick={handleClose}>
            <IoArrowBack className="text-gray-700 dark:text-gray-200 text-xl" />
          </IconButton>
        </div>

        {/* Comment */}
        <div className="flex gap-3 mb-4">
          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-200 p-1 dark:bg-gray-600 flex-shrink-0">
            <Image
              src={row?.User?.image_url || "/img/user.png"}
              alt="user"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {row?.User?.username || "--"}{" "}
              <span className="text-gray-400 text-xs font-normal">
                {timeAgoCompact(row?.createdAt)}
              </span>
            </p>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {row?.content || "--"}
            </p>
            {commentDetails?.images?.length > 0 && (
              <div className="bg-green-100 mt-1.5 p-2 w-fit rounded shadow">
                <Image
                  src={commentDetails?.images?.[0]}
                  height={150}
                  alt="post image"
                  width={150}
                />
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Replying to{" "}
              <span className="text-teal-500">
                {row?.User?.username || "--"}
              </span>
            </p>
          </div>
        </div>

        {/* Reply textarea */}
        <div className="text-gray-800 rounded-lg px-2 border-t border-gray-200 dark:border-gray-800 dark:text-gray-100 text-sm mb-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={mixText}
            onChange={(e) => {
              const value = e.target.value;
              if (countWords(value) <= MAX_WORDS) {
                setMixText(value);
              }
            }}
            placeholder="Enter the reply..."
            className="w-full resize-none bg-transparent outline-none text-[15px] text-gray-600 dark:text-gray-100 placeholder-gray-400 leading-5 max-h-[80px] overflow-y-auto pt-1"
            onInput={handleInput}
          />

          {gif && (
            <div className="relative w-fit mt-2 mb-4">
              {/* Loader */}
              {imageLoading && (
                <div
                  className="
          absolute inset-0 z-10
          flex items-center justify-center
          rounded-xl
          bg-black/30
        "
                >
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Image */}
              <Image
                src={gif}
                alt="gif"
                width={220}
                height={220}
                className={`rounded-xl w-56 transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setImageLoading(false)}
              />

              {/* Remove Button */}
              <button
                onClick={() => {
                  setGif(null);
                  setImageLoading(true);
                }}
                className="
        absolute cursor-pointer top-1 right-1 z-20
        bg-black/70 text-white
        rounded-full w-6 h-6
        flex items-center justify-center text-xs
      "
              >
                <IoClose />
              </button>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            {/* Upload dropdown */}
            <div ref={wrapperRef} className="relative">
              <button
                disabled={gif || isImageUploadLoader}
                onClick={() => setShowUploadMenu((p) => !p)}
                className={`text-sm relative font-medium ${gif || isImageUploadLoader ? "text-gray-400 dark:text-gray-700" : "text-gray-500 cursor-pointer hover:text-[#d2b8fa]"}`}
              >
                {isImageUploadLoader ? (
                  <CircularProgress size={18} />
                ) : (
                  "UPLOAD"
                )}
              </button>

              <div
                ref={dropdownRef}
                className={`absolute mt-2 w-32 rounded-xl bg-white dark:bg-[#0F172A] shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 z-50 ${
                  showUploadMenu ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowUploadMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <GrCloudUpload /> Image
                </button>

                <button
                  onClick={() => {
                    setIsGifOpen(true);
                    setShowUploadMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Gift size={18} /> GIF
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Emoji */}
            <div className="relative">
              <button
                ref={emojiBtnRef}
                onClick={toggleEmoji}
                className="text-lg px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                🙂
              </button>

              {openEmoji && (
                <div
                  ref={popupRef}
                  className="absolute right-0 bottom-12 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-3 flex flex-wrap gap-2 z-50"
                >
                  {PROFESSIONAL_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {countWords(mixText)} / {MAX_WORDS} words
            </span>
            <button
              // disabled={mixText?.length > 3}
              onClick={handleSubmit}
              className="px-4 py-2 cursor-pointer rounded-lg bg-black text-white text-sm font-medium dark:bg-white dark:text-black"
            >
              {isLoader ? (
                <div className="w-9">
                  <CircularProgress
                    size={15}
                    className="!text-white dark:!text-gray-600 "
                  />
                </div>
              ) : (
                "Reply"
              )}
            </button>
          </div>
        </div>
        {/* isLoader */}
        <GiphyModal
          open={isGifOpen}
          onClose={() => setIsGifOpen(false)}
          onSelect={setGif}
        />
      </Box>
    </Modal>
  );
}

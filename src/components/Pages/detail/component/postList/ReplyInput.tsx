"use client";

import React, { useEffect, useRef, useState } from "react";
import { PROFESSIONAL_EMOJIS } from "@/components/content";
import Image from "next/image";

export function ReplyInput({
  rows,
  replyText,
  setReplyText,
  handleComment,
  insertEmoji,
  textareaRef,
  handleKeyDown,
  userDetails,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");

  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Toggle emoji picker with smart position
  const toggleEmoji = (e: React.MouseEvent) => {
    e.stopPropagation(); // ❗ very important

    if (!emojiBtnRef.current) return;

    const rect = emojiBtnRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // emoji picker approx height ~280px
    if (spaceAbove < 300 && spaceBelow > spaceAbove) {
      setPosition("bottom");
    } else {
      setPosition("top");
    }

    setOpen(!open);
  };

  // 🔹 Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="mt-2 relative w-full flex items-center gap-3 bg-white dark:bg-[#1D293D] border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-sky-500/40">
      {/* Avatar */}

      {userDetails?.imageUrl ? (
        <div className="bg-gray-100 dark:bg-gray-600 rounded-full p-1">
          <Image
            src={userDetails?.imageUrl}
            alt="user"
            height={30}
            width={30}
            className="rounded-full h-6 w-6"
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400 flex-shrink-0" />
      )}

      {/* Input */}
      <input
        ref={textareaRef}
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={`Reply to ${rows?.User?.username || "--"}`}
        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 text-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
        onKeyDown={(e) => handleKeyDown(e, rows)}
      />

      {/* Emoji Button */}
      <button
        ref={emojiBtnRef}
        type="button"
        onClick={toggleEmoji}
        className="
          flex items-center gap-1
          text-gray-500 hover:text-gray-800
          dark:text-gray-400 dark:hover:text-white
          text-lg px-2 py-1 rounded-md
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
        "
      >
        🙂
      </button>

      {/* Reply Button */}
      <button
        disabled={replyText.trim().length < 2}
        className={`text-sm font-medium transition ${
          replyText.trim().length >= 2
            ? "text-sky-400 hover:text-sky-300 cursor-pointer"
            : "text-gray-500 cursor-not-allowed"
        }`}
        onClick={() => handleComment(rows)}
      >
        Reply
      </button>

      {/* Emoji Picker Popup */}
      {open && (
        <div
          ref={popupRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`
            absolute right-0
            ${position === "top" ? "bottom-[110%]" : "top-[110%]"}
            w-72
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-xl
            rounded-lg
            p-3
            flex flex-wrap gap-2
            !z-50
            transition-all duration-200
          `}
        >
          {PROFESSIONAL_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                insertEmoji(emoji);
                setOpen(false);
              }}
              className="text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReplySubCommentInput({
  PostId,
  rows,
  replyText,
  setReplyText,
  handleComment,
  insertEmoji,
  textareaRef,
  handleKeyDown,
  userDetails,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");

  const emojiBtnRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Toggle emoji picker with smart position
  const toggleEmoji = (e: React.MouseEvent) => {
    e.stopPropagation(); // ❗ very important

    if (!emojiBtnRef.current) return;

    const rect = emojiBtnRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    // emoji picker approx height ~280px
    if (spaceAbove < 300 && spaceBelow > spaceAbove) {
      setPosition("bottom");
    } else {
      setPosition("top");
    }

    setOpen(!open);
  };

  // 🔹 Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="mt-2 relative w-full flex items-center gap-3 bg-white dark:bg-[#1D293D] border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-sky-500/40">
      {/* Avatar */}
      {userDetails?.imageUrl ? (
        <div className="bg-gray-100 dark:bg-gray-600 rounded-full p-1">
          <Image
            src={userDetails?.imageUrl}
            alt="user"
            height={30}
            width={30}
            className="rounded-full h-6 w-6"
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400 flex-shrink-0" />
      )}

      {/* Input */}
      <input
        ref={textareaRef}
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={`Reply to ${rows?.User?.username || "--"}`}
        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 text-gray-700 dark:text-gray-200 dark:placeholder-gray-500"
        onKeyDown={(e) => handleKeyDown(e, PostId, rows)}
      />

      {/* Emoji Button */}
      <button
        ref={emojiBtnRef}
        type="button"
        onClick={toggleEmoji}
        className="
          flex items-center gap-1
          text-gray-500 hover:text-gray-800
          dark:text-gray-400 dark:hover:text-white
          text-lg px-2 py-1 rounded-md
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition
        "
      >
        🙂
      </button>

      {/* Reply Button */}
      <button
        // disabled={replyText.trim().length < 2}
        className={`text-sm font-medium transition ${
          replyText.trim().length >= 2
            ? "text-sky-400 hover:text-sky-300 cursor-pointer"
            : "text-gray-500 cursor-not-allowed"
        }`}
        onClick={() => handleComment(PostId, rows)}
      >
        Reply
      </button>

      {/* Emoji Picker Popup */}
      {open && (
        <div
          ref={popupRef}
          onMouseDown={(e) => e.stopPropagation()}
          className={`
            absolute right-0
            ${position === "top" ? "bottom-[110%]" : "top-[110%]"}
            w-72
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            shadow-xl
            rounded-lg
            p-3
            flex flex-wrap gap-2
            !z-50
            transition-all duration-200
          `}
        >
          {PROFESSIONAL_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                insertEmoji(emoji);
                setOpen(false);
              }}
              className="text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

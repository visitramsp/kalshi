import React, { useMemo, useRef } from "react";

type Props = {
  message: string;
  setMessage: (v: string) => void;
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightText(text: string) {
  const escaped = escapeHtml(text);

  const withBreaks = escaped
    .replace(/\n/g, "<br/>")
    .replace(/ {2}/g, " &nbsp;");

  const mentionRegex = /(^|[\s(>])(@[a-zA-Z0-9_.]{1,30})/g;
  const hashRegex = /(^|[\s(>])(#[_a-zA-Z0-9]{1,50})/g;
  const urlRegex = /(^|[\s(>])((https?:\/\/|www\.)[^\s<]+[^<.,:;"')\]\s])/gi;

  return (
    withBreaks
      // URLs first (important) convert and highlight
      .replace(
        urlRegex,
        `$1<span class="text-blue-500 text-sm dark:text-blue-400 underline font-medium">$2</span>`
      )
      // @mentions convert for mention user to highlight
      .replace(
        mentionRegex,
        `$1<span class="text-emerald-500 text-sm dark:text-emerald-400 font-medium">$2</span>`
      )
      // #hashtags highlight
      .replace(
        hashRegex,
        `$1<span class="text-sky-500 text-sm dark:text-sky-400 font-medium">$2</span>`
      )
  );
}

export default function InputTextArea({ message, setMessage }: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const highlightedHtml = useMemo(() => {
    const t = message ?? "";
    return highlightText(t.length ? t : "\u200b");
  }, [message]);

  const syncScroll = () => {
    if (!taRef.current || !overlayRef.current) return;
    overlayRef.current.scrollTop = taRef.current.scrollTop;
    overlayRef.current.scrollLeft = taRef.current.scrollLeft;
  };

  console.log(message, "message");

  return (
    <div className="relative  w-full">
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="
          absolute inset-0
          pt-4
          text-sm
          leading-relaxed
          whitespace-pre-wrap
          break-words
          overflow-auto
          pointer-events-none
          text-gray-900 dark:text-gray-400
        "
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      <textarea
        ref={taRef}
        rows={4}
        value={message || ""}
        onChange={(e) => setMessage(e.target.value)}
        onScroll={syncScroll}
        placeholder="What is your prediction?"
        className="
          relative
          pt-4
          flex-1
          w-full
          min-h-[80px]
          text-sm
          leading-relaxed
          bg-transparent
          resize-none
          !outline-none
          focus:outline-none
          focus:ring-0
          text-transparent
          caret-gray-900 dark:caret-gray-200
          placeholder:text-gray-400
          overflow-auto
        "
      />
    </div>
  );
}

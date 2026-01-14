import { AxiosError } from "axios";
import { ChartSeries, RawSeries } from "./typesInterface";

// export const prepareSeries = (data: RawSeries[] | undefined): ChartSeries[] => {
//   if (!data || data.length === 0) return [];

//   const maxLength = Math.max(...data.map((item) => item.data.length));

//   if (maxLength === 0) return [];

//   return data.map((item) => {
//     const originalData = item.data;

//     const lastPoint = originalData[originalData.length - 1];
//     const lastPrice = lastPoint?.price ?? 0;
//     const lastTimestamp = lastPoint?.timestamp ?? 0;

//     const extendedData = [...originalData];

//     if (originalData.length < maxLength) {
//       const missing = maxLength - originalData.length;

//       for (let i = 0; i < missing; i++) {
//         extendedData.push({
//           price: lastPrice,
//           timestamp: lastTimestamp,
//         });
//       }
//     }

//     return {
//       name: item.optionName,
//       data: extendedData.map((d) => ({
//         x: d.timestamp,
//         y: Number(d.price.toFixed(2)),
//       })),
//     };
//   });
// };

export const prepareSeries = (data: RawSeries[] | undefined): ChartSeries[] => {
  if (!data || data.length === 0) return [];

  // 1️⃣ Collect ALL unique timestamps
  const allTimestamps = Array.from(
    new Set(data.flatMap((item) => item.data.map((d) => d.timestamp)))
  ).sort((a, b) => a - b);

  // 2️⃣ Normalize each series
  return data.map((item) => {
    const priceMap = new Map<number, number>();

    item.data.forEach((d) => {
      priceMap.set(d.timestamp, d.price);
    });

    let lastPrice = item.data[0]?.price ?? 0;

    const normalizedData = allTimestamps.map((timestamp) => {
      if (priceMap.has(timestamp)) {
        lastPrice = priceMap.get(timestamp)!;
      }
      return {
        x: timestamp,
        y: Number(lastPrice.toFixed(2)),
      };
    });

    return {
      name: item.optionName,
      data: normalizedData,
    };
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.errors?.length > 0) {
      return (
        (error.response?.data?.errors?.[0] as { message?: string })?.message ??
        "Request failed"
      );
    } else {
      return (
        (error.response?.data as { message?: string })?.message ??
        "Request failed"
      );
    }
  }
  return "Unexpected error";
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function timeAgoCompact(iso: string, now: Date = new Date()): string {
  const past = new Date(iso);
  if (isNaN(past.getTime())) return "";

  let diffMs = now.getTime() - past.getTime();

  // If future time, treat as 0s (or you can show "0s")
  if (diffMs < 0) diffMs = 0;

  const totalSec = Math.floor(diffMs / 1000);

  // seconds
  if (totalSec < 60) return `${totalSec}s`;

  const totalMin = Math.floor(totalSec / 60);

  // minutes
  if (totalMin < 60) return `${totalMin}m`;

  const totalHr = Math.floor(totalMin / 60);

  // hours:minutes
  if (totalHr < 24) {
    const remMin = totalMin % 60;
    return `${totalHr}h:${remMin}m`;
  }

  // days
  const days = Math.floor(totalHr / 24);
  return `${days}day`;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function HighlightTexts({ text }: { text: string }) {
  if (!text) return null;

  const escaped = escapeHtml(text);

  const withBreaks = escaped
    .replace(/\n/g, "<br/>")
    .replace(/ {2}/g, " &nbsp;");

  const mentionRegex = /(^|[\s(>])(@[a-zA-Z0-9_.]{1,30})/g;
  const hashRegex = /(^|[\s(>])(#[_a-zA-Z0-9]{1,50})/g;
  const urlRegex = /(^|[\s(>])((https?:\/\/|www\.)[^\s<]+[^<.,:;"')\]\s])/gi;

  const highlightedHtml = withBreaks
    .replace(
      urlRegex,
      `$1<span class="text-blue-500 text-sm dark:text-blue-400 underline font-medium">$2</span>`
    )
    .replace(
      mentionRegex,
      `$1<span class="text-emerald-500 dark:text-emerald-400 font-medium">$2</span>`
    )
    .replace(
      hashRegex,
      `$1<span class="text-sky-500 dark:text-sky-400 font-medium">$2</span>`
    );

  return (
    <span
      className="text-[15px] leading-relaxed whitespace-pre-wrap break-words"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}

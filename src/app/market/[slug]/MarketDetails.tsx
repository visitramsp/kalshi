"use client";

import Details from "@/components/Pages/detail/page";

export default function MarketDetails({ targetId }: { targetId: string }) {
  return <Details marketId={targetId} />;
}

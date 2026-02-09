import { Suspense } from "react";
import MarketDetails from "./MarketDetails";
import MarketSkeleton from "@/components/common/CartDetailLoader";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div>
          <MarketSkeleton />
        </div>
      }
    >
      <MarketDetails targetId={slug} />
    </Suspense>
  );
}

import { Suspense } from "react";
import IdeasDetails from "./IdeasDetails";
import GlobalLoader from "@/components/common/Loader";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <Suspense fallback={<GlobalLoader />}>
      <IdeasDetails targetId={slug} />
    </Suspense>
  );
}

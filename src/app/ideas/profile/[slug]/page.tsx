import { Suspense } from "react";
import ProfileClient from "./ProfileClient";
import GlobalLoader from "@/components/common/Loader";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <ProfileClient targetId={params.slug} />
    </Suspense>
  );
}

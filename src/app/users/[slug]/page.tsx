import { Suspense } from "react";
import UsersClient from "./UsersClient";
import GlobalLoader from "@/components/common/Loader";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <UsersClient targetId={params.slug} />
    </Suspense>
  );
}

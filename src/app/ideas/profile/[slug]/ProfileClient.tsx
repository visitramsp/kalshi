"use client";

import Profile from "@/components/Pages/ideas/component/profile/page";

export default function ProfileClient({ targetId }: { targetId: string }) {
  return <Profile targetId={targetId} />;
}

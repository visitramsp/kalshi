"use client";

import Users from "@/components/Pages/users/page";

export default function UsersClient({ targetId }: { targetId: string }) {
  return <Users targetId={targetId} />;
}

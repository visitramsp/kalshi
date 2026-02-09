"use client";
import React, { useMemo } from "react";

export default function UserPosts() {
  // const [activeTab, setActiveTab] = useState("Comments");
  const eventTabs = useMemo(
    () => [
      {
        key: "comments",
        label: "Comments",
      },
      { key: "holders", label: "Top Holders" },
      { key: "activity", label: "Activity" },
    ],
    [],
  );
  return (
    <div className="mt-3 flex bg-amber-500 items-center justify-between border-b border-border">
      <ul className="relative flex h-8 gap-8 text-sm font-semibold">
        {eventTabs.map((tab) => (
          <li
            key={tab.key}
            // className={`${(
            //   "cursor-pointer transition-colors duration-200",
            //   activeTab === tab.key
            //     ? "text-foreground"
            //     : "text-muted-foreground hover:text-foreground",
            // )}`}
            // onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </li>
        ))}
        sdfljslkdfjl
        {/* <div
          className={cn(
            "absolute bottom-0 h-0.5 bg-primary",
            isInitialized && "transition-all duration-300 ease-out",
          )}
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        /> */}
      </ul>
    </div>
  );
}

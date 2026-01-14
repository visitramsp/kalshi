"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaCommentAlt,
  FaBookmark,
  FaUser,
  FaUsers,
  FaHeadset,
  FaQuestionCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

type TabName =
  | "Home"
  | "Replies"
  | "Bookmarks"
  | "Profile"
  | "Community Guidelines"
  | "Support"
  | "FAQs";

interface MobileMenuProps {
  currentTabs: string;
  handleTabs: (tab: TabName) => void;
}

export default function MobileMenu({
  currentTabs,
  handleTabs,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleMenuClick = (tab: TabName) => {
    handleTabs(tab);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        aria-label="Toggle Menu"
        className="md:hidden text-white text-xl"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>
      <ul
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] p-5 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-auto md:bg-transparent`}
      >
        <li className="md:hidden mb-6 flex justify-end">
          <button
            aria-label="Close Menu"
            onClick={() => setOpen(false)}
            className="text-white text-xl"
          >
            <FaTimes />
          </button>
        </li>

        <MenuItem
          label="Home"
          icon={<FaHome />}
          active={currentTabs === "Home"}
          onClick={() => handleMenuClick("Home")}
        />

        <MenuItem
          label="Replies"
          icon={<FaCommentAlt />}
          active={currentTabs === "Replies"}
          onClick={() => handleMenuClick("Replies")}
        />

        <MenuItem
          label="Bookmarks"
          icon={<FaBookmark />}
          active={currentTabs === "Bookmarks"}
          onClick={() => handleMenuClick("Bookmarks")}
        />

        <MenuItem
          label="Profile"
          icon={<FaUser />}
          active={currentTabs === "Profile"}
          onClick={() => handleMenuClick("Profile")}
        />

        <MenuItem
          label="Community Guidelines"
          icon={<FaUsers />}
          active={currentTabs === "Community Guidelines"}
          onClick={() => handleMenuClick("Community Guidelines")}
        />

        <MenuItem
          label="Support"
          icon={<FaHeadset />}
          active={currentTabs === "Support"}
          onClick={() => handleMenuClick("Support")}
        />

        <MenuItem
          label="FAQs"
          icon={<FaQuestionCircle />}
          active={currentTabs === "FAQs"}
          onClick={() => handleMenuClick("FAQs")}
        />

        {/* CTA Button */}
        <li className="mt-6">
          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="block text-center bg-[#c8aa76] hover:bg-[#c8aa76]/80
            py-2 px-4 text-black rounded font-semibold"
          >
            Post
          </Link>
        </li>
      </ul>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function MenuItem({ icon, label, active, onClick }: MenuItemProps) {
  return (
    <li onClick={onClick} className="my-4 cursor-pointer text-sm select-none">
      <span
        className={`flex items-center gap-3 transition-colors
        ${active ? "text-[#c8aa76]" : "text-gray-400 hover:text-[#c8aa76]"}`}
      >
        <span className="text-base">{icon}</span>
        {label}
      </span>
    </li>
  );
}

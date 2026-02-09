import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function SportsMenu({
  eventSubCategoryId,
  setEventSubCategoryId,
}: {
  eventSubCategoryId: number | null;
  setEventSubCategoryId: (id: number | null) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const eventCategoryList = useSelector(
    (state: any) => state?.category?.subCategory,
  );

  const toggle = (id: number) => {
    setOpen(open === id ? null : id);
  };

  const handleSubClick = (subId: number) => {
    setEventSubCategoryId(subId);
    // 👉 navigate / dispatch / filter logic here
  };

  return (
    <ul className="my-6 mt-0 space-y-4 text-sm">
      {/* ALL */}
      <li>
        <li>
          <div
            onClick={() => {
              setEventSubCategoryId(null);
            }}
            className={` ${
              eventSubCategoryId == null
                ? "text-black dark:text-[#c7ac77]"
                : "dark:text-gray-300 text-[#5e5e5f] hover:text-[#c7ac77]  cursor-pointer"
            } font-semibold flex items-center`}
          >
            <span>
              <FaArrowTrendUp className="mr-1" />
            </span>
            All
          </div>
        </li>
      </li>

      {eventCategoryList?.map(
        (row: any) =>
          row?.event_section?.length > 0 && (
            <li key={row.id}>
              {/* CATEGORY */}
              <button
                onClick={() => toggle(row.id)}
                className="w-full flex justify-between items-center dark:text-gray-400 text-gray-700 hover:text-[#ba9c68]"
              >
                <span>{row.name}</span>
                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    open === row.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* SUB CATEGORY */}
              {open === row.id && (
                <ul className="mt-2 ml-4 space-y-3">
                  {row?.event_section?.map((item: any) => (
                    <li
                      key={item.id}
                      onClick={() => handleSubClick(item.id)}
                      className={`dark:text-gray-300  ${eventSubCategoryId == item?.id ? "dark:text-[#ba9c68] text-black/80 font-bold" : "text-gray-700"} hover:text-[#ba9c68] text-sm cursor-pointer`}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ),
      )}
    </ul>
  );
}

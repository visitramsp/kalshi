"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, IconButton } from "@mui/material";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IoClose } from "react-icons/io5";

const gf = new GiphyFetch("6yXO79zQVXhs6Qfk4x8hdUIugnQujLni");

export default function GiphyModal({ open, onClose, onSelect }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(input.trim());
    }, 400);

    return () => clearTimeout(t);
  }, [input]);
  useEffect(() => {
    if (!open) {
      setInput("");
      setQuery("");
    }
  }, [open]);

  const fetchGifs = useCallback(
    (offset: number) => {
      if (query) {
        return gf.search(query, {
          offset,
          limit: 6,
        });
      }
      return gf.trending({
        offset,
        limit: 6,
      });
    },
    [query],
  );

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#0F172A] w-[420px] h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="h-[60px] px-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search GIFs"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="
                flex-1 h-[40px] px-4 text-sm rounded-full
                bg-gray-100 dark:bg-gray-800
                border border-transparent
                focus:border-indigo-500
                focus:ring-2 focus:ring-indigo-500/40
                box-border transition-none
              "
            />
            <IconButton size="small" onClick={onClose}>
              <IoClose />
            </IconButton>
          </div>
          <div className="flex-1 p-3 overflow-y-scroll hideScrollbar">
            <Grid
              key={query || "trending"}
              width={400}
              columns={2}
              gutter={6}
              fetchGifs={fetchGifs}
              noLink
              hideAttribution
              onGifClick={(gif, e) => {
                e.preventDefault();
                const preview = gif.images.fixed_width_small_still.url;

                onSelect(preview);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

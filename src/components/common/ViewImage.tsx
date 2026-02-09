import { isGifImage } from "@/utils/Content";
import Image from "next/image";
import React from "react";

export default function ViewImage({ imageUrl }) {
  if (!imageUrl) return null;

  const isGif = isGifImage(imageUrl);

  return (
    <div className="mt-2">
      {isGif ? (
        // ✅ GIF → exact original animation
        <img
          src={imageUrl}
          alt="post media"
          loading="lazy"
          className="max-w-40 h-auto rounded-lg"
        />
      ) : (
        // ✅ Normal image → optimized
        <Image
          src={imageUrl}
          alt="post media"
          width={300}
          height={300}
          className="max-w-40 h-auto rounded-lg object-contain"
        />
      )}
    </div>
  );
}

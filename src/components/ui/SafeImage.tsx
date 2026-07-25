import { useState, type ImgHTMLAttributes } from "react";
import fallback from "@/assets/image-fallback.jpg";

export const FALLBACK_IMAGE_URL = fallback;

/**
 * <img> replacement that swaps to a branded placeholder when the source
 * fails to load (network error, 404 from CMS, empty URL, etc.).
 */
export function SafeImage({
  src,
  onError,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const initial = src && String(src).trim() ? src : fallback;
  const [current, setCurrent] = useState<string | undefined>(
    typeof initial === "string" ? initial : fallback,
  );
  return (
    <img
      {...rest}
      src={current}
      onError={(e) => {
        if (current !== fallback) setCurrent(fallback);
        onError?.(e);
      }}
    />
  );
}
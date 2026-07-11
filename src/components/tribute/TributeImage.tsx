import type { ImageSlot } from "@/src/data/tributeData";
import type { CSSProperties } from "react";

declare global {
  interface Window {
    __TRIBUTE_ASSET_BASE__?: string;
  }
}

type TributeImageProps = {
  slot: ImageSlot;
  className?: string;
  priority?: boolean;
};

function resolveImageSrc(src: string) {
  if (/^(?:https?:|data:|blob:)/.test(src) || !src.startsWith("/")) {
    return src;
  }

  const assetBase =
    typeof window !== "undefined" ? window.__TRIBUTE_ASSET_BASE__ || "" : "";

  if (!assetBase || assetBase === "/") {
    return src;
  }

  return `${assetBase.replace(/\/$/, "")}${src}`;
}

export function TributeImage({
  slot,
  className = "",
  priority = false,
}: TributeImageProps) {
  const style = {
    "--image-ratio": slot.ratio || "16 / 10",
    "--image-position": slot.position || "50% 50%",
  } as CSSProperties;

  return (
    <figure className={`tribute-image ${className}`} style={style}>
      {slot.src ? (
        <img
          src={resolveImageSrc(slot.src)}
          alt={slot.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className="tribute-image__placeholder" aria-label={slot.alt}>
          <span>{slot.placeholder}</span>
        </div>
      )}
    </figure>
  );
}

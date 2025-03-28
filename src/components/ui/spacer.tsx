import React from "react";
import { cn } from "@/lib/utils";

type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type SpacerDirection = "horizontal" | "vertical";

interface SpacerProps {
  size?: SpacerSize;
  direction?: SpacerDirection;
  className?: string;
}

const sizeMap = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
};

export function Spacer({
  size = "md",
  direction = "vertical",
  className,
}: SpacerProps) {
  const style = {
    width: direction === "horizontal" ? sizeMap[size] : "100%",
    height: direction === "vertical" ? sizeMap[size] : "100%",
  };

  return (
    <div
      className={cn("flex-shrink-0", className)}
      style={style}
      aria-hidden="true"
      data-spacer-size={size}
      data-spacer-direction={direction}
    />
  );
}

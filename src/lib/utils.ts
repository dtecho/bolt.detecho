import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and applies Tailwind's merge strategy
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

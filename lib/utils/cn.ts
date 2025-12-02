import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with proper override handling
 * Uses clsx for conditional classes and twMerge to resolve conflicts
 * 
 * @example
 * cn("text-red-500", condition && "bg-blue-500", "text-green-500")
 * // Result: "bg-blue-500 text-green-500" (text-green overrides text-red)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

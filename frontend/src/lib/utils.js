import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToTimeZone (isoString) {
  const dateObj = new Date(isoString);

  return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta"
  }).format(dateObj).replace(/\//g, '-'); // Replace "/" with "-" for consistency
};


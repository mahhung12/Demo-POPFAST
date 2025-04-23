import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname + parsedUrl.pathname
  } catch {
    return url || "Invalid URL"
  }
}

// Use ip_address to calculate unique users
// const uniqueUsers = new Set(events.pageviews.map((e) => e.ip_address).filter(Boolean)).size;

export const totalUniqueUsers = (events: any) => {
  return new Set(events.pageviews.map((e: any) => e.ip_address).filter(Boolean)).size;
}

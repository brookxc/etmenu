import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price with proper currency display
 * @param price - The price to format
 * @param currency - The currency symbol (defaults to "Birr")
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency = "Birr") {
  try {
    // Handle edge cases
    if (price === undefined || price === null) {
      return `0 ${currency}`
    }

    // Check if it's a whole number
    if (Math.floor(price) === price) {
      return `${Math.floor(price)} ${currency}`
    } else {
      // Format with 2 decimal places and remove trailing zeros
      return `${Number.parseFloat(price.toFixed(2))} ${currency}`
    }
  } catch (error) {
    console.error("Error formatting price:", error)
    return `${price} ${currency}`
  }
}

/**
 * Generates a lighter version of a hex color
 * @param hex - Hex color code
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 */
export function generateLighterColor(hex: string, opacity = 0.1) {
  try {
    // Convert hex to RGB
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)

    // Return rgba color with opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  } catch (error) {
    console.error("Error generating lighter color:", error)
    return `rgba(0, 0, 0, ${opacity})`
  }
}

/**
 * Generates a darker version of a hex color
 * @param hex - Hex color code
 * @returns Darker hex color
 */
export function generateDarkerColor(hex: string) {
  try {
    // Convert hex to RGB
    let r = Number.parseInt(hex.slice(1, 3), 16)
    let g = Number.parseInt(hex.slice(3, 5), 16)
    let b = Number.parseInt(hex.slice(5, 7), 16)

    // Make each component darker
    r = Math.max(0, r - 20)
    g = Math.max(0, g - 20)
    b = Math.max(0, b - 20)

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  } catch (error) {
    console.error("Error generating darker color:", error)
    return hex
  }
}

/**
 * Date helper functions for calendar operations
 * Timezone-safe date parsing and formatting utilities
 */

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

/**
 * Timezone-safe date parsing
 * Parses a date string in YYYY-MM-DD format
 */
export function parseDateString(dateString: string): {
    year: number;
    month: number;
    day: number;
} {
    const [year, month, day] = dateString.split("-").map(Number);
    return { year, month: month - 1, day };
}

/**
 * Gets formatted month and year string from date string
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted string like "January 2024"
 */
export function getMonthYear(dateString: string): string {
    const { year, month } = parseDateString(dateString);
    return `${MONTHS[month]} ${year}`;
}

/**
 * Converts a Date object to a string in YYYY-MM-DD format
 * @param date - Date object to convert
 * @returns Date string in YYYY-MM-DD format
 */
export function getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Gets today's date as a string in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getTodayString(): string {
    return getDateString(new Date());
}

/**
 * Checks if a date string represents today
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns True if the date is today
 */
export function isToday(dateString: string): boolean {
    return dateString === getTodayString();
}


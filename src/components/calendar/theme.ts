/**
 * Calendar theme configuration matching Operia Campus design system
 */

export const themeColor = "#2563EB"; 
export const accentColor = "#EFF6FF";

// Light mode (Campus Slate & Royal Blue)
export const lightCalendarTheme = {
    backgroundColor: "#F8FAFC",
    calendarBackground: "#FFFFFF",
    textSectionTitleColor: "#64748B",
    selectedDayBackgroundColor: "#2563EB",
    selectedDayTextColor: "#FFFFFF",
    todayTextColor: "#2563EB",
    dayTextColor: "#0F172A",
    textDisabledColor: "#CBD5E1",
    dotColor: "#2563EB",
    selectedDotColor: "#FFFFFF",
    arrowColor: "#2563EB",
    monthTextColor: "#0F172A",
    indicatorColor: "#2563EB",
    textDayFontWeight: "600" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
};

// Dark mode (Campus Midnight & Slate)
export const darkCalendarTheme = {
    backgroundColor: "#0F172A",
    calendarBackground: "#1E293B",
    textSectionTitleColor: "#94A3B8",
    selectedDayBackgroundColor: "#3B82F6",
    selectedDayTextColor: "#FFFFFF",
    todayTextColor: "#60A5FA",
    dayTextColor: "#F8FAFC",
    textDisabledColor: "#475569",
    dotColor: "#60A5FA",
    selectedDotColor: "#FFFFFF",
    arrowColor: "#60A5FA",
    monthTextColor: "#F8FAFC",
    indicatorColor: "#60A5FA",
    textDayFontWeight: "600" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
};

export function getTheme(isDarkMode: boolean) {
    return isDarkMode ? darkCalendarTheme : lightCalendarTheme;
}

// Agenda colors matching Campus UI tokens
export const agendaColors = {
    light: {
        background: "#F8FAFC",
        calendarHeader: "#FFFFFF",
        calendarBody: "#F8FAFC",
        cardBackground: "#FFFFFF",
        cardBorder: "#E2E8F0",
        textPrimary: "#0F172A",
        textSecondary: "#475569",
        textMuted: "#94A3B8",
        accent: "#2563EB",
        accentLight: "#EFF6FF",
        success: "#16A34A",
        successLight: "#DCFCE7",
        warning: "#D97706",
        warningLight: "#FEF3C7",
        danger: "#EF4444",
        dangerLight: "#FEE2E2",
        tabBar: "#FFFFFF",
        tabBarBorder: "#E2E8F0",
    },
    dark: {
        background: "#0F172A",
        calendarHeader: "#1E293B",
        calendarBody: "#0F172A",
        cardBackground: "#1E293B",
        cardBorder: "#334155",
        textPrimary: "#F8FAFC",
        textSecondary: "#CBD5E1",
        textMuted: "#64748B",
        accent: "#3B82F6",
        accentLight: "#1E3A8A",
        success: "#22C55E",
        successLight: "#14532D",
        warning: "#F59E0B",
        warningLight: "#451A03",
        danger: "#F87171",
        dangerLight: "#450A0A",
        tabBar: "#1E293B",
        tabBarBorder: "#334155",
    },
};

export function getAgendaColors(isDarkMode: boolean) {
    return isDarkMode ? agendaColors.dark : agendaColors.light;
}

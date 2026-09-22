import {
    ArrowRight,
    Bike,
    Car,
    ChevronRight,
    CircleHelp,
    Coins,
    FileText,
    Gift,
    HeartPulse,
    Home,
    House,
    Plane,
    Shield,
    ShieldCheck,
    Umbrella
} from "lucide-react-native";

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Dashboard() {
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👨🏻</Text>
                        </View>

                        <View>
                            <Text style={styles.name}>Sadhan Dutta</Text>
                            <Text style={styles.greeting}>Great to have you back.</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.helpButton}>
                        <CircleHelp size={22} color="#222" />
                        <Text style={styles.helpText}>Help Center</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Banner */}
                <View style={styles.hero}>
                    <View style={styles.brandBanner}>
                        <Text style={styles.tata}>TATA</Text>
                        <Text style={styles.aia}>AIA</Text>

                        <View style={styles.divider} />

                        <Text style={styles.newFund}>🏅 NEW FUND{"\n"}OFFER</Text>
                    </View>

                    <Text style={styles.heroSubtitle}>
                        ✦ Momentum Value 50 Index Fund ✦
                    </Text>

                    <Text style={styles.heroTitle}>
                        Invest ₹10,000/month & build a
                        {"\n"}
                        retirement corpus of
                    </Text>

                    <View style={styles.moneyCard}>
                        <Text style={styles.money}>₹25 LAKH*</Text>
                    </View>

                    <TouchableOpacity style={styles.viewPlans}>
                        <Text style={styles.viewPlansText}>View plans</Text>
                        <ChevronRight size={20} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        *Standard T&C apply. See T&C, 10 year CAGR @ BSE 500 Momentum Value
                        50 Index as on 31st August 2026.
                    </Text>
                </View>

                {/* Life Insurance Card */}
                <TouchableOpacity style={styles.guaranteeCard}>
                    <View style={styles.guaranteeIcon}>
                        <Umbrella size={40} color="#6846e8" />
                    </View>

                    <View style={styles.guaranteeContent}>
                        <Text style={styles.guaranteeTitle}>
                            Lowest Price Guarantee
                        </Text>

                        <Text style={styles.guaranteeText}>
                            Get ₹1 crore Life Cover
                        </Text>

                        <Text style={styles.guaranteePrice}>
                            Starting at ₹410/month+
                        </Text>
                    </View>

                    <View style={styles.arrowButton}>
                        <ArrowRight size={20} color="#fff" />
                    </View>
                </TouchableOpacity>

                {/* Categories */}
                <View style={styles.categoryGrid}>
                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <Umbrella size={42} color="#f08a27" />
                        </View>
                        <Text style={styles.categoryText}>Term Life{"\n"}Insurance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <HeartPulse size={42} color="#e44b45" />
                        </View>
                        <Text style={styles.categoryText}>Health{"\n"}Insurance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <Coins size={42} color="#20a46a" />
                        </View>
                        <Text style={styles.categoryText}>Investment{"\n"}Plans</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <Plane size={42} color="#f0b31b" />
                        </View>
                        <Text style={styles.categoryText}>Travel{"\n"}Insurance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <Car size={42} color="#7558e8" />
                        </View>
                        <Text style={styles.categoryText}>Car{"\n"}Insurance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <Bike size={42} color="#7558e8" />
                        </View>
                        <Text style={styles.categoryText}>Bike{"\n"}Insurance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <Home size={42} color="#20a46a" />
                        </View>
                        <Text style={styles.categoryText}>Home{"\n"}Insurance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.category}>
                        <View style={styles.categoryIcon}>
                            <ShieldCheck size={42} color="#e44b45" />
                        </View>
                        <Text style={styles.categoryText}>Other{"\n"}Insurance</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom spacing so content isn't hidden behind tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <House size={27} color="#fff" />
                    <Text style={[styles.navText, styles.activeNavText]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <FileText size={25} color="#8d8d8d" />
                    <Text style={styles.navText}>Claims</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Shield size={25} color="#8d8d8d" />
                    <Text style={styles.navText}>Policies</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Gift size={25} color="#8d8d8d" />
                    <Text style={styles.navText}>Benefits</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    scrollContent: {
        paddingBottom: 110,
    },

    // ─────────────────────────────
    // Header
    // ─────────────────────────────

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 28,
        paddingTop: 55,
        paddingBottom: 18,
        backgroundColor: "#f1f8ee",
    },

    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    avatar: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#e8e8e8",
        borderWidth: 1,
        borderColor: "#d7d7d7",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        fontSize: 32,
    },

    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
    },

    greeting: {
        fontSize: 14,
        color: "#ffffff",
        marginTop: 4,
    },

    helpButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#ffffff",
        paddingHorizontal: 17,
        paddingVertical: 13,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "#d6d6d6",
    },

    helpText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },

    // ─────────────────────────────
    // Hero
    // ─────────────────────────────

    hero: {
        backgroundColor: "#d6ffbd",
        paddingHorizontal: 28,
        paddingTop: 5,
        paddingBottom: 18,
        alignItems: "center",
    },

    brandBanner: {
        width: "76%",
        height: 72,
        backgroundColor: "#fff",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
        gap: 10,
    },

    tata: {
        fontSize: 22,
        fontWeight: "900",
        color: "#1475a8",
    },

    aia: {
        fontSize: 22,
        fontWeight: "900",
        color: "#bd1d45",
    },

    divider: {
        height: 42,
        width: 1,
        backgroundColor: "#d5d5d5",
        marginHorizontal: 7,
    },

    newFund: {
        fontSize: 13,
        fontWeight: "800",
        color: "#283447",
        lineHeight: 16,
    },

    heroSubtitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#263545",
        marginBottom: 14,
    },

    heroTitle: {
        textAlign: "center",
        fontSize: 25,
        lineHeight: 34,
        fontWeight: "800",
        color: "#243545",
    },

    moneyCard: {
        width: "80%",
        height: 115,
        backgroundColor: "#12b85a",
        marginTop: 25,
        marginBottom: -8,
        borderWidth: 5,
        borderColor: "#079d48",
        transform: [{ rotate: "-5deg" }],
        justifyContent: "center",
        alignItems: "center",
    },

    money: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "900",
    },

    viewPlans: {
        width: "88%",
        height: 78,
        borderRadius: 13,
        backgroundColor: "#6342ed",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        zIndex: 5,
    },

    viewPlansText: {
        color: "#fff",
        fontSize: 21,
        fontWeight: "700",
    },

    disclaimer: {
        textAlign: "center",
        color: "#50604d",
        fontSize: 6,
        lineHeight: 8,
        marginTop: 17,
        paddingHorizontal: 15,
    },

    // ─────────────────────────────
    // Guarantee Card
    // ─────────────────────────────

    guaranteeCard: {
        marginHorizontal: 29,
        marginTop: 43,
        minHeight: 165,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "#c5b5ff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 18,
        shadowColor: "#7051ee",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.16,
        shadowRadius: 0,
        elevation: 3,
    },

    guaranteeIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: "#eeeeee",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },

    guaranteeContent: {
        flex: 1,
        paddingLeft: 15,
    },

    guaranteeTitle: {
        color: "#8062df",
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 8,
    },

    guaranteeText: {
        color: "#222",
        fontSize: 20,
        fontWeight: "500",
    },

    guaranteePrice: {
        color: "#222",
        fontSize: 20,
        fontWeight: "500",
        marginTop: 4,
    },

    arrowButton: {
        width: 56,
        height: 40,
        borderRadius: 22,
        backgroundColor: "#8565ed",
        alignItems: "center",
        justifyContent: "center",
    },

    // ─────────────────────────────
    // Categories
    // ─────────────────────────────

    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 40,
        marginTop: 38,
    },

    category: {
        width: "22%",
        alignItems: "center",
        marginBottom: 32,
    },

    categoryIcon: {
        width: 84,
        height: 84,
        borderRadius: 13,
        backgroundColor: "#f3f8fc",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 13,
    },

    categoryText: {
        textAlign: "center",
        fontSize: 16,
        lineHeight: 23,
        color: "#222",
        fontWeight: "500",
    },

    // ─────────────────────────────
    // Bottom Navigation
    // ─────────────────────────────

    bottomNav: {
        position: "absolute",
        left: 25,
        right: 25,
        bottom: 16,
        height: 78,
        borderRadius: 28,
        backgroundColor: "#111111",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },

    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },

    navText: {
        fontSize: 14,
        color: "#858585",
    },

    activeNavText: {
        color: "#fff",
    },
});
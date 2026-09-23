
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bell } from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";

import { DashboardStyles } from "../../../styles/styles";

const styles = DashboardStyles;

const profile: { name: string, uuid: string, role: string, permision: string[] } = {
    name: "sourav",
    uuid: "123",
    role: "teacher",
    permision: ["create", "read", "update", "delete"]
};

const bannerNotice: { title: string, description: string, path: string, pathname: string, Color: { Border: string, Button: string } }[] = [
    { title: "Fee due", description: "Your fee payment is pending . Please complete it by 15 nov", path: "", pathname: "Pay now", Color: { Border: "#e96e10ff", Button: "#f0c85d" } },
    { title: "Result ", description: "Your exam result is published", path: "", pathname: "view result", Color: { Border: "#9de910ff", Button: "#5df0d5ff" } }
];

// const tiles: { title: string; icon: string; badge: string; path: Href | "" }[] = [
//     { title: "salary", icon: "fee", badge: "", path: "" },
//     { title: "Attendance", icon: "attendance", badge: "77%", path: "" },
//     { title: "Assignment", icon: "assignment", badge: "0", path: "" },
//     { title: "Results", icon: "result", badge: "8.55", path: "" },
//     { title: "Events", icon: "event", badge: "", path: "" },
//     { title: "View Marks", icon: "place_holder", badge: "X", path: "" },
//     { title: "Time Table", icon: "place_holder", badge: "X", path: "" },
// ];

// const tileImages: Record<string, any> = {
//     salary: require("../../../assets/myassets/fee.png"),
//     attendance: require("../../../assets/myassets/attendance.png"),
//     assignment: require("../../../assets/myassets/assignment.png"),
//     result: require("../../../assets/myassets/result.png"),
//     event: require("../../../assets/myassets/event.png"),
//     place_holder: require("../../../assets/myassets/place_holder.png"),
// };


export default function Dashboard() {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} >
                <LinearGradient
                    colors={['#f4d65b', '#f5e193', '#ffffff']}
                    locations={[0.22, 0.5, 1.0]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    {/**Header */}
                    <View style={[styles.header, { paddingTop: insets.top + 15, paddingLeft: insets.left + 17, paddingRight: insets.right + 17 }]}>
                        <Pressable style={styles.profileSection}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>👨🏻</Text>
                            </View>

                            <View>
                                <Text style={styles.name}>Hi , {profile.name}</Text>
                                <Text style={styles.greeting}>VI B</Text>
                            </View>
                        </Pressable>

                        <Pressable style={styles.helpButton}>
                            <Bell size={16} color="#222" />
                        </Pressable>
                    </View>
                </LinearGradient>
                <View style={{
                    paddingLeft: insets.left + 3, paddingRight: insets.right + 3, paddingBottom: insets.bottom
                }}>
                    {/**Alert */}
                    <View style={styles.componentHeader}>
                        <Text style={styles.componentText}>Alerts</Text>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alertContainer}>
                        {bannerNotice.map((item, index) => (
                            <Pressable style={({ pressed }) => [styles.alertBox, pressed && { opacity: 0.7 }]}>
                                <View key={index} style={styles.alertCard}>
                                    <View style={styles.alertContent}>
                                        <Text style={[styles.alertTitle, { color: item.Color.Border }]}>{item.title}</Text>
                                        <Text style={styles.alertDescription}>{item.description}</Text>
                                    </View>
                                    <View style={[styles.alertButton, { backgroundColor: item.Color.Button }]}>
                                        <Text style={styles.alertButtonText}>{item.pathname}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                </View>

            </ScrollView >

        </View >
    )
}

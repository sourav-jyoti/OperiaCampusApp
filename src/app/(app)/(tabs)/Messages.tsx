// import { Text, View } from "react-native";

// export default function Messages() {
//     return (
//         <View style={styles.container}>
//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} >
//                 <LinearGradient
//                     colors={['#F7786B', '#FBD178']}
//                     start={{ x: 0, y: 0.5 }}
//                     end={{ x: 1, y: 0.5 }}
//                     style={[styles.profile, { paddingTop: insets.top + 20 }]}
//                 >
//                     {/* Header */}
//                     <View style={styles.header}>
//                         <View style={styles.profileSection}>
// <View style={styles.avatar}>
//     <Text style={styles.avatarText}>👨🏻</Text>
// </View>

//                             <View>
//                                 <Text style={styles.name}>Sadhan Dutta</Text>
//                                 <Text style={styles.greeting}>Great to have you back.</Text>
//                             </View>
//                         </View>

//                         <TouchableOpacity
//                             <CircleHelp size={22} color="#222" />
//                             <Text style={styles.helpText}>Help Center</Text>
//                         </TouchableOpacity>
//                     </View>

//
//                     {/* Life Insurance Card */}
//                     <TouchableOpacity style={styles.guaranteeCard}>
//                         <View style={styles.guaranteeIcon}>
//                             <Umbrella size={40} color="#6846e8" />
//                         </View>

//                         <View style={styles.guaranteeContent}>
//                             <Text style={styles.guaranteeTitle}>
//                                 Lowest Price Guarantee
//                             </Text>

//                             <Text style={styles.guaranteeText}>
//                                 Get ₹1 crore Life Cover
//                             </Text>

//                             <Text style={styles.guaranteePrice}>
//                                 Starting at ₹410/month+
//                             </Text>
//                         </View>

//                         <View style={styles.arrowButton}>
//                             <ArrowRight size={20} color="#fff" />
//                         </View>
//                     </TouchableOpacity>

//                     {/* Categories */}
//                     <View style={styles.categoryGrid}>
//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <Umbrella size={42} color="#f08a27" />
//                             </View>
//                             <Text style={styles.categoryText}>Term Life{"\n"}Insurance</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <HeartPulse size={42} color="#e44b45" />
//                             </View>
//                             <Text style={styles.categoryText}>Health{"\n"}Insurance</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <Coins size={42} color="#20a46a" />
//                             </View>
//                             <Text style={styles.categoryText}>Investment{"\n"}Plans</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <Plane size={42} color="#f0b31b" />
//                             </View>
//                             <Text style={styles.categoryText}>Travel{"\n"}Insurance</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <Car size={42} color="#7558e8" />
//                             </View>
//                             <Text style={styles.categoryText}>Car{"\n"}Insurance</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <Bike size={42} color="#7558e8" />
//                             </View>
//                             <Text style={styles.categoryText}>Bike{"\n"}Insurance</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <Home size={42} color="#20a46a" />
//                             </View>
//                             <Text style={styles.categoryText}>Home{"\n"}Insurance</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.category}>
//                             <View style={styles.categoryIcon}>
//                                 <ShieldCheck size={42} color="#e44b45" />
//                             </View>
//                             <Text style={styles.categoryText}>Other{"\n"}Insurance</Text>
//                         </TouchableOpacity>
//                     </View>

//                     {/* Bottom spacing so content isn't hidden behind tab bar */}
//                     <View style={{ height: 100 }} />
//             </ScrollView>

//         </View>
//     );
// }

//alertContainer: { paddingHorizontal: "4%", paddingVertical: "2%", gap: 4, }, alertBox: { marginBottom: '6%', width: '100%', }, alertCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: '4%', borderWidth: 2, maxWidth: "50%" }, alertContent: { flex: 1, }, alertTitle: { fontSize: 17, fontWeight: "700", }, alertDescription: { color: "#222", fontSize: 14, fontWeight: "300", }, alertButton: { width: 56, height: 40, borderRadius: 22, alignItems: "center", justifyContent: "center", }, alertButtonText: { fontSize: 16, fontWeight: "500", },

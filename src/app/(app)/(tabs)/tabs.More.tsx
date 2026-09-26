import { useTabBarScroll } from '@/hooks/useTabBarScroll';
import { useRouter } from 'expo-router';
import { Box, X } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MoreSTyle } from '../../../styles/MoreStyle';
import { tilesData } from '../../../utilities/mockdata';
import type { Tiles } from '../../../utilities/types';

const styles = MoreSTyle;

interface CategoryGroup {
  category: string;
  items: Tiles[];
}

export default function More() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { onScroll, scrollEventThrottle } = useTabBarScroll();

  const groupedTiles = useMemo(() => {
    return tilesData.reduce<CategoryGroup[]>((acc, item) => {
      const existing = acc.find((group) => group.category.toLowerCase() === item.category.toLowerCase());
      if (existing) {
        existing.items.push(item);
      } else {
        acc.push({ category: item.category, items: [item] });
      }
      return acc;
    }, []);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topHeader,
          {
            paddingTop: insets.top + 10,
            paddingRight: insets.right + 17,
            paddingLeft: insets.left + 17,
          },
        ]}
      >
        <Pressable
          onPress={() => router.navigate('/(app)/(tabs)/tabs.Dashboard')}
          style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
          accessibilityLabel="Back to Dashboard"
          accessibilityRole="button"
        >
          <X size={20} color="#222" strokeWidth={2.2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top - 30,
            paddingLeft: insets.left + 17,
            paddingRight: insets.right + 17,
            paddingBottom: insets.bottom + 90,
          },
        ]}
      >
        {groupedTiles.map((group) => {
          const categoryName = group.category.charAt(0).toUpperCase() + group.category.slice(1);

          return (
            <View key={group.category}>
              <View style={styles.componentHeader}>
                <Text style={styles.componentText}>{categoryName}</Text>
                <View style={styles.headerLine} />
              </View>

              <View style={styles.quickActionContainer}>
                {group.items.map((item, index) => (
                  <Pressable key={`${item.title}-${index}`} style={({ pressed }) => [styles.category, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
                    <View style={styles.categoryIcon}>
                      <Box color="#f08a27" size={24} />
                    </View>
                    <Text style={styles.categoryText}>{item.title}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

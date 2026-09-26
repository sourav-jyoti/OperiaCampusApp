import { useTabBarVisibility } from '@/context/TabBarVisibilityContext';
import { BottomTabBarProps } from 'expo-router/tabs';
import { Calendar, FileText, Gift, House, LayoutGrid, MessageSquare, Shield } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS: Record<string, any> = {
  index: House,
  claims: FileText,
  policies: Shield,
  benefits: Gift,
  'tabs.Dashboard': House,
  'tabs.Calender': Calendar,
  'tabs.Messages': MessageSquare,
  'tabs.More': LayoutGrid,
};

export default function CustomTab({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isVisible, showTabBar } = useTabBarVisibility();

  // Total distance needed to slide completely off the screen
  const hideDistance = 72 + Math.max(insets.bottom, 10) + 25;
  const translateY = useRef(new Animated.Value(0)).current;

  // Fluid spring animation: smoothly accelerates, glides, and gently settles
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : hideDistance,
      damping: 20,
      mass: 0.8,
      stiffness: 130,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
  }, [isVisible, hideDistance, translateY]);

  // Ensure tab bar is shown when switching between tabs
  useEffect(() => {
    showTabBar();
  }, [state.index, showTabBar]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          transform: [{ translateY }],
        },
      ]}
      pointerEvents={isVisible ? 'box-none' : 'none'}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

          const isFocused = state.index === index;

          const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              {Icon && (
                <Icon
                  size={22}
                  strokeWidth={isFocused ? 2.2 : 1.6}
                  color={isFocused ? '#FFFFFF' : '#8C8C96'}
                  fill={isFocused ? '#FFFFFF' : 'transparent'}
                />
              )}

              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? '#FFFFFF' : '#8C8C96',
                  },
                ]}
                numberOfLines={1}
              >
                {typeof label === 'string' ? label : route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    alignItems: 'center',

    paddingHorizontal: 20,
  },

  tabBar: {
    width: '100%',
    maxWidth: 700,

    height: 72,

    backgroundColor: '#111111',

    borderRadius: 15,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    paddingHorizontal: 12,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    // Android shadow
    elevation: 12,
  },

  tab: {
    flex: 1,
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  label: {
    fontSize: 9,
    fontWeight: '500',
  },

  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.96 }],
  },
});

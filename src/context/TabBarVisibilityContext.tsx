import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export interface TabBarVisibilityContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  showTabBar: () => void;
  hideTabBar: () => void;
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType | undefined>(undefined);

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const showTabBar = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideTabBar = useCallback(() => {
    setIsVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      isVisible,
      setIsVisible,
      showTabBar,
      hideTabBar,
    }),
    [isVisible, showTabBar, hideTabBar]
  );

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility(): TabBarVisibilityContextType {
  const context = useContext(TabBarVisibilityContext);
  if (!context) {
    return {
      isVisible: true,
      setIsVisible: () => {},
      showTabBar: () => {},
      hideTabBar: () => {},
    };
  }
  return context;
}

export interface UseTabBarScrollOptions {
  /**
   * Continuous scroll distance needed to trigger hide (default 35px).
   * Prevents abrupt triggering on small thumb movements.
   */
  hideThreshold?: number;
  /**
   * Continuous scroll distance needed to trigger show (default 20px).
   */
  showThreshold?: number;
  /**
   * Minimum vertical scroll offset from the top before hiding is allowed.
   * Default is 40px.
   */
  minOffset?: number;
  /**
   * Existing onScroll handler to chain if any.
   */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useTabBarScroll(options?: UseTabBarScrollOptions) {
  const { isVisible, setIsVisible, showTabBar, hideTabBar } = useTabBarVisibility();
  const prevScrollY = useRef(0);
  const isVisibleRef = useRef(isVisible);
  // Accumulates continuous scroll distance in one direction
  const accumulatedDelta = useRef(0);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Call chained onScroll if supplied
      options?.onScroll?.(event);

      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const currentY = contentOffset.y;
      const diff = currentY - prevScrollY.current;
      const hideThreshold = options?.hideThreshold ?? 35;
      const showThreshold = options?.showThreshold ?? 20;
      const minOffset = options?.minOffset ?? 40;

      // 1. If at or near top, or pulling down (iOS overscroll bounce): always show smoothly
      if (currentY <= 15) {
        accumulatedDelta.current = 0;
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
        prevScrollY.current = Math.max(0, currentY);
        return;
      }

      // 2. Ignore overscroll past the bottom of the scroll view (rubber banding)
      if (layoutMeasurement && contentSize) {
        const maxScroll = contentSize.height - layoutMeasurement.height;
        if (currentY >= maxScroll && maxScroll > 0) {
          prevScrollY.current = currentY;
          return;
        }
      }

      // 3. Track scroll accumulation with direction change reset
      if (diff > 0) {
        // Scrolling DOWN
        if (accumulatedDelta.current < 0) {
          accumulatedDelta.current = 0; // reset if previously scrolling up
        }
        accumulatedDelta.current += diff;

        // Intentional scroll down past accumulated threshold
        if (accumulatedDelta.current > hideThreshold && currentY > minOffset) {
          if (isVisibleRef.current) {
            isVisibleRef.current = false;
            setIsVisible(false);
          }
        }
      } else if (diff < 0) {
        // Scrolling UP
        if (accumulatedDelta.current > 0) {
          accumulatedDelta.current = 0; // reset if previously scrolling down
        }
        accumulatedDelta.current += diff;

        // Intentional scroll up past accumulated threshold
        if (accumulatedDelta.current < -showThreshold) {
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            setIsVisible(true);
          }
        }
      }

      prevScrollY.current = currentY;
    },
    [options?.onScroll, options?.hideThreshold, options?.showThreshold, options?.minOffset, setIsVisible]
  );

  return {
    onScroll: handleScroll,
    scrollEventThrottle: 16,
    isVisible,
    showTabBar,
    hideTabBar,
  };
}

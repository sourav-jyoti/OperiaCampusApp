import React, { FC, useEffect, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

// Constants for animation
const SPRING_CONFIG = {
    damping: 15,
    stiffness: 150,
    mass: 0.5,
};

interface SlidingDigitProps {
    digit: number;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

const SlidingDigit: FC<SlidingDigitProps> = ({
    digit,
    textStyle,
    containerStyle,
}) => {
    const [digitHeight, setDigitHeight] = useState<number | null>(null);
    const translateY = useSharedValue(0);

    // Ref to avoid initial animation on mount
    const isInitialMount = useRef(true);

    // Measure the height of a single digit on layout
    const handleLayout = (event: LayoutChangeEvent) => {
        if (digitHeight === null) {
            const { height } = event.nativeEvent.layout;
            setDigitHeight(height);
        }
    };

    // Animate translateY when digit or digitHeight changes
    useEffect(() => {
        if (digitHeight !== null) {
            const targetY = -digit * digitHeight;

            // Skip animation on initial render, just set the value
            if (isInitialMount.current) {
                translateY.value = targetY;
                isInitialMount.current = false;
            } else {
                // For subsequent updates
                translateY.value = withSpring(targetY, SPRING_CONFIG);
            }
        }
    }, [digit, digitHeight, translateY]);

    // Animated style for the digit strip
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    // Use provided textStyle or default
    const finalTextStyle = [styles.digitText, textStyle];

    // Render a single digit invisibly to measure height
    if (digitHeight === null) {
        return (
            <Text
                style={[finalTextStyle, styles.measureText]}
                onLayout={handleLayout}
            >
                0
            </Text>
        );
    }

    // Render the sliding digit strip
    return (
        <View
            style={[
                {
                    height: digitHeight,
                    overflow: "hidden",
                },
                containerStyle,
            ]}
        >
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        alignItems: "center",
                    } as ViewStyle,
                ]}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <Text
                        key={i}
                        style={[
                            finalTextStyle,
                            {
                                textAlign: "center",
                                width: "100%",
                                height: digitHeight,
                                lineHeight: digitHeight,
                                textAlignVertical: "center",
                            } as TextStyle,
                        ]}
                    >
                        {i}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    digitText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    measureText: {
        opacity: 0,
        position: "absolute",
    },
});

export default SlidingDigit;

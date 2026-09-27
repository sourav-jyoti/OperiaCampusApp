import React, { FC } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import SlidingDigit from "./SlidingDigit";

interface AnimatedSlidingNumberProps {
  number: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  minDigits?: number; // Minimum number of digits
  maxDigits?: number; // Maximum number of digits to display
  decimalPlaces?: number; // Number of decimal places (0 = auto-detect, -1 = integer only)
  showThousandsSeparator?: boolean; // Show thousands separator (comma, auto-enabled for numbers >= 1000)
  autoFormat?: boolean; // Enable automatic formatting based on number value
}

const AnimatedSlidingNumber: FC<AnimatedSlidingNumberProps> = ({
  number,
  textStyle,
  containerStyle,
  minDigits = 2,
  maxDigits = 6,
  decimalPlaces = 0,
  showThousandsSeparator = false,
  autoFormat = true,
}) => {
  // Ensure number is within reasonable bounds
  const clampedNumber = Math.max(
    0,
    Math.min(number, Math.pow(10, maxDigits) - 1)
  );

  // Auto-detect formatting settings
  let finalDecimalPlaces = decimalPlaces;
  let finalShowThousandsSeparator = showThousandsSeparator;

  if (autoFormat) {
    // Auto-detect decimal places
    if (decimalPlaces === 0) {
      const hasDecimals = clampedNumber % 1 !== 0;
      if (hasDecimals) {
        // Determine optimal decimal places (max 2 for readability)
        const decimalStr = clampedNumber.toString().split(".")[1] || "";
        finalDecimalPlaces = Math.min(decimalStr.length, 2);
      } else {
        finalDecimalPlaces = 0;
      }
    } else if (decimalPlaces === -1) {
      finalDecimalPlaces = 0; // Force integer
    }

    // Auto-enable thousands separator for numbers >= 1000
    if (clampedNumber >= 1000) {
      finalShowThousandsSeparator = true;
    }
  }

  // Helper function to render digits with optional thousands separators
  const renderDigitsWithSeparators = (
    digits: number[],
    keyPrefix: string = ""
  ) => {
    const elements: React.ReactNode[] = [];

    digits.forEach((digit, index) => {
      // Add thousands separator (comma) if enabled
      if (
        finalShowThousandsSeparator &&
        index > 0 &&
        (digits.length - index) % 3 === 0
      ) {
        elements.push(
          <Text
            key={`${keyPrefix}comma-${index}`}
            style={[styles.separator, textStyle]}
          >
            ,
          </Text>
        );
      }

      elements.push(
        <SlidingDigit
          key={`${keyPrefix}${index}`}
          digit={digit}
          textStyle={textStyle}
        />
      );
    });

    return elements;
  };

  if (finalDecimalPlaces > 0) {
    // Handle decimal numbers
    const integerPart = Math.floor(clampedNumber);
    const decimalPart = Math.round(
      (clampedNumber - integerPart) * Math.pow(10, finalDecimalPlaces)
    );

    const integerDigits = String(integerPart)
      .padStart(minDigits, "0")
      .split("")
      .map(Number);
    const decimalDigits = String(decimalPart)
      .padStart(finalDecimalPlaces, "0")
      .split("")
      .map(Number);

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Integer part with optional separators */}
        {renderDigitsWithSeparators(integerDigits, "int-")}

        {/* Decimal point */}
        <Text style={[styles.decimalPoint, textStyle]}>.</Text>

        {/* Decimal part */}
        {decimalDigits.map((digit, index) => (
          <SlidingDigit
            key={`dec-${index}`}
            digit={digit}
            textStyle={textStyle}
          />
        ))}
      </View>
    );
  } else {
    // Handle integer numbers
    const formattedNumber = String(Math.floor(clampedNumber)).padStart(
      minDigits,
      "0"
    );
    const digits = formattedNumber.split("").map(Number);

    return (
      <View style={[styles.container, containerStyle]}>
        {renderDigitsWithSeparators(digits)}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  decimalPoint: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 2,
  },
  separator: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 1,
  },
});

export default AnimatedSlidingNumber;

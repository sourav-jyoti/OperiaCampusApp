import { ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AlertCardStyle } from '../styles/styles';
import type { BannerNotice } from '../utilities/types';

const styles = AlertCardStyle;

interface BannerCardProps {
  item: BannerNotice;
  cardWidth?: number;
  onPress?: (item: BannerNotice) => void;
}

const BannerCard = ({ item, cardWidth: customCardWidth, onPress }: BannerCardProps) => {
  const { width } = useWindowDimensions();

  // Card takes 88% of screen, leaving the next/previous card partially visible
  const cardWidth = customCardWidth ?? Math.round(width * 0.9);

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        {
          width: cardWidth,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: item.Color.Border,
            backgroundColor: item.Color.Background,
          },
        ]}
      >
        {/* Decorative circle */}
        <Svg width={160} height={180} viewBox="0 0 160 180" style={styles.decorativeWave}>
          <Path
            d="M160 0
       C125 8 125 35 95 40
       C65 45 65 75 30 82
       C15 85 5 95 0 180
       L160 180
       Z"
            fill={item.Color.Button}
            opacity={0.3}
          />
        </Svg>

        <View
          style={[
            styles.decorativeCircle,
            {
              backgroundColor: item.Color.Button,
            },
          ]}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: item.Color.Button,
              },
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        {/* Action */}
        <View
          style={[
            styles.actionButton,
            {
              backgroundColor: item.Color.Button,
            },
          ]}
        >
          <Text style={styles.actionText}>{item.pathname}</Text>

          <ChevronRight size={16} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
};

export default BannerCard;

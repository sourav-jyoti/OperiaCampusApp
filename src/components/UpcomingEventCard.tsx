import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EventCardProps {
  title: string;
  pending?: number;
  submitted?: number;
  total?: number;
  due?: number;
  onViewAll?: () => void;
}

const UpcomingEventsCard: React.FC<EventCardProps> = ({ title, pending, submitted, total, due, onViewAll }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Decorative Circle Background */}
      <View style={styles.decorativeCircle} />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* Status Row - Pending/Submitted OR Total/Due */}
        {pending !== undefined && submitted !== undefined ? (
          <Text style={styles.statusText}>
            Pending : <Text style={styles.statusValue}>{String(pending).padStart(2, '0')}</Text> Submitted : <Text style={styles.statusValue}>{String(submitted).padStart(2, '0')}</Text>
          </Text>
        ) : (
          <View style={styles.statsRow}>
            {total !== undefined && (
              <Text style={styles.statText}>
                Total: <Text style={styles.statValue}>{total}</Text>
              </Text>
            )}
            {due !== undefined && (
              <Text style={styles.statText}>
                Due: <Text style={styles.statValue}>{due}</Text>
              </Text>
            )}
          </View>
        )}

        {/* View All Button */}
        <Pressable style={({ pressed }) => [styles.viewAllButton, pressed && styles.viewAllButtonPressed]} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fffefeff',
    borderWidth: 1,
    borderColor: '#dfb12ad7',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  decorativeCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f6ca4fed',
    top: -50,
    left: -30,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    zIndex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },

  statusText: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 14,
    fontWeight: '500',
  },

  statusValue: {
    fontWeight: '700',
    color: '#1f2937',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },

  statText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },

  statValue: {
    fontWeight: '700',
    color: '#1f2937',
  },

  viewAllButton: {
    backgroundColor: '#f6ca4fed',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },

  viewAllButtonPressed: {
    backgroundColor: '#fde047',
    elevation: 1,
  },

  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
});

export default UpcomingEventsCard;

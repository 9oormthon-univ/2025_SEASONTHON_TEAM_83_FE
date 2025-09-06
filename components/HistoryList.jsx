// components/HistoryList.jsx
import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PROFILE_COLORS } from '../constants/ProfileConstants';

const HistoryItem = memo(function HistoryItem({ item, isLast }) {
  const dim = item.dim ? { opacity: 0.5 } : null;
  const dimPoint = item.dim ? { opacity: 0.45 } : null;
  const dimIcon = item.dim ? { opacity: 0.35 } : null;

  return (
    <View>
      <View style={styles.historyRow}>
        <Image source={item.icon} style={[styles.hIcon, dimIcon]} />
        <View style={styles.historyInfo}>
          <Text style={[styles.hTitle, dim]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.hDate, dim]} numberOfLines={1}>{item.date}</Text>
        </View>
        <Text style={[styles.hPoint, dimPoint]}>{item.point}</Text>
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
});

const HistoryList = ({ data, title }) => {
  return (
    <View>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.card}>
        {data.map((item, idx) => (
          <HistoryItem key={item.id} item={item} isLast={idx === data.length - 1} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PROFILE_COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: PROFILE_COLORS.ink,
    marginBottom: 8,
    marginTop: 2,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingVertical: 10,
  },
  historyInfo: {
    flex: 1,
  },
  hIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EFE9',
  },
  hTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: PROFILE_COLORS.ink,
  },
  hDate: {
    fontSize: 11,
    color: PROFILE_COLORS.sub,
    marginTop: 2,
  },
  hPoint: {
    fontSize: 16,
    fontWeight: '900',
    color: PROFILE_COLORS.green,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: PROFILE_COLORS.line,
    marginVertical: 6,
  },
});

export default HistoryList;

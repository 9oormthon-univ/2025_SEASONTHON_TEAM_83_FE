// components/BadgeStrip.jsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PROFILE_COLORS, PROFILE_SIZES } from '../constants/ProfileConstants';

const BadgeStrip = ({ badges, title }) => {
  return (
    <View>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.badgeArea}>
        <Image
          source={require('../assets/images/bar_green.png')}
          style={styles.ribbonImg}
          resizeMode="stretch"
          pointerEvents="none"
        />
        <View style={styles.badgeRow}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <Image source={badge.src} style={styles.badgeImage} resizeMode="contain" />
              <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
              <Text style={styles.badgeDate} numberOfLines={1}>{badge.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: PROFILE_COLORS.ink,
    marginBottom: 8,
    marginTop: 2,
  },
  badgeArea: {
    position: 'relative',
    marginBottom: PROFILE_SIZES.GAP,
    paddingBottom: 2,
    minHeight: PROFILE_SIZES.BADGE_SIZE + 26,
  },
  ribbonImg: {
    position: 'absolute',
    left: -PROFILE_SIZES.SP,
    right: -PROFILE_SIZES.SP,
    top: PROFILE_SIZES.BADGE_SIZE / 2 - PROFILE_SIZES.RIBBON_H / 2,
    height: PROFILE_SIZES.RIBBON_H,
    zIndex: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  badgeItem: {
    alignItems: 'center',
    width: 70,
  },
  badgeImage: {
    width: PROFILE_SIZES.BADGE_SIZE,
    height: PROFILE_SIZES.BADGE_SIZE,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: PROFILE_COLORS.ink,
    marginTop: 6,
  },
  badgeDate: {
    fontSize: 10,
    color: PROFILE_COLORS.sub,
    marginTop: 2,
  },
});

export default BadgeStrip;

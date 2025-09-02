// app/my-page.jsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import {
  BackHandler,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';
import HeaderBar from '../components/HeaderBar';

/* =========================
 * Theme & constants
 * ======================= */
const SP = 14;
const GAP = 10;
const R = 12;
const BADGE_SIZE = 56;
const RIBBON_H = 14;

const COLORS = {
  bg: '#EDE4CC',
  card: '#FFFFFF',
  ink: '#1F2A22',
  sub: '#7A8B83',
  green: '#0F6D52',
  line: '#EAEFE7',
};

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 1 },
});

/* =========================
 * Mock data
 * ======================= */
const HISTORY = [
  { id: 1, title: '걷기 1.3Km 인증', date: '2025-01-15', point: '+20p', icon: require('../assets/images/icon_walk.png'), dim: false },
  { id: 2, title: '텀블러 사용 인증', date: '2025-01-14', point: '+20p', icon: require('../assets/images/icon_tumblr.png'), dim: true },
];

const BADGES = [
  { id: 1, name: '걷기',   date: '2025.05.06', src: require('../assets/images/icon_walk.png') },
  { id: 2, name: '텀블러', date: '2025.06.20', src: require('../assets/images/icon_tumblr.png') },
  { id: 3, name: '걷기',   date: '2025.06.25', src: require('../assets/images/icon_walk.png') },
  { id: 4, name: '텀블러', date: '2025.08.04', src: require('../assets/images/icon_tumblr.png') },
];

/* =========================
 * History
 * ======================= */
const HistoryItem = memo(function HistoryItem({ item, isLast }) {
  const dim = item.dim ? { opacity: 0.5 } : null;
  const dimPoint = item.dim ? { opacity: 0.45 } : null;
  const dimIcon = item.dim ? { opacity: 0.35 } : null;

  return (
    <View>
      <View style={styles.historyRow}>
        <Image source={item.icon} style={[styles.hIcon, dimIcon]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.hTitle, dim]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.hDate, dim]} numberOfLines={1}>{item.date}</Text>
        </View>
        <Text style={[styles.hPoint, dimPoint]}>{item.point}</Text>
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
});

function HistoryList({ data }) {
  return (
    <View style={styles.card}>
      {data.map((item, idx) => (
        <HistoryItem key={item.id} item={item} isLast={idx === data.length - 1} />
      ))}
    </View>
  );
}

/* =========================
 * Badges (with ribbon)
 * ======================= */
function BadgeStrip({ badges }) {
  return (
    <View style={styles.badgeArea}>
      <Image
        source={require('../assets/images/bar_green.png')}
        style={styles.ribbonImg}
        resizeMode="stretch"
        pointerEvents="none"
      />
      <View style={styles.badgeRow}>
        {badges.map((b) => (
          <View key={b.id} style={styles.badgeItem}>
            <Image source={b.src} style={styles.badgeImage} resizeMode="contain" />
            <Text style={styles.badgeName} numberOfLines={1}>{b.name}</Text>
            <Text style={styles.badgeDate} numberOfLines={1}>{b.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* =========================
 * Screen
 * ======================= */
function Screen() {
  const router = useRouter();

  return (
    
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="light-content" />
      <HeaderBar title="My Page" />

      <View style={styles.content}>
        <View style={[styles.card, styles.cardTight]}>
          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <Image source={require('../assets/images/icon_level1.png')} style={styles.avatar} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name} numberOfLines={1}>닉네임</Text>
                <Text style={styles.email} numberOfLines={1}>이메일@naver.com</Text>
              </View>
            </View>
            <View style={styles.profileRight}>
              <Image
                source={require('../assets/images/icon_pleanet_logo.png')}
                style={styles.planetBadge}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profile')}>
                <Text style={styles.editBtnText}>프로필 수정</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>적립 내역</Text>
        <HistoryList data={HISTORY} />

        {/* Badges */}
        <Text style={styles.sectionTitle}>보유 뱃지</Text>
        <BadgeStrip badges={BADGES} />

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={() => router.push('/my-forest')}>
          <Text style={styles.ctaText}>나의 숲</Text>
        </TouchableOpacity>
      </View>

      <CustomTabBar />
    </SafeAreaView>
  );
}

/* =========================
 * Root (Android back handling)
 * ======================= */
export default function MyPageScreen() {
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [router])
  );

  // NOTE: 루트에서 이미 SafeAreaProvider를 제공한다면 이 Provider는 제거하세요.
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}

/* =========================
 * Styles
 * ======================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  content: {
    flex: 1,
    paddingHorizontal: SP,
    paddingBottom: 10,
    justifyContent: 'flex-start',
  },

  /* Card & Common */
  card: {
    backgroundColor: COLORS.card,
    borderRadius: R,
    padding: 12,
    marginBottom: GAP,
    ...shadow,
  },
  cardTight: { marginTop: SP - 2 },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.ink,
    marginBottom: 8,
    marginTop: 2,
  },

  /* Profile */
  profileRow: { flexDirection: 'row' },
  profileLeft: { flex: 1, flexDirection: 'row', marginTop: 8 },
  profileRight: { alignItems: 'center', justifyContent: 'center', paddingLeft: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E4F2E4' },
  name: { fontSize: 16, fontWeight: '800', color: COLORS.ink },
  email: { fontSize: 12, color: COLORS.sub, marginTop: 2 },
  planetBadge: { width: 56, height: 74 },
  editBtn: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F1F6F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4E2D8',
  },
  editBtnText: { fontSize: 11, color: COLORS.ink, fontWeight: '700' },

  /* History */
  historyRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, paddingVertical: 10 },
  hIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8EFE9' },
  hTitle: { fontSize: 14, fontWeight: '800', color: COLORS.ink },
  hDate: { fontSize: 11, color: COLORS.sub, marginTop: 2 },
  hPoint: { fontSize: 16, fontWeight: '900', color: COLORS.green, marginLeft: 8 },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 6 },

  /* Badges */
  badgeArea: { position: 'relative', marginBottom: GAP, paddingBottom: 2, minHeight: BADGE_SIZE + 26 },
  ribbonImg: {
    position: 'absolute',
    left: -SP,
    right: -SP,
    top: BADGE_SIZE / 2 - RIBBON_H / 2,
    height: RIBBON_H,
    zIndex: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  badgeItem: { alignItems: 'center', width: 70 },
  badgeImage: { width: BADGE_SIZE, height: BADGE_SIZE },
  badgeName: { fontSize: 12, fontWeight: '600', color: COLORS.ink, marginTop: 6 },
  badgeDate: { fontSize: 10, color: COLORS.sub, marginTop: 2 },

  /* CTA */
  cta: {
    marginTop: GAP,
    backgroundColor: COLORS.green,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    width: 160,
    alignSelf: 'center',
    ...shadow,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});

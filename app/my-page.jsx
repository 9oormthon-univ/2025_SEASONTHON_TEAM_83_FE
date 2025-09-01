import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { memo, default as React } from 'react';
import { BackHandler, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';

export default function MyPageScreen() {
  const router = useRouter();

  // 뒤로가기 이벤트 처리
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      // cleanup 함수 반환
      return () => subscription.remove();
    }, [router])
  );

  // UI 반환
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}


const SP = 20;           // horizontal padding
const GAP = 16;          // vertical gap
const R = 14;            // card radius
const BADGE_SIZE = 88;   // badge image size
const RIBBON_H = 24;     // ribbon height
const HEADER_H = 88;     // header content height (excluding notch)

const COLORS = {
  bg: '#EDE4CC',
  header: '#0F3A2D',
  card: '#FFFFFF',
  ink: '#1F2A22',
  sub: '#7A8B83',
  green: '#0F6D52',
  line: '#EAEFE7',
  ivory: '#FFF7D6',
};

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 2 },
});

/* =========================
 * Mock Data
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
 * Header
 * ======================= */
function Header() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerRoot, { height: insets.top + HEADER_H }]}>
      <Image source={require('../assets/images/bar_green.png')} style={styles.headerBg} resizeMode="stretch" />
      <View style={[styles.headerRow, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => console.log('Back')}>
          <Image source={require('../assets/images/icon_back_button.png')} style={styles.iconImg} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>My Page</Text>

        <TouchableOpacity onPress={() => console.log('Bell')}>
          <Image source={require('../assets/images/icon_alarm.png')} style={styles.iconImg} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =========================
 * History
 * ======================= */
const HistoryItem = memo(function HistoryItem({ item, isLast }) {
  return (
    <View>
      <View style={styles.historyRow}>
        <Image source={item.icon} style={[styles.hIcon, item.dim && { opacity: 0.35 }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.hTitle, item.dim && { opacity: 0.5 }]}>{item.title}</Text>
          <Text style={[styles.hDate, item.dim && { opacity: 0.5 }]}>{item.date}</Text>
        </View>
        <Text style={[styles.hPoint, item.dim && { opacity: 0.45 }]}>{item.point}</Text>
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
      <Image source={require('../assets/images/bar_green.png')} style={styles.ribbonImg} resizeMode="stretch" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgeScroll}
        style={{ zIndex: 1 }}
      >
        {badges.map((b) => (
          <View key={b.id} style={styles.badgeItem}>
            <Image source={b.src} style={styles.badgeImage} resizeMode="contain" />
            <Text style={styles.badgeName}>{b.name}</Text>
            <Text style={styles.badgeDate}>{b.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* =========================
 * Tab
 * ======================= */
const TabItem = memo(function TabItem({ label, active }) {
  return (
    <View style={styles.tabItem}>
      {active && <View style={styles.tabDot} />}
      <Text style={[styles.tabText, active && { fontWeight: '700' }]}>{label}</Text>
    </View>
  );
});

/* =========================
 * Screen
 * ======================= */
function Screen() {
  const [fontsLoaded] = useFonts({
    LeantheWall: require('../assets/fonts/109LeantheWall.ttf'),
  });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Android: transparent + overlay */}
      <StatusBar
        translucent={Platform.OS === 'android'}
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Header />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: SP, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={[styles.card, { marginTop: SP }]}>
          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <Image source={require('../assets/images/icon_level1.png')} style={styles.avatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.name}>닉네임</Text>
                <Text style={styles.email}>이메일@naver.com</Text>
              </View>
            </View>
            <View style={styles.profileRight}>
              <Image source={require('../assets/images/icon_pleanet_logo.png')} style={styles.planetBadge} resizeMode="contain" />
              <TouchableOpacity style={styles.editBtn}>
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
        <TouchableOpacity style={styles.cta}>
          <Text style={styles.ctaText}>나의 숲</Text>
        </TouchableOpacity>

        {/* Bottom Tab (mock) */}
          
      </ScrollView>
      <CustomTabBar />
    </SafeAreaView>
  );
}

/* =========================
 * App Root
 * ======================= */


/* =========================
 * Styles
 * ======================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  /* Header */
  headerRoot: { position: 'relative' },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  iconImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: COLORS.ivory, // 컬러 PNG면 제거
  },
  headerTitle: {
    flexShrink: 1,
    textAlign: 'center',
    fontFamily: 'LeantheWall',
    fontSize: 34,
    color: COLORS.ivory,
    letterSpacing: 1,
    includeFontPadding: false,
  },

  /* Card & Common */
  card: {
    backgroundColor: COLORS.card,
    borderRadius: R,
    padding: 16,
    marginBottom: GAP,
    ...shadow,
  },

  /* Profile */
  profileRow: { flexDirection: 'row' },
  profileLeft: { flex: 1, flexDirection: 'row', marginTop: 20 },
  profileRight: { alignItems: 'center', justifyContent: 'center', paddingLeft: 12 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#E4F2E4' },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.ink },
  email: { fontSize: 13, color: COLORS.sub, marginTop: 4 },
  planetBadge: { width: 76, height: 101 },
  editBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#F1F6F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4E2D8',
  },
  editBtnText: { fontSize: 12, color: COLORS.ink, fontWeight: '700' },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.ink, marginBottom: 12, marginTop: 6 },

  /* History */
  historyRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingVertical: 14 },
  hIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8EFE9' },
  hTitle: { fontSize: 16, fontWeight: '800', color: COLORS.ink },
  hDate: { fontSize: 12, color: COLORS.sub, marginTop: 4 },
  hPoint: { fontSize: 18, fontWeight: '900', color: COLORS.green, marginLeft: 10 },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 8 },

  /* Badges */
  badgeArea: { position: 'relative', marginBottom: GAP, paddingBottom: 4, minHeight: BADGE_SIZE + 44 },
  ribbonImg: {
    position: 'absolute',
    left: -SP,
    right: -SP,
    top: BADGE_SIZE / 2 - RIBBON_H / 2,
    height: RIBBON_H,
    zIndex: 0,
  },
  badgeScroll: { paddingHorizontal: 24, columnGap: 28, zIndex: 1 },
  badgeItem: { alignItems: 'center' },
  badgeImage: { width: BADGE_SIZE, height: BADGE_SIZE },
  badgeName: { fontSize: 14, fontWeight: '600', color: COLORS.ink, marginTop: 8 },
  badgeDate: { fontSize: 12, color: COLORS.sub, marginTop: 2 },

  /* CTA */
  cta: {
    marginTop: GAP,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    width: 200,
    alignSelf: 'center',
    ...shadow,
  },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '900' },

  /* Tabs */
  tabbar: {
    marginTop: GAP,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabItem: { alignItems: 'center', minWidth: 90 },
  tabText: { color: COLORS.ink, fontSize: 14 },
  tabDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.green, marginBottom: 4 },
});

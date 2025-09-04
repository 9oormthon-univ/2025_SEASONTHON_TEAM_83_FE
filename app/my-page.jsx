// app/my-page.jsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    BackHandler,
    Platform,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ActionButton';
import BadgeStrip from '../components/BadgeStrip';
import CustomTabBar from '../components/CustomTabBar';
import HeaderBar from '../components/HeaderBar';
import HistoryList from '../components/HistoryList';
import ProfileCard from '../components/ProfileCard';
import { PROFILE_COLORS, PROFILE_SIZES } from '../constants/ProfileConstants';

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
 * Screen
 * ======================= */
function Screen() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleMyForest = () => {
    router.push('/my-forest');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="light-content" />
      
      <HeaderBar title="My Page" />

      <View style={styles.content}>
        <ProfileCard
          avatar={require('../assets/images/icon_level1.png')}
          name="닉네임"
          email="이메일@naver.com"
          badge={require('../assets/images/icon_pleanet_logo.png')}
          onEditPress={handleEditProfile}
        />

        <HistoryList data={HISTORY} title="적립 내역" />
        <BadgeStrip badges={BADGES} title="보유 뱃지" />

        <ActionButton
          title="나의 숲"
          onPress={handleMyForest}
          variant="cta"
          style={styles.ctaButton}
        />
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
  safe: { 
    flex: 1, 
    backgroundColor: PROFILE_COLORS.bg 
  },
  content: {
    flex: 1,
    paddingHorizontal: PROFILE_SIZES.SP,
    paddingBottom: 10,
    justifyContent: 'flex-start',
  },
  ctaButton: {
    marginTop: PROFILE_SIZES.GAP,
  },
});

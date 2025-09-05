// app/my-page.jsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
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
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/api';

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
  const { logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 유저 정보 조회
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserProfile();
      
      if (response.isSuccess) {
        setUserProfile(response.result);
      } else {
        setError('유저 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('유저 정보 조회 에러:', err);
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 유저 정보 조회
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 페이지 포커스 시 유저 정보 새로고침 (수정 후 돌아올 때)
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleMyForest = () => {
    router.push('/my-forest');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await logout();
              if (result.success) {
                router.replace('/login');
              } else {
                Alert.alert('오류', result.error || '로그아웃 중 오류가 발생했습니다.');
              }
            } catch (error) {
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  // 로딩 상태
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="light-content" />
        <HeaderBar title="My Page" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>유저 정보를 불러오는 중...</Text>
        </View>
        <CustomTabBar />
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="light-content" />
        <HeaderBar title="My Page" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <ActionButton
            title="다시 시도"
            onPress={fetchUserProfile}
            variant="cta"
            style={styles.retryButton}
          />
        </View>
        <CustomTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="light-content" />
      
      <HeaderBar title="My Page" />

      <View style={styles.content}>
        <ProfileCard
          avatar={require('../assets/images/icon_level1.png')}
          name={userProfile?.nickname || "닉네임"}
          email={userProfile?.email || "이메일@naver.com"}
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

        <ActionButton
          title="로그아웃"
          onPress={handleLogout}
          variant="cta"
          style={styles.logoutButton}
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
  logoutButton: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PROFILE_SIZES.SP,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PROFILE_SIZES.SP,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 10,
  },
});

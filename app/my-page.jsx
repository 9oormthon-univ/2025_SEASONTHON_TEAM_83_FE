// app/my-page.jsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ActionButton from '../components/ActionButton';
import BadgeStrip from '../components/BadgeStrip';
import CustomTabBar from '../components/CustomTabBar';
// import HistoryList from '../components/HistoryList'; // 포인트 화면과 동일한 로직 사용
import ProfileCard from '../components/ProfileCard';
import { PROFILE_COLORS, PROFILE_SIZES } from '../constants/ProfileConstants';
import { useAuth } from '../contexts/AuthContext';
import { usePoint } from '../contexts/PointContext';
import { getUserProfile } from '../services/api';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

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
  const { history: pointHistory, loading: pointLoading, refreshPoints } = usePoint();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 포인트 내역 로드
  useEffect(() => {
    refreshPoints();
  }, [refreshPoints]);

  // 포인트 히스토리 아이템 렌더링 (포인트 화면과 동일한 로직)
  const renderHistoryItem = (item, index) => {
    const getIconSource = (type) => {
      switch (type?.toUpperCase()) {
        case 'WALK':
        case 'WALKING':
          return require('../assets/images/icon_walk.png');
        case 'TUMBLER':
        case 'TUMBLR':
          return require('../assets/images/icon_tumblr.png');
        case 'ATTENDANCE':
        case 'CHECK_IN':
          return require('../assets/images/icon_calendar.png');
        case 'CHALLENGE':
          return require('../assets/images/icon_badge.png');
        case 'GENERAL':
        default:
          return require('../assets/images/icon_point.png');
      }
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (_error) {
        return dateString || '날짜 정보 없음';
      }
    };

    // 포인트 변화 표시
    const formatPointChange = (pointChange) => {
      const points = pointChange || 0;
      return points > 0 ? `+${points}p` : `${points}p`;
    };

    return (
      <View key={item.id || `history_${index}_${item.date}`} style={styles.historyItem}>
        <View style={styles.itemLeft}>
          <Image source={getIconSource(item.type)} style={styles.itemIcon} />
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.description || item.title || '포인트 적립'}</Text>
            <Text style={styles.itemDate}>{formatDate(item.createdAt || item.date)}</Text>
          </View>
        </View>
        <Text style={styles.itemPoint}>{formatPointChange(item.pointChange)}</Text>
      </View>
    );
  };

  // 포인트 내역 리스트 렌더링
  const historyList = pointHistory && pointHistory.length > 0 
    ? pointHistory.map((item, index) => renderHistoryItem(item, index))
    : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>포인트 내역이 없습니다.</Text>
        </View>
      );

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
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Image
            style={styles.headerBackground}
            source={require('../assets/images/bar_green.png')}
          />
          
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Image
              source={require('../assets/images/icon_back_button.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          
          {/* 중앙 로고 */}
          <View style={styles.headerLogoContainer}>
            <Image
              source={icon_pleanet_logo}
              style={styles.headerLogo}
            />
          </View>
          
          {/* 알림 버튼 */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Image
              source={require('../assets/images/icon_alarm.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>유저 정보를 불러오는 중...</Text>
        </View>
        <CustomTabBar />
      </View>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <View style={styles.container}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Image
            style={styles.headerBackground}
            source={require('../assets/images/bar_green.png')}
          />
          
          {/* 뒤로가기 버튼 */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Image
              source={require('../assets/images/icon_back_button.png')}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          
          {/* 중앙 로고 */}
          <View style={styles.headerLogoContainer}>
            <Image
              source={icon_pleanet_logo}
              style={styles.headerLogo}
            />
          </View>
          
          {/* 알림 버튼 */}
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Image
              source={require('../assets/images/icon_alarm.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Image
          style={styles.headerBackground}
          source={require('../assets/images/bar_green.png')}
        />
        
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('../assets/images/icon_back_button.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        
        {/* 중앙 로고 */}
        <View style={styles.headerLogoContainer}>
          <Image
            source={icon_pleanet_logo}
            style={styles.headerLogo}
          />
        </View>
        
        {/* 알림 버튼 */}
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <Image
            source={require('../assets/images/icon_alarm.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ProfileCard
          avatar={require('../assets/images/icon_level1.png')}
          name={userProfile?.nickname || "닉네임"}
          email={userProfile?.email || "이메일@naver.com"}
          badge={require('../assets/images/icon_pleanet_logo.png')}
          onEditPress={handleEditProfile}
        />

        {/* 적립 내역 섹션 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>적립 내역</Text>
          <ScrollView 
            style={styles.historyCard}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {pointLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#006256" />
                <Text style={styles.loadingText}>포인트 내역을 불러오는 중...</Text>
              </View>
            ) : (
              historyList
            )}
          </ScrollView>
        </View>
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
    </View>
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

  return <Screen />;
}

/* =========================
 * Styles
 * ======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
  },
  header: {
    position: 'relative',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 70,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerLogoContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 50,
  },
  headerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    top: 70,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
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
  // 포인트 내역 스타일 (포인트 화면과 동일)
  historySection: {
    marginBottom: 30,
  },
  historyTitle: {
    width: 140,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 20,
    marginTop:20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
  },
  itemPoint: {
    fontSize: 14,
    fontWeight: '700',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Pretendard Variable',
  },
});

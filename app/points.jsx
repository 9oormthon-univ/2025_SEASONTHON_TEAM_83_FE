import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../contexts/AuthContext';
import { usePoint } from '../contexts/PointContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function PointsScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    balance, 
    history, 
    loading, 
    error, 
    refreshPoints, 
    clearError 
  } = usePoint();
  
  // 로컬 상태로 안정적인 UI 관리
  const [isInitialized, setIsInitialized] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [displayHistory, setDisplayHistory] = useState(history);
  const [displayLoading, setDisplayLoading] = useState(loading);

  // 상태 동기화 - 깜빡거림 방지 (디바운싱 적용)
  useEffect(() => {
    if (!isInitialized) {
      // 초기 로딩 상태 설정
      setDisplayLoading(true);
      setIsInitialized(true);
      return;
    }

    // 디바운싱을 위한 타이머
    const timer = setTimeout(() => {
      if (!loading) {
        // 로딩이 완료되었을 때만 상태 업데이트
        setDisplayLoading(false);
        setDisplayBalance(balance);
        setDisplayHistory(history);
      }
    }, 100); // 100ms 디바운싱

    return () => clearTimeout(timer);
  }, [loading, balance, history, isInitialized]);

  // 인증 상태 확인
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('인증되지 않은 사용자 - 로그인 화면으로 이동');
      Alert.alert(
        '로그인 필요',
        '포인트 정보를 확인하려면 로그인이 필요합니다.',
        [
          {
            text: '로그인하기',
            onPress: () => router.push('/login')
          },
          {
            text: '취소',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    }
  }, [isAuthenticated, authLoading, router]);

  // 컴포넌트 마운트 시 포인트 데이터 로드 (인증된 사용자만)
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('포인트 화면 마운트 - API 호출 시작');
      refreshPoints();
    }
  }, [refreshPoints, isAuthenticated, authLoading]); // refreshPoints는 useCallback으로 안정화됨

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('포인트 상태 업데이트:', { balance, history, loading, error });
  }, [balance, history, loading, error]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      const isServerError = error.includes('서버') || error.includes('관리자');
      
      Alert.alert(
        isServerError ? '서버 오류' : '오류', 
        isServerError 
          ? '서버가 일시적으로 불안정합니다.\n잠시 후 다시 시도해주세요.'
          : error,
        [
          {
            text: '다시 시도',
            onPress: () => {
              clearError();
              refreshPoints();
            }
          },
          {
            text: '확인',
            onPress: clearError,
            style: 'cancel'
          }
        ]
      );
    }
  }, [error, clearError, refreshPoints]); // 필요한 함수들을 의존성에 포함

  // 포인트 히스토리 아이템 렌더링 (useMemo로 최적화)
  const renderHistoryItem = useMemo(() => {
    const renderItem = (item, index) => {
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
          <View style={styles.itemIcon}>
            <Image 
              source={getIconSource(item.type)} 
              style={styles.iconImage}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.description || '포인트 획득'}</Text>
            <Text style={styles.itemSubtitle}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <Text style={[
          styles.itemPoints,
          (item.pointChange || 0) < 0 && styles.itemPointsNegative
        ]}>
          {formatPointChange(item.pointChange)}
        </Text>
      </View>
    );
    };
    
    return renderItem;
  }, []);

  // 히스토리 리스트 최적화 - 로컬 상태 사용
  const historyList = useMemo(() => {
    if (displayLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006256" />
          <Text style={styles.loadingText}>포인트 내역을 불러오는 중...</Text>
        </View>
      );
    }
    
    if (displayHistory.length > 0) {
      return displayHistory.map((item, index) => renderHistoryItem(item, index));
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>포인트 내역이 없습니다.</Text>
      </View>
    );
  }, [displayLoading, displayHistory, renderHistoryItem]);

  // 인증 로딩 중이거나 인증되지 않은 경우 처리
  if (authLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006256" />
          <Text style={styles.loadingText}>인증 상태 확인 중...</Text>
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로그인이 필요합니다.</Text>
        </View>
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
        {/* 보유 포인트 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>보유 포인트</Text>
        </View>

        {/* 현재 묘목 단계 섹션 */}
        <View style={styles.seedlingSection}>
          <Text style={styles.seedlingTitle}>현재 묘목 단계</Text>
          <View style={styles.levelContainer}>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>새싹 전</Text>
              <View style={[styles.levelIcon, displayBalance.currentLevel === '새싹 전' && styles.activeLevelIcon]}>
                <Text style={[styles.levelIconText, displayBalance.currentLevel === '새싹 전' && styles.activeLevelIconText]}>🌱</Text>
              </View>
            </View>
            <View style={styles.levelArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>새싹</Text>
              <View style={[styles.levelIcon, displayBalance.currentLevel === '새싹' && styles.activeLevelIcon]}>
                <Text style={[styles.levelIconText, displayBalance.currentLevel === '새싹' && styles.activeLevelIconText]}>🌿</Text>
              </View>
            </View>
            <View style={styles.levelArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>묘목</Text>
              <View style={[styles.levelIcon, displayBalance.currentLevel === '묘목' && styles.activeLevelIcon]}>
                <Text style={[styles.levelIconText, displayBalance.currentLevel === '묘목' && styles.activeLevelIconText]}>🌱</Text>
              </View>
            </View>
            <View style={styles.levelArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.levelItem}>
              <Text style={styles.levelLabel}>나무</Text>
              <View style={[styles.levelIcon, displayBalance.currentLevel === '나무' && styles.activeLevelIcon]}>
                <Text style={[styles.levelIconText, displayBalance.currentLevel === '나무' && styles.activeLevelIconText]}>🌳</Text>
              </View>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(displayBalance.progressToNextLevel * 100, 100)}%` }]} />
            </View>
          </View>
          <Text style={styles.progressText}>
            다음 단계까지 {Math.round(displayBalance.progressToNextLevel * 100)}% 진행
          </Text>
        </View>

        {/* 포인트 획득 내역 섹션 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>포인트 획득 내역</Text>
          <ScrollView 
            style={styles.historyCard}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {historyList}
          </ScrollView>
        </View>

        {/* 포인트 정보 */}
        <View style={styles.pointsInfo}>
          <Text style={styles.currentPoints}>
            보유 포인트: <Text style={styles.pointsValue}>{displayBalance.currentPoints.toLocaleString()}p</Text>
          </Text>
          <Text style={styles.totalPoints}>누적 획득: {displayBalance.totalEarnedPoints.toLocaleString()}p</Text>
          <Text style={styles.levelInfo}>현재 레벨: {displayBalance.currentLevel}</Text>
        </View>


        {/* 리워드 전환 버튼 */}
        <TouchableOpacity style={styles.rewardButton} onPress={() => router.push('/reward-conversion')}>
          <Text style={styles.rewardButtonText}>리워드 전환</Text>
        </TouchableOpacity>
      </View>
      
      <CustomTabBar />
    </View>
  );
}

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: -20, // 양쪽으로 꽉 채우기
  },
  titlePattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall', // 시스템 기본 폰트 사용
    zIndex: 1,
  },
  seedlingSection: {
    marginBottom: 20,
  },
  seedlingTitle: {
    width: 140,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  levelItem: {
    alignItems: 'center',
    flex: 1,
  },
  levelLabel: {
    fontSize: 12,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  levelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  activeLevelIcon: {
    backgroundColor: '#006256',
    borderColor: '#006256',
  },
  levelIconText: {
    fontSize: 24,
    color: '#999999',
  },
  activeLevelIconText: {
    color: '#FFFFFF',
  },
  levelArrow: {
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006256',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  historySection: {
    marginBottom: 30,
  },
  historyTitle: {
    width: 140,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: 200, // 높이 제한
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#666666',
  },
  itemPoints: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#006256',
  },
  itemPointsNegative: {
    color: '#FF6B6B',
  },
  pointsInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  currentPoints: {
    fontSize: 16,
    fontFamily: 'System',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 10,
  },
  pointsValue: {
    fontWeight: '700',
    color: '#0061E9',
  },
  totalPoints: {
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 18,
    fontFamily: 'System',
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 5,
  },
  levelInfo: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#006256',
    textAlign: 'center',
    fontWeight: '600',
  },
  rewardButton: {
    width: '100%',
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  rewardButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#666666',
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#666666',
  },
  testButton: {
    backgroundColor: '#FF6B6B',


    
    marginBottom: 10,
  },
});


import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { usePoint } from '../contexts/PointContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function PointsScreen() {
  const router = useRouter();
  const { balance, history, loading, error, fetchBalance, fetchHistory, refreshPoints } = usePoint();

  // 컴포넌트 마운트 시 포인트 데이터 로드
  useEffect(() => {
    console.log('포인트 화면 마운트 - API 호출 시작');
    refreshPoints();
  }, []);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('포인트 상태 업데이트:', { balance, history, loading, error });
  }, [balance, history, loading, error]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      Alert.alert('오류', error);
    }
  }, [error]);

  // 포인트 히스토리 아이템 렌더링
  const renderHistoryItem = (item, index) => {
    const getIconSource = (type) => {
      switch (type) {
        case 'WALK':
          return require('../assets/images/icon_walk.png');
        case 'TUMBLER':
          return require('../assets/images/icon_tumblr.png');
        case 'ATTENDANCE':
          return require('../assets/images/icon_calendar.png');
        default:
          return require('../assets/images/icon_badge.png');
      }
    };

    return (
      <View key={index} style={styles.historyItem}>
        <View style={styles.itemLeft}>
          <View style={styles.itemIcon}>
            <Image 
              source={getIconSource(item.type)} 
              style={styles.iconImage}
            />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.description}</Text>
            <Text style={styles.itemSubtitle}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.itemPoints}>+{item.pointChange}p</Text>
      </View>
    );
  };

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
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${balance.progressToNextLevel * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>다음 단계까지 {Math.round(balance.progressToNextLevel * 100)}%</Text>
          </View>
        </View>

        {/* 포인트 획득 내역 섹션 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>포인트 획득 내역</Text>
          <ScrollView 
            style={styles.historyCard}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#006256" />
                <Text style={styles.loadingText}>포인트 내역을 불러오는 중...</Text>
              </View>
            ) : history.length > 0 ? (
              history.map((item, index) => renderHistoryItem(item, index))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>포인트 내역이 없습니다.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 포인트 정보 */}
        <View style={styles.pointsInfo}>
          <Text style={styles.currentPoints}>
            보유 포인트는 <Text style={styles.pointsValue}>{balance.currentPoints}p</Text> 입니다
          </Text>
          <Text style={styles.totalPoints}>누적 포인트 {balance.totalEarnedPoints}p</Text>
        </View>

        {/* 테스트 버튼 */}
        <TouchableOpacity 
          style={[styles.rewardButton, styles.testButton]} 
          onPress={refreshPoints}
        >
          <Text style={styles.rewardButtonText}>포인트 새로고침</Text>
        </TouchableOpacity>

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
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  seedlingSection: {
    marginBottom: 20,
  },
  seedlingTitle: {
    width: 112,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 11,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginRight: 15,
    overflow: 'hidden',
  },
  progressFill: {
    width: '90%',
    height: '100%',
    backgroundColor: '#006256',
    borderRadius: 6,
  },
  progressText: {
    width: 79,
    fontSize: 10,
    letterSpacing: -0.1,
    lineHeight: 28,
    fontFamily: 'Pretendard Variable',
    color: '#525252',
    textAlign: 'right',
  },
  historySection: {
    marginBottom: 30,
  },
  historyTitle: {
    width: 129,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
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
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
  },
  itemPoints: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#006256',
  },
  pointsInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  currentPoints: {
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 10,
  },
  pointsValue: {
    fontWeight: '700',
    color: '#0061E9',
  },
  totalPoints: {
    width: 110,
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 18,
    fontFamily: 'Pretendard Variable',
    color: '#6B6B6B',
    textAlign: 'center',
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
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
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
    fontFamily: 'Pretendard Variable',
    color: '#666666',
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    marginBottom: 10,
  },
});

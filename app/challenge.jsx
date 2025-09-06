import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../contexts/AuthContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeScreen() {
  const router = useRouter();
  const { getChallenges, getLatestChallenge } = useAuth();
  
  console.log('🔍 getLatestChallenge 함수 확인:', typeof getLatestChallenge);
  
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  // 챌린지 목록 로드
  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      
      // 실제 API 호출
      const response = await getChallenges();
      
      if (response.success) {
        console.log('챌린지 목록 로드 성공:', response.data);
        // 페이지네이션 구조에서 content 배열 추출
        const challengesList = response.data.content || response.data;
        setChallenges(challengesList);
        if (challengesList.length > 0) {
          setCurrentChallenge(challengesList[0]); // 첫 번째 챌린지를 현재 챌린지로 설정
        }
      } else {
        console.error('챌린지 목록 로드 실패:', response.error);
        Alert.alert('오류', response.error || '챌린지 목록을 불러올 수 없습니다.');
      }
      
    } catch (error) {
      console.error('챌린지 목록 로드 실패:', error);
      Alert.alert('오류', '챌린지 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 최근 선택한 챌린지 로드
  const loadRecentChallenges = async (count = 5) => {
    console.log('🚨 loadRecentChallenges 함수 시작!');
    try {
      console.log(`🔄 loadRecentChallenges 함수 호출됨 - count: ${count}`);
      setRecentLoading(true);
      console.log(`🔄 최근 챌린지 ${count}개 로드 시작`);
      console.log('🚨 getLatestChallenge 호출 직전');
      const response = await getLatestChallenge(count);
      console.log('🚨 getLatestChallenge 호출 완료');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // API에서 받은 배열 데이터를 그대로 사용
        const recentChallengesList = response.data.map((challenge, index) => ({
          id: challenge.id || index + 1,
          title: challenge.title,
          date: challenge.endedAt ? 
            new Date(challenge.endedAt).toLocaleDateString('ko-KR') : 
            '진행 중',
          icon: challenge.icon
        }));
        setRecentChallenges(recentChallengesList);
      } else {
        console.log('최근 챌린지 없음 또는 로드 실패:', response.error);
        setRecentChallenges([]);
      }
    } catch (error) {
      console.error('최근 챌린지 로드 중 오류:', error);
      setRecentChallenges([]);
    } finally {
      setRecentLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    console.log('🚀 useEffect 실행 - 컴포넌트 마운트');
    console.log('🚀 loadChallenges 호출');
    loadChallenges();
    console.log('🚀 loadRecentChallenges 호출');
    loadRecentChallenges();
    console.log('🚀 useEffect 완료');
  }, []);

  // 화면이 포커스될 때마다 최근 챌린지 새로고침
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 챌린지 화면 포커스 - 최근 챌린지 새로고침');
      loadRecentChallenges(5); // 5개 가져오기
    }, [])
  );

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 오늘의 챌린지 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>오늘의 챌린지</Text>
        </View>

        {/* 챌린지 카드들 */}
        <View style={styles.challengeCards}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#006256" />
              <Text style={styles.loadingText}>챌린지 목록을 불러오는 중...</Text>
            </View>
          ) : (
            challenges && challenges.length > 0 ? challenges.map((challenge) => (
              <TouchableOpacity 
                key={challenge.challengeId}
                style={styles.challengeCard}
                onPress={() => {
                  if (challenge.challengeId === 1) {
                    router.push('/challenge-walk');
                  } else if (challenge.challengeId === 2) {
                    router.push('/challenge-tumbler');
                  }
                }}
              >
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Image 
                  style={styles.challengeImage}
                  source={require('../assets/images/walk_challenge.png')}
                  resizeMode="cover"
                />
                <Text style={styles.challengePoints}>{challenge.point}p</Text>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>챌린지가 없습니다.</Text>
              </View>
            )
          )}
        </View>

        {/* 최근 선택한 챌린지 섹션 */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>최근 선택한 챌린지</Text>
          
          {/* 최근 챌린지 리스트 */}
          {recentLoading ? (
            <View style={styles.recentLoadingContainer}>
              <ActivityIndicator size="small" color="#006256" />
              <Text style={styles.recentLoadingText}>최근 챌린지 로딩 중...</Text>
            </View>
          ) : recentChallenges.length > 0 ? (
            recentChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.recentChallengeItem}>
                <View style={styles.recentChallengeIcon}>
                  <Image 
                    source={challenge.icon} 
                    style={styles.recentIcon} 
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.recentChallengeInfo}>
                  <Text style={styles.recentChallengeTitle}>{challenge.title}</Text>
                  <Text style={styles.recentChallengeDate}>{challenge.date}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.recentEmptyContainer}>
              <Text style={styles.recentEmptyText}>최근 선택한 챌린지가 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
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
    marginHorizontal: -20,
  },
  titlePattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    bottom: 0,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  challengeCards: {
    marginBottom: 10,
  },
  challengeCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
    position: 'relative',
  },
  challengeTitle: {
    fontSize: 18,
    letterSpacing: -0.2,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 8,
  },
  challengeImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 25,
  },
  challengePoints: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
  },
  recentSection: {
    marginBottom: 100,
  },
  recentTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 15,
  },

  recentChallengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentChallengeIcon: {
    alignItems: 'center',
    marginRight: 15,
  },
  recentIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  recentIconText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  recentChallengeInfo: {
    flex: 1,
  },
  recentChallengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 5,
  },
  recentChallengeDate: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
  },
  recentLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  recentLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  recentEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  recentEmptyText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Pretendard Variable',
  },
});

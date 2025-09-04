import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../contexts/AuthContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeScreen() {
  const router = useRouter();
  const { getChallenges } = useAuth();
  
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  // 최근 선택한 챌린지 데이터 (스크롤 가능하도록 여러 개 생성)
  const recentChallenges = [
    {
      id: 1,
      title: '걷기 1.3Km 인증',
      date: '2025-01-15',
      icon: require('../assets/images/icon_walk.png')
    },
    {
      id: 2,
      title: '텀블러 사용 인증',
      date: '2025-01-14',
      icon: require('../assets/images/icon_tumblr.png')
    },
    {
      id: 3,
      title: '1Km 이상 걷기 인증',
      date: '2025-01-13',
      icon: require('../assets/images/icon_walk.png')
    },
    {
      id: 4,
      title: '친환경 제품 사용',
      date: '2025-01-12',
      icon: require('../assets/images/icon_earth.png')
    },
    {
      id: 5,
      title: '대중교통 이용',
      date: '2025-01-11',
      icon: require('../assets/images/icon_earth.png')
    }
  ];

  // 챌린지 목록 로드
  const loadChallenges = async () => {
    try {
      setIsLoading(true);
      
      // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
      // const response = await getChallenges();
      
      // 임시: 서버 없이 성공 시뮬레이션
      console.log('임시 챌린지 목록 로드');
      
      // 1초 지연으로 로딩 상태 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 데이터
      const tempChallenges = [
        {
          challengeId: 1,
          title: "1km 걷기",
          imageUrl: "/uploads/challenge1.png",
          point: 20,
          description: "최소 1km 이상 보행 시 성공 처리||GPS 기반으로 사용자의 이동 경로 기록",
          totalDistance: 0.0,
          requiredDistance: 1.0,
          remainingDistance: 1.0,
          pathCount: 0,
          status: "NOT_STARTED"
        },
        {
          challengeId: 2,
          title: "텀블러 사용",
          imageUrl: "/uploads/challenge2.png",
          point: 50,
          description: "테이크아웃 또는 매장에서 음료를 받을 때||카페 영수증 + 텀블러 사진 제출 (1회 주문당 1회 인정)",
          totalDistance: 0.0,
          requiredDistance: 1.0,
          remainingDistance: 1.0,
          pathCount: 0,
          status: "NOT_STARTED"
        }
      ];
      
      setChallenges(tempChallenges);
      setCurrentChallenge(tempChallenges[0]); // 첫 번째 챌린지를 현재 챌린지로 설정
      
      // 성공 시뮬레이션
      console.log('챌린지 목록 로드 성공');
      
    } catch (error) {
      console.error('챌린지 목록 로드 실패:', error);
      Alert.alert('오류', '챌린지 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadChallenges();
  }, []);

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
            challenges.map((challenge) => (
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
            ))
          )}
        </View>

        {/* 최근 선택한 챌린지 섹션 */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>최근 선택한 챌린지</Text>
          
          {/* 최근 챌린지 리스트 */}
          {recentChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.recentChallengeItem}>
              <View style={styles.recentChallengeIcon}>
                <Image 
                  source={challenge.icon}
                  style={styles.recentIcon}
                  resizeMode="contain"
                />
                <Text style={styles.recentIconText}>Challenge</Text>
              </View>
              <View style={styles.recentChallengeInfo}>
                <Text style={styles.recentChallengeTitle}>{challenge.title}</Text>
                <Text style={styles.recentChallengeDate}>{challenge.date}</Text>
              </View>
            </View>
          ))}
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
    fontWeight: 'bold',
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
});

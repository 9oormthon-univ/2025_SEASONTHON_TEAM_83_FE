import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../contexts/AuthContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeWalkScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { getChallengeDetail, startChallenge } = useAuth();
  
  const [challengeDetail, setChallengeDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // 챌린지 상세 정보 로드
  const loadChallengeDetail = async () => {
    try {
      setIsLoading(true);
      
      // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
      // const response = await getChallengeDetail(1); // 걷기 챌린지 ID
      
      // 임시: 서버 없이 성공 시뮬레이션
      console.log('임시 챌린지 상세 정보 로드');
      
      // 1초 지연으로 로딩 상태 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 데이터
      const tempChallengeDetail = {
        challengeId: 1,
        title: "1km 걷기",
        imageUrl: "/uploads/challenge1.png",
        point: 20,
        description: "최소 1km 이상 보행 시 성공 처리||GPS 기반으로 사용자의 이동 경로 기록"
      };
      
      setChallengeDetail(tempChallengeDetail);
      
      // 성공 시뮬레이션
      console.log('챌린지 상세 정보 로드 성공');
      
    } catch (error) {
      console.error('챌린지 상세 정보 로드 실패:', error);
      Alert.alert('오류', '챌린지 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 챌린지 시작
  const handleStartChallenge = async () => {
    try {
      setIsStarting(true);
      
      // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
      // const response = await startChallenge(1); // 걷기 챌린지 ID
      
      // 임시: 서버 없이 성공 시뮬레이션
      console.log('임시 챌린지 시작');
      
      // 1초 지연으로 로딩 상태 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 성공 응답 시뮬레이션
      const mockResponse = {
        success: true,
        data: {
          missionStatus: "IN_PROGRESS",
          startedAt: "2025-08-31T19:17:14.1665908"
        }
      };
      
      if (mockResponse.success) {
        console.log('챌린지 시작 성공:', mockResponse.data);
        // 진행 화면으로 이동
        router.push('/challenge-walk-progress');
      } else {
        Alert.alert('오류', mockResponse.error || '챌린지 시작에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('챌린지 시작 실패:', error);
      Alert.alert('오류', '챌린지 시작 중 오류가 발생했습니다.');
    } finally {
      setIsStarting(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadChallengeDetail();
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

        {/* 챌린지 상세 정보 */}
        <View style={styles.challengeDetailSection}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#006256" />
              <Text style={styles.loadingText}>챌린지 정보를 불러오는 중...</Text>
            </View>
          ) : challengeDetail ? (
            <>
              {/* 챌린지 제목 */}
              <Text style={styles.challengeTitle}>{challengeDetail.title}</Text>
              
              {/* 챌린지 이미지 */}
              <View style={styles.imageContainer}>
                <Image 
                  style={styles.challengeImage}
                  source={require('../assets/images/walk_challenge.png')}
                  resizeMode="cover"
                />
                <Text style={styles.challengePoints}>{challengeDetail.point}p</Text>
              </View>
              
              {/* 구분선 */}
              <View style={styles.divider} />
              
              {/* 챌린지 조건 */}
              <View style={styles.conditionSection}>
                <Text style={styles.conditionTitle}>챌린지 조건</Text>
                <Text style={styles.conditionText}>
                  {challengeDetail.description.split('||')[0]}{'\n'}
                  {challengeDetail.description.split('||')[1]}
                </Text>
              </View>
              
              {/* 포인트 지급 기준 */}
              <View style={styles.pointSection}>
                <Text style={styles.pointTitle}>포인트 지급 기준</Text>
                <Text style={styles.pointText}>
                  1. 1km 당 {challengeDetail.point}P{'\n'}
                  2. 하루 1회만 포인트 적립 가능
                </Text>
              </View>
              
              {/* 챌린지 시작 버튼 */}
              <TouchableOpacity 
                style={[styles.startButton, isStarting && styles.disabledButton]}
                onPress={handleStartChallenge}
                disabled={isStarting}
              >
                {isStarting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.startButtonText}>챌린지 시작</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>챌린지 정보를 불러올 수 없습니다.</Text>
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  challengeDetailSection: {
    marginBottom: 100,
  },
  challengeTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  challengeImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  challengePoints: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    fontSize: 16,
    fontWeight: '700',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  conditionSection: {
    marginBottom: 20,
  },
  conditionTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  conditionText: {
    fontSize: 16,
    lineHeight: 18,
    color: '#000',
    fontFamily: 'Pretendard Variable',
  },
  pointSection: {
    marginBottom: 30,
  },
  pointTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  pointText: {
    fontSize: 16,
    lineHeight: 18,
    color: '#6B6B6B',
    fontFamily: 'Pretendard Variable',
  },
  startButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 12,
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
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.6,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    color: '#FF0000',
    textAlign: 'center',
  },
});

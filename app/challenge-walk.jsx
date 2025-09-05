import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
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
  const { getChallengeDetail, startChallenge, sendGpsData } = useAuth();
  
  const [challengeDetail, setChallengeDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState(null); // 챌린지 진행 상태
  const [isInProgress, setIsInProgress] = useState(false); // 진행 중인지 여부
  const [isCheckingStatus, setIsCheckingStatus] = useState(false); // 상태 확인 중인지 여부
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // 챌린지 상태 확인 (GPS 데이터 전송으로)
  const checkChallengeStatus = async () => {
    try {
      setIsCheckingStatus(true);
      
      // 현재 위치를 가져와서 GPS 데이터 전송으로 상태 확인
      const location = await getCurrentLocation();
      if (location) {
        const gpsData = {
          latitude: location.lat,
          longitude: location.lng,
          timestamp: new Date().toISOString(),
          recordedAt: new Date().toISOString(),
          accuracy: 0,
        };
        
        const response = await sendGpsData(1, gpsData);
        if (response.success) {
          console.log('챌린지 상태 확인 성공:', response.data);
          setChallengeStatus(response.data);
          setIsInProgress(response.data.status === 'IN_PROGRESS');
        } else {
          console.log('챌린지 상태 확인 실패:', response.error);
          setIsInProgress(false);
        }
      } else {
        console.log('위치 정보를 가져올 수 없음');
        setIsInProgress(false);
      }
    } catch (error) {
      console.log('챌린지 상태 확인 실패:', error.message);
      setIsInProgress(false);
      setChallengeStatus(null);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // 현재 위치 가져오기 (간단한 버전)
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      return { lat: latitude, lng: longitude };
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      return null;
    }
  };

  // 챌린지 상세 정보 로드
  const loadChallengeDetail = async () => {
    try {
      setIsLoading(true);
      
      // 실제 API 호출
      const response = await getChallengeDetail(1); // 걷기 챌린지 ID
      
      if (response.success) {
        console.log('챌린지 상세 정보 로드 성공:', response.data);
        setChallengeDetail(response.data);
      } else {
        console.error('챌린지 상세 정보 로드 실패:', response.error);
        Alert.alert('오류', response.error || '챌린지 정보를 불러올 수 없습니다.');
      }
      
    } catch (error) {
      console.error('챌린지 상세 정보 로드 실패:', error);
      Alert.alert('오류', '챌린지 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 챌린지 시작/계속하기
  const handleStartChallenge = async () => {
    try {
      setIsStarting(true);
      
      if (isInProgress) {
        // 진행 중인 경우 바로 진행 화면으로 이동
        console.log('진행 중인 챌린지 계속하기');
        router.push('/challenge-walk-progress');
      } else {
        // 새로운 챌린지 시작
        const response = await startChallenge(1); // 걷기 챌린지 ID
        
        if (response.success) {
          console.log('챌린지 시작 성공:', response.data);
          // 진행 화면으로 이동
          router.push('/challenge-walk-progress');
        } else {
          Alert.alert('오류', response.error || '챌린지 시작에 실패했습니다.');
        }
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
    checkChallengeStatus(); // 챌린지 상태 확인
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
              
              {/* 챌린지 상태 확인 로딩 */}
              {isCheckingStatus && (
                <View style={styles.statusLoadingSection}>
                  <ActivityIndicator size="small" color="#006256" />
                  <Text style={styles.statusLoadingText}>현재 진행 중인 챌린지가 있는지 확인 중...</Text>
                </View>
              )}

              {/* 진행 중인 챌린지 상태 표시 */}
              {!isCheckingStatus && isInProgress && challengeStatus && (
                <View style={styles.progressSection}>
                  <Text style={styles.progressTitle}>진행 중인 챌린지</Text>
                  <Text style={styles.progressText}>
                    현재 진행률: {Math.round((challengeStatus.totalDistance / challengeStatus.requiredDistance) * 100)}%{'\n'}
                    걸은 거리: {challengeStatus.totalDistance.toFixed(2)}km / {challengeStatus.requiredDistance}km{'\n'}
                    남은 거리: {challengeStatus.remainingDistance.toFixed(2)}km{'\n'}
                    GPS 포인트 수: {challengeStatus.pathCount}개
                  </Text>
                </View>
              )}

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
                  <Text style={styles.startButtonText}>
                    {isInProgress ? '챌린지 계속하기' : '챌린지 시작'}
                  </Text>
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
  statusLoadingSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLoadingText: {
    fontSize: 14,
    color: '#6B6B6B',
    fontFamily: 'Pretendard Variable',
    marginLeft: 8,
  },
  progressSection: {
    backgroundColor: '#F0F8F7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#006256',
  },
  progressTitle: {
    fontSize: 18,
    letterSpacing: -0.2,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#006256',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2D2D2D',
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

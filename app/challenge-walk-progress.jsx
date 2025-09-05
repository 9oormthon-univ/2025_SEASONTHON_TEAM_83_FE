import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import MapBorder from '../components/MapBorder';
import { useAuth } from '../contexts/AuthContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeWalkProgressScreen() {
  const router = useRouter();
  const { sendGpsData, completeChallenge } = useAuth();
  
  const [challengeData, setChallengeData] = useState({
    totalDistance: 0.0,
    requiredDistance: 1.0,
    remainingDistance: 1.0,
    pathCount: 0,
    status: "IN_PROGRESS"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [pathHistory, setPathHistory] = useState([]); // 이동 경로 히스토리
  const [mapCenter, setMapCenter] = useState(null); // 지도 중심점 (동적으로 설정)
  const [currentAddress, setCurrentAddress] = useState('위치 확인 중...'); // 현재 주소

  // 컴포넌트 마운트 시 초기 위치 가져오기
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          return true;
        } else {
          Alert.alert('위치 권한 필요', 'GPS 추적을 위해 위치 권한이 필요합니다.');
          return false;
        }
      } catch (error) {
        console.error('위치 권한 요청 실패:', error);
        return false;
      }
    };

    const getCurrentLocation = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const { latitude, longitude } = location.coords;
        console.log('현재 위치:', { latitude, longitude });
        
        // 지도 좌표로 변환 (사용자 위치 기준)
        const centerLng = mapCenter ? mapCenter.lng : longitude; // 중심점이 없으면 현재 위치 사용
        const centerLat = mapCenter ? mapCenter.lat : latitude;
        const mapX = 216 + (longitude - centerLng) * 1000;
        const mapY = 200 + (centerLat - latitude) * 1000;
        
        return { x: mapX, y: mapY, lat: latitude, lng: longitude };
      } catch (error) {
        console.error('위치 가져오기 실패:', error);
        return null;
      }
    };

    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        const location = await getCurrentLocation();
        if (location) {
          setCurrentLocation(location);
          setStartLocation(location);
          // 첫 번째 위치를 지도 중심점으로 설정
          setMapCenter({ lat: location.lat, lng: location.lng });
          
          // 초기 위치 주소 설정
          reverseGeocode(location.lat, location.lng).then(address => {
            setCurrentAddress(address);
          });
        }
      }
    };
    
    initializeLocation();
  }, []);

  // 위치 권한 요청
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        return true;
      } else {
        Alert.alert('위치 권한 필요', 'GPS 추적을 위해 위치 권한이 필요합니다.');
        return false;
      }
    } catch (error) {
      console.error('위치 권한 요청 실패:', error);
      return false;
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      console.log('현재 위치:', { latitude, longitude });
      
      // 지도 좌표로 변환 (간단한 변환 - 실제로는 더 정교한 변환이 필요)
      const mapX = 216 + (longitude - 127.0) * 1000; // 서울 기준 대략적 변환
      const mapY = 200 + (37.5 - latitude) * 1000;
      
      return { x: mapX, y: mapY, lat: latitude, lng: longitude };
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      return null;
    }
  };

  // GPS 추적 시작 (실제 GPS 사용)
  const startGpsTracking = async () => {
    try {
      // 위치 권한 확인
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      setIsTracking(true);
      console.log('GPS 추적 시작');

      // 시작 위치 설정
      const startPos = await getCurrentLocation();
      if (startPos) {
        setStartLocation(startPos);
        console.log('시작 위치 설정:', startPos);
      }

      // 위치 추적 시작
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // 2초마다 업데이트
          distanceInterval: 10, // 10m 이동시마다 업데이트
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          console.log('위치 업데이트:', { latitude, longitude });
          
          // 지도 좌표로 변환 (사용자 위치 기준)
          const centerLng = mapCenter ? mapCenter.lng : longitude; // 중심점이 없으면 현재 위치 사용
          const centerLat = mapCenter ? mapCenter.lat : latitude;
          const mapX = 216 + (longitude - centerLng) * 1000;
          const mapY = 200 + (centerLat - latitude) * 1000;
          
          const newLocation = { x: mapX, y: mapY, lat: latitude, lng: longitude };
          setCurrentLocation(newLocation);
          
          // 경로 히스토리에 추가
          setPathHistory(prev => {
            const newPath = [...prev, newLocation];
            // 최대 100개 포인트만 유지 (성능 최적화)
            return newPath.length > 100 ? newPath.slice(-100) : newPath;
          });

          // 현재 위치 주소 업데이트 (역지오코딩)
          reverseGeocode(latitude, longitude).then(address => {
            setCurrentAddress(address);
          });
          
          // 거리 계산 (간단한 계산)
          if (startLocation) {
            const distance = calculateDistance(
              startLocation.lat, startLocation.lng,
              latitude, longitude
            );
            
            setChallengeData(prev => ({
              ...prev,
              totalDistance: Math.min(distance, 1.0),
              remainingDistance: Math.max(0, 1.0 - distance),
              pathCount: prev.pathCount + 1,
            }));
          }

          // GPS 데이터를 서버에 전송
          const gpsData = {
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
            recordedAt: new Date().toISOString(), // 서버에서 요구하는 recordedAt 필드
            accuracy: location.coords.accuracy || 0,
          };
          
          // 서버에 GPS 데이터 전송 (비동기, 에러 무시)
          sendGpsData(1, gpsData).then(response => {
            if (response.success) {
              console.log('GPS 데이터 전송 성공, 챌린지 상태 업데이트:', response.data);
              // 서버에서 받은 챌린지 상태 정보로 UI 업데이트
              setChallengeData(prev => ({
                ...prev,
                totalDistance: response.data.totalDistance || prev.totalDistance,
                requiredDistance: response.data.requiredDistance || prev.requiredDistance,
                remainingDistance: response.data.remainingDistance || prev.remainingDistance,
                pathCount: response.data.pathCount || prev.pathCount,
              }));
            }
          }).catch(error => {
            console.log('GPS 데이터 전송 실패 (무시):', error);
          });
        }
      );

      // 5분 후 자동 완료 (테스트용)
      setTimeout(() => {
        locationSubscription.remove();
        setIsTracking(false);
        console.log('GPS 추적 종료');
      }, 300000);

    } catch (error) {
      console.error('GPS 추적 시작 실패:', error);
      setIsTracking(false);
    }
  };

  // 거리 계산 함수 (Haversine 공식)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // km 단위
  };

  // GPS 추적 중지
  const stopGpsTracking = () => {
    setIsTracking(false);
    console.log('GPS 추적 중지됨');
  };

  // 역지오코딩 (좌표를 주소로 변환)
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (addresses.length > 0) {
        const address = addresses[0];
        const city = address.city || address.district || '';
        const district = address.district || address.subregion || '';
        const street = address.street || address.name || '';
        
        let fullAddress = '';
        if (city && district) {
          fullAddress = `${city} ${district}`;
        } else if (city) {
          fullAddress = city;
        } else if (district) {
          fullAddress = district;
        } else {
          fullAddress = '위치 정보 없음';
        }
        
        return fullAddress;
      }
      return '위치 정보 없음';
    } catch (error) {
      console.error('역지오코딩 실패:', error);
      return '위치 확인 실패';
    }
  };

  // 챌린지 완료 처리
  const handleCompleteChallenge = async () => {
    try {
      setIsCompleting(true);
      
      // 실제 API 호출
      const response = await completeChallenge(1); // 걷기 챌린지 ID
      
      if (response.success) {
        console.log('챌린지 완료 성공:', response.data);
        Alert.alert(
          '챌린지 완료!',
          `${response.data.rewardPoint || 20}포인트를 획득했습니다!`,
          [
            {
              text: '확인',
              onPress: () => router.replace('/home')
            }
          ]
        );
      } else {
        Alert.alert('오류', mockResponse.error || '챌린지 완료에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('챌린지 완료 실패:', error);
      Alert.alert('오류', '챌린지 완료 중 오류가 발생했습니다.');
    } finally {
      setIsCompleting(false);
    }
  };

  // 초기 챌린지 상태 확인 (GPS 데이터 전송으로)
  const initializeChallengeStatus = async () => {
    try {
      // 현재 위치를 가져와서 초기 GPS 데이터 전송
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
          console.log('초기 챌린지 상태 확인:', response.data);
          setChallengeData(prev => ({
            ...prev,
            totalDistance: response.data.totalDistance || 0,
            requiredDistance: response.data.requiredDistance || 1.0,
            remainingDistance: response.data.remainingDistance || 1.0,
            pathCount: response.data.pathCount || 0,
          }));
        }
      }
    } catch (error) {
      console.log('초기 챌린지 상태 확인 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 GPS 추적 시작
  useEffect(() => {
    initializeChallengeStatus(); // 초기 상태 확인
    startGpsTracking();

    // 컴포넌트 언마운트 시 정리
    return () => {
      stopGpsTracking();
    };
  }, []);

  // 챌린지 완료 시 GPS 추적 중지
  useEffect(() => {
    if (challengeData.totalDistance >= challengeData.requiredDistance) {
      stopGpsTracking();
    }
  }, [challengeData.totalDistance, challengeData.requiredDistance]);

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
        {/* 챌린지 진행 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>걷기 챌린지 진행 중</Text>
        </View>

        {/* 진행률 바 */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(challengeData.totalDistance / challengeData.requiredDistance) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {challengeData.totalDistance.toFixed(2)}km / {challengeData.requiredDistance}km
          </Text>
        </View>

        {/* 지도 영역 (커스텀 SVG 테두리) */}
        <View style={styles.mapContainer}>
          <MapBorder 
            pathData="M 268.5 0 L 382 35 L 395 97.5 L 412 157.5 L 395 216.5 L 393.5 218 L 357 233.5 L 343 276.5 L 383 309.5 L 383 437.5 L 379.5 441 L 329.5 481 L 227.5 508 L 220 511.5 L 184.5 573 L 107.5 547 L 102 542.5 L 20 449.5 L 41 361.5 L 43 287.5 L 44 286.5 L 44 261.5 L 45 260.5 L 45 236.5 L 46 235.5 L 46 210.5 L 47 209.5 L 47 184.5 L 48 183.5 L 48 158.5 Q 50.5 157 49 151.5 L 50.5 150 L 91.5 129 L 126 129 L 141 71.5 L 143.5 67 L 217.5 34 L 268.5 0 Z"
            strokeColor="#FFFE4F"
            strokeWidth={3}
            backgroundColor="#E8F5E8"
            showGrid={true}
            showMarkers={true}
            startLocation={startLocation ? { x: startLocation.x, y: startLocation.y } : { x: 216, y: 150 }}
            currentLocation={currentLocation ? { x: currentLocation.x, y: currentLocation.y } : null}
            pathHistory={pathHistory}
            showPath={isTracking}
            pathColor="#006256"
            pathWidth={3}
            backgroundImageOpacity={0.3}
          />
          
          {/* 지도 오버레이 정보 */}
          <View style={styles.mapOverlay}>
            <View style={styles.trackingStatus}>
              <View style={styles.trackingIndicator}>
                <View style={[styles.trackingDot, { backgroundColor: isTracking ? '#00FF00' : '#FF0000' }]} />
                <Text style={styles.trackingText}>
                  {isTracking ? 'GPS 추적 중' : 'GPS 추적 중지'}
                </Text>
              </View>
              <Text style={styles.mapInfoText}>
                현재 위치: {currentAddress}
              </Text>
              <Text style={styles.mapInfoText}>
                정확도: ±5m
              </Text>
            </View>
          </View>
        </View>

        {/* 거리 정보 */}
        <View style={styles.distanceInfo}>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>현재 거리</Text>
            <Text style={styles.distanceValue}>{challengeData.totalDistance.toFixed(2)}km</Text>
          </View>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>남은 거리</Text>
            <Text style={styles.distanceValue}>{challengeData.remainingDistance.toFixed(2)}km</Text>
          </View>
          <View style={styles.distanceItem}>
            <Text style={styles.distanceLabel}>경로 포인트</Text>
            <Text style={styles.distanceValue}>{challengeData.pathCount}개</Text>
          </View>
        </View>

        {/* 완료 버튼 */}
        <TouchableOpacity 
          style={[
            styles.completeButton, 
            (isCompleting || challengeData.totalDistance < challengeData.requiredDistance) && styles.disabledButton
          ]}
          onPress={handleCompleteChallenge}
          disabled={isCompleting || challengeData.totalDistance < challengeData.requiredDistance}
        >
          {isCompleting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.completeButtonText}>
              {challengeData.totalDistance >= challengeData.requiredDistance ? '챌린지 완료' : '1km 달성 필요'}
            </Text>
          )}
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
  progressSection: {
    marginBottom: 30,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006256',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'center',
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  mapSvg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
  },
  trackingStatus: {
    alignItems: 'center',
  },
  mapInfoText: {
    fontSize: 12,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
    marginTop: 2,
  },
  distanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  distanceItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distanceLabel: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
    marginBottom: 5,
  },
  distanceValue: {
    fontSize: 18,
    fontFamily: 'Pretendard Variable',
    color: '#006256',
    fontWeight: '700',
  },
  completeButton: {
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
    marginBottom: 100,
  },
  completeButtonText: {
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
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    marginRight: 8,
  },
  trackingText: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#00AA00',
    fontWeight: '600',
  },
});
import * as Location from 'expo-location';

class GpsService {
  constructor() {
    this.watchId = null;
    this.isTracking = false;
    this.currentLocation = null;
    this.pathPoints = [];
    this.totalDistance = 0;
    this.onLocationUpdate = null;
    this.onDistanceUpdate = null;
  }

  // 위치 권한 요청
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('위치 권한이 거부되었습니다.');
      }

      // 백그라운드 위치 권한도 요청 (걷기 챌린지용)
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      
      if (backgroundStatus.status !== 'granted') {
        console.warn('백그라운드 위치 권한이 거부되었습니다. 앱이 백그라운드에 있을 때 위치 추적이 중단될 수 있습니다.');
      }

      return { success: true, message: '위치 권한이 허용되었습니다.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 현재 위치 가져오기
  async getCurrentLocation() {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
      });

      this.currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };

      return { success: true, data: this.currentLocation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 위치 추적 시작
  async startTracking(onLocationUpdate, onDistanceUpdate) {
    try {
      // 권한 확인
      const permissionResult = await this.requestLocationPermission();
      if (!permissionResult.success) {
        throw new Error(permissionResult.error);
      }

      // 초기 위치 가져오기
      const initialLocation = await this.getCurrentLocation();
      if (!initialLocation.success) {
        throw new Error(initialLocation.error);
      }

      // 콜백 함수 설정
      this.onLocationUpdate = onLocationUpdate;
      this.onDistanceUpdate = onDistanceUpdate;

      // 경로 초기화
      this.pathPoints = [this.currentLocation];
      this.totalDistance = 0;
      this.isTracking = true;

      // 위치 추적 시작
      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // 2초마다 업데이트
          distanceInterval: 5, // 5미터마다 업데이트
        },
        (location) => {
          this.handleLocationUpdate(location);
        }
      );

      console.log('GPS 추적 시작됨');
      return { success: true, message: 'GPS 추적이 시작되었습니다.' };
    } catch (error) {
      console.error('GPS 추적 시작 실패:', error);
      return { success: false, error: error.message };
    }
  }

  // 위치 업데이트 처리
  handleLocationUpdate(location) {
    if (!this.isTracking) return;

    const newLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };

    // 이전 위치와의 거리 계산
    if (this.currentLocation) {
      const distance = this.calculateDistance(
        this.currentLocation.latitude,
        this.currentLocation.longitude,
        newLocation.latitude,
        newLocation.longitude
      );

      // 정확도가 좋은 경우에만 거리 추가 (정확도 10미터 이하)
      if (newLocation.accuracy <= 10 && distance > 0.001) { // 1미터 이상
        this.totalDistance += distance;
        this.pathPoints.push(newLocation);
        
        // 거리 업데이트 콜백 호출
        if (this.onDistanceUpdate) {
          this.onDistanceUpdate({
            totalDistance: this.totalDistance,
            pathCount: this.pathPoints.length,
            currentLocation: newLocation,
          });
        }
      }
    }

    this.currentLocation = newLocation;

    // 위치 업데이트 콜백 호출
    if (this.onLocationUpdate) {
      this.onLocationUpdate(newLocation);
    }
  }

  // 두 지점 간의 거리 계산 (Haversine 공식)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // 미터 단위
  }

  // 위치 추적 중지
  stopTracking() {
    if (this.watchId) {
      Location.stopWatchPositionAsync(this.watchId);
      this.watchId = null;
    }

    this.isTracking = false;
    this.onLocationUpdate = null;
    this.onDistanceUpdate = null;

    console.log('GPS 추적 중지됨');
    return { success: true, message: 'GPS 추적이 중지되었습니다.' };
  }

  // 추적 상태 확인
  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      totalDistance: this.totalDistance,
      pathCount: this.pathPoints.length,
      currentLocation: this.currentLocation,
    };
  }

  // 경로 데이터 가져오기
  getPathData() {
    return {
      pathPoints: this.pathPoints,
      totalDistance: this.totalDistance,
    };
  }

  // 추적 데이터 초기화
  resetTracking() {
    this.pathPoints = [];
    this.totalDistance = 0;
    this.currentLocation = null;
  }
}

// 싱글톤 인스턴스 생성
const gpsService = new GpsService();
export default gpsService;

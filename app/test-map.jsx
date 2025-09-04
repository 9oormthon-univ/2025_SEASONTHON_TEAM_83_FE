import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapBorder from '../components/MapBorder';

// 실제 지도 외곽선 Path 데이터
const mapPathData = "M 268.5 0 L 382 35 L 395 97.5 L 412 157.5 L 395 216.5 L 393.5 218 L 357 233.5 L 343 276.5 L 383 309.5 L 383 437.5 L 379.5 441 L 329.5 481 L 227.5 508 L 220 511.5 L 184.5 573 L 107.5 547 L 102 542.5 L 20 449.5 L 41 361.5 L 43 287.5 L 44 286.5 L 44 261.5 L 45 260.5 L 45 236.5 L 46 235.5 L 46 210.5 L 47 209.5 L 47 184.5 L 48 183.5 L 48 158.5 Q 50.5 157 49 151.5 L 50.5 150 L 91.5 129 L 126 129 L 141 71.5 L 143.5 67 L 217.5 34 L 268.5 0 Z";

export default function TestMapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pathHistory, setPathHistory] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [mapCenter, setMapCenter] = useState(null); // 지도 중심점 (동적으로 설정)

  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      
      // 위치 권한 요청
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', 'GPS 추적을 위해 위치 권한이 필요합니다.');
        return;
      }

      // 현재 위치 가져오기
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
      
      const locationData = { x: mapX, y: mapY, lat: latitude, lng: longitude };
      setCurrentLocation(locationData);
      
      if (!startLocation) {
        setStartLocation(locationData);
        // 첫 번째 위치를 지도 중심점으로 설정
        setMapCenter({ lat: latitude, lng: longitude });
      }
      
      // 경로 히스토리에 추가
      setPathHistory(prev => {
        const newPath = [...prev, locationData];
        return newPath.length > 50 ? newPath.slice(-50) : newPath; // 최대 50개 포인트
      });
      
      Alert.alert('위치 업데이트', `위도: ${latitude.toFixed(6)}\n경도: ${longitude.toFixed(6)}\n지도 좌표: (${mapX.toFixed(1)}, ${mapY.toFixed(1)})\n경로 포인트: ${pathHistory.length + 1}개`);
      
    } catch (error) {
      console.error('위치 가져오기 실패:', error);
      Alert.alert('오류', '위치를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 위치 가져오기
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>지도 테스트</Text>
      
      {/* 지도 영역 */}
      <View style={styles.mapContainer}>
        <MapBorder 
          pathData={mapPathData}
          strokeColor="#FFFE4F"
          strokeWidth={3}
          backgroundColor="#E8F5E8"
          showGrid={true}
          showMarkers={true}
          startLocation={startLocation ? { x: startLocation.x, y: startLocation.y } : { x: 216, y: 150 }}
          currentLocation={currentLocation ? { x: currentLocation.x, y: currentLocation.y } : null}
          pathHistory={pathHistory}
          showPath={true}
          pathColor="#006256"
          pathWidth={3}
          backgroundImageOpacity={0.4}
        />
      </View>
      
      {/* 정보 표시 */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          시작 위치: {startLocation ? `(${startLocation.x.toFixed(1)}, ${startLocation.y.toFixed(1)})` : '없음'}
        </Text>
        <Text style={styles.infoText}>
          현재 위치: {currentLocation ? `(${currentLocation.x.toFixed(1)}, ${currentLocation.y.toFixed(1)})` : '없음'}
        </Text>
        {currentLocation && (
          <Text style={styles.infoText}>
            GPS: ({currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)})
          </Text>
        )}
        <Text style={styles.infoText}>
          경로 포인트: {pathHistory.length}개
        </Text>
        <Text style={styles.infoText}>
          지도 중심: {mapCenter ? `(${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(6)})` : '없음 (현재 위치 기준)'}
        </Text>
      </View>
      
      {/* 버튼들 */}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={getCurrentLocation}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '위치 가져오는 중...' : '위치 업데이트'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.clearButton} 
        onPress={() => setPathHistory([])}
      >
        <Text style={styles.clearButtonText}>경로 지우기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  mapContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#006256',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

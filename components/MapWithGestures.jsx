import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapWithGestures = forwardRef(({
  currentLocation = null,
  startLocation = null,
  pathHistory = [],
  showPath = true,
  pathColor = '#FF6B6B',
  pathWidth = 4,
  enableZoom = true,
  enablePan = true
}, ref) => {
  const [scale, setScale] = useState(4.5);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(-50); // 지도를 위로 50px 이동하여 현재 위치를 아래로
  const [lastScale, setLastScale] = useState(4.5);
  const [lastTranslateX, setLastTranslateX] = useState(0);
  const [lastTranslateY, setLastTranslateY] = useState(-50);

  // 핀치 제스처 핸들러
  const onPinchGestureEvent = (event) => {
    console.log('🔍 핀치 제스처 이벤트:', {
      enableZoom,
      scale: event.nativeEvent.scale,
      lastScale
    });
    
    if (!enableZoom) return;
    
    const newScale = Math.max(0.5, Math.min(3, lastScale * event.nativeEvent.scale));
    setScale(newScale);
  };

  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setLastScale(scale);
    }
  };

  // 팬 제스처 핸들러
  const onPanGestureEvent = (event) => {
    console.log('🔍 팬 제스처 이벤트:', {
      enablePan,
      translationX: event.nativeEvent.translationX,
      translationY: event.nativeEvent.translationY
    });
    
    if (!enablePan) return;
    
    setTranslateX(lastTranslateX + event.nativeEvent.translationX);
    setTranslateY(lastTranslateY + event.nativeEvent.translationY);
  };

  const onPanHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setLastTranslateX(translateX);
      setLastTranslateY(translateY);
    }
  };

  // 지도 리셋 함수
  const resetMap = () => {
    setScale(4.5);
    setTranslateX(0);
    setTranslateY(-50); // 초기 위치로 리셋 (위로 50px)
    setLastScale(4.5);
    setLastTranslateX(0);
    setLastTranslateY(-50);
  };

  // ref를 통해 외부에서 호출할 수 있는 함수들
  useImperativeHandle(ref, () => ({
    resetMap,
    getCurrentTransform: () => ({ scale, translateX, translateY })
  }));

  // 경로 데이터 생성
  const pathCoordinates = pathHistory.map(point => ({
    latitude: point.lat,
    longitude: point.lng
  }));

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchGestureEvent}
      onHandlerStateChange={onPinchHandlerStateChange}
      enabled={enableZoom}
      minPointers={2}
      maxPointers={2}
    >
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onPanHandlerStateChange}
        enabled={enablePan}
        minPointers={1}
        maxPointers={1}
      >
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation?.lat || 37.5842,
              longitude: currentLocation?.lng || 126.9277,
              latitudeDelta: 0.0017, // 3배 더 가까운 줌 (0.005 ÷ 3)
              longitudeDelta: 0.0017, // 3배 더 가까운 줌 (0.005 ÷ 3)
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            showsScale={false}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            {/* 시작점 마커 */}
            {startLocation && (
              <Marker
                coordinate={{
                  latitude: startLocation.lat,
                  longitude: startLocation.lng
                }}
                title="시작점"
                pinColor="green"
              />
            )}

            {/* 현재 위치 마커 */}
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.lat,
                  longitude: currentLocation.lng
                }}
                title="현재 위치"
                pinColor="red"
              />
            )}

            {/* 이동 경로 */}
            {showPath && pathCoordinates.length > 1 && (
              <Polyline
                coordinates={pathCoordinates}
                strokeColor={pathColor}
                strokeWidth={pathWidth}
                lineDashPattern={[5, 5]}
              />
            )}
          </MapView>
        </View>
      </PanGestureHandler>
    </PinchGestureHandler>
  );
});

MapWithGestures.displayName = 'MapWithGestures';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default MapWithGestures;

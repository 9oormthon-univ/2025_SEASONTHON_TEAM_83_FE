import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapBorder from './MapBorder';

// 실제 지도 외곽선 Path 데이터 (icon_map.svg에서 추출) - 좌우 확장된 채워진 도형
const examplePathData = "M 268.5 0 L 382 35 L 395 97.5 L 412 157.5 L 395 216.5 L 393.5 218 L 357 233.5 L 343 276.5 L 383 309.5 L 383 437.5 L 379.5 441 L 329.5 481 L 227.5 508 L 220 511.5 L 184.5 573 L 107.5 547 L 102 542.5 L 20 449.5 L 41 361.5 L 43 287.5 L 44 286.5 L 44 261.5 L 45 260.5 L 45 236.5 L 46 235.5 L 46 210.5 L 47 209.5 L 47 184.5 L 48 183.5 L 48 158.5 Q 50.5 157 49 151.5 L 50.5 150 L 91.5 129 L 126 129 L 141 71.5 L 143.5 67 L 217.5 34 L 268.5 0 Z";

const MapBorderExample = () => {
  return (
    <View style={styles.container}>
      {/* 지도 테두리 컴포넌트 사용 예시 */}
      <MapBorder 
        pathData={examplePathData}
        strokeColor="#FFFE4F"
        strokeWidth={3}
        backgroundColor="#E8F5E8"
        showGrid={true}
        showMarkers={true}
        startLocation={{ x: 216, y: 150 }}
        currentLocation={{ x: 216, y: 200 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    position: 'relative',
    backgroundColor: '#E8F5E8', // 지도 배경색
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapContent: {
    flex: 1,
    // 지도 내용 스타일
  },
});

export default MapBorderExample;

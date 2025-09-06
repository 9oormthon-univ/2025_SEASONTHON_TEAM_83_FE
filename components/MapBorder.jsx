import React, { forwardRef, useImperativeHandle } from 'react';
import { Image, View } from 'react-native';
import Svg, { Circle, Defs, G, Mask, Path, Text as SvgText } from 'react-native-svg';

const MapBorder = forwardRef(({ 
  pathData, 
  strokeColor = '#FFFE4F', 
  strokeWidth = 2,
  children,
  backgroundColor = '#E8F5E8',
  showGrid = true,
  showMarkers = true,
  currentLocation = null,
  startLocation = null,
  pathHistory = [], // 이동 경로 히스토리
  showPath = true, // 경로 표시 여부
  pathColor = '#006256', // 경로 색상
  pathWidth = 1.5, // 경로 두께 (더 얇게)
  backgroundImageOpacity = 0.1 // 배경 이미지 투명도
}, ref) => {
  // 고정된 지도 상태 (제스처 제거)
  const scale = 7.5;
  const translateX = 3;
  const translateY = 65; // 지도를 위로 60px 이동하여 현재 위치를 아래로


  // 지도 리셋 함수 (제스처 제거로 단순화)
  const resetMap = () => {
    console.log('🗺️ 지도 리셋 - 고정된 상태로 복원');
    // 고정된 상태이므로 리셋할 필요 없음
  };

  // ref를 통해 외부에서 호출할 수 있는 함수들
  useImperativeHandle(ref, () => ({
    resetMap,
    getCurrentTransform: () => ({ scale, translateX, translateY })
  }));



  // 그리드 라인 생성 함수
  const generateGridLines = () => {
    if (!showGrid) return null;
    
    const gridSize = 20;
    const lines = [];
    
    // 세로 라인
    for (let x = 0; x <= 432; x += gridSize) {
      lines.push(
        <Path
          key={`v-${x}`}
          d={`M ${x} 0 L ${x} 573`}
          stroke="#D0D0D0"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
    
    // 가로 라인
    for (let y = 0; y <= 573; y += gridSize) {
      lines.push(
        <Path
          key={`h-${y}`}
          d={`M 0 ${y} L 432 ${y}`}
          stroke="#D0D0D0"
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }
    
    return lines;
  };

  // 이동 경로 생성 함수 (이전 위치와 새 위치 사이에 선을 그리는 로직)
  const generatePathLine = () => {
    console.log('🛤️ 경로 그리기 조건 확인:', { 
      showPath, 
      pathHistoryLength: pathHistory.length,
      pathHistory: pathHistory.slice(0, 3) // 처음 3개만 로그
    });
    
    // 테스트를 위해 showPath 조건 무시
    // if (!showPath) {
    //   console.log('🚫 showPath가 false - 경로 그리기 건너뜀');
    //   return null;
    // }
    
    // 테스트용 더미 경로 데이터 추가
    const testPathHistory = pathHistory.length < 2 ? [
      { x: 216, y: 200 },
      { x: 220, y: 205 },
      { x: 225, y: 210 },
      { x: 230, y: 215 }
    ] : pathHistory;
    
    if (testPathHistory.length < 2) {
      console.log('🚫 pathHistory 길이 부족 - 경로 그리기 건너뜀');
      return null;
    }
    
    // 경로 데이터 생성 (M x1 y1 L x2 y2 L x3 y3 ...)
    // M: Move to (첫 번째 점으로 이동)
    // L: Line to (이전 점에서 현재 점으로 선 그리기)
    const pathData = pathHistory
      .map((point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`; // 첫 번째 점으로 이동
        } else {
          return `L ${point.x} ${point.y}`; // 이전 점에서 현재 점으로 선 그리기
        }
      })
      .join(' ');
    
    console.log('🛤️ 경로 그리기:', { 
      pathHistoryLength: pathHistory.length, 
      pathData: pathData.substring(0, 50) + '...',
      pathColor,
      pathWidth 
    });
    
    return (
      <Path
        d={pathData}
        stroke="#FF0000" // 빨간색으로 고정
        strokeWidth="3" // 더 두껍게
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        // strokeDasharray 제거 - 실선으로 표시
      />
    );
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: [
            { scale },
            { translateX },
            { translateY }
          ]
        }}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 432 573"
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
      <Defs>
        {/* 지도 외곽선 마스크 */}
        <Mask id="mapMask">
          <Path
            d={pathData}
            fill="white"
          />
        </Mask>
      </Defs>
      
      {/* 지도 배경 - 채워진 도형으로 직접 표시 */}
      <Path
        d={pathData}
        fill={backgroundColor}
        stroke="none"
      />
      
      {/* 그리드 라인들 - 지도 외곽선 안에서만 표시 */}
      <G mask="url(#mapMask)">
        {generateGridLines()}
      </G>
      
      {/* 시작점 마커 */}
      {showMarkers && startLocation && (
        <G mask="url(#mapMask)">
          <Circle cx={startLocation.x} cy={startLocation.y} r="1" fill="#00AA00" />
          <SvgText 
            x={startLocation.x} 
            y={startLocation.y - 15} 
            textAnchor="middle" 
            fontSize="5" 
            fill="#00AA00" 
            fontWeight="bold"
          >
            시작
          </SvgText>
        </G>
      )}
      
      {/* 현재 위치 마커 */}
      {showMarkers && currentLocation && (
        <G mask="url(#mapMask)">
          {console.log('🎯 현재 위치 마커 렌더링:', {
            showMarkers,
            currentLocation,
            x: currentLocation.x,
            y: currentLocation.y
          })}
          <Circle cx={currentLocation.x} cy={currentLocation.y} r="1" fill="#00AA00" />
          <Circle cx={currentLocation.x} cy={currentLocation.y} r="2" fill="#00AA00" opacity="0.5" />
          <Circle cx={currentLocation.x} cy={currentLocation.y} r="3" fill="#00AA00" opacity="0.2" />
        </G>
      )}
      
      {/* 사용자 정의 콘텐츠 */}
      <G mask="url(#mapMask)">
        {children}
      </G>
      
      {/* 이동 경로 - 마스크 없이 표시 (항상 보이도록) */}
      {generatePathLine()}
      
      {/* 지도 테두리 - 노란색 외곽선 */}
      <Path
        d={pathData}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
        </Svg>
      </View>
      
      {/* 최상단 오버레이 이미지 - 투명하게 */}
      <Image
        source={require('../assets/images/icon_map.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: backgroundImageOpacity, // 설정 가능한 투명도
          resizeMode: 'contain',
          zIndex: 999, // 최상단 레이어
        }}
      />
    </>
  );
});

MapBorder.displayName = 'MapBorder';

export default MapBorder;

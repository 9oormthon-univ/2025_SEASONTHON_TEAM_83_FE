import React from 'react';
import { Image } from 'react-native';
import Svg, { Circle, Defs, G, Mask, Path, Text as SvgText } from 'react-native-svg';

const MapBorder = ({ 
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
  pathWidth = 3, // 경로 두께
  backgroundImageOpacity = 0.1 // 배경 이미지 투명도
}) => {
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
    if (!showPath || pathHistory.length < 2) return null;
    
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
    
    return (
      <Path
        d={pathData}
        stroke={pathColor}
        strokeWidth={pathWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5,5" // 점선 효과로 이동 경로 표시
      />
    );
  };

  return (
    <>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 432 573"
        style={{ position: 'absolute' }}
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
      
      {/* 이동 경로 - 지도 외곽선 안에서만 표시 */}
      <G mask="url(#mapMask)">
        {generatePathLine()}
      </G>
      
      {/* 시작점 마커 */}
      {showMarkers && startLocation && (
        <G mask="url(#mapMask)">
          <Circle cx={startLocation.x} cy={startLocation.y} r="8" fill="#00AA00" />
          <SvgText 
            x={startLocation.x} 
            y={startLocation.y - 15} 
            textAnchor="middle" 
            fontSize="12" 
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
          <Circle cx={currentLocation.x} cy={currentLocation.y} r="6" fill="#006256" />
          <Circle cx={currentLocation.x} cy={currentLocation.y} r="12" fill="#006256" opacity="0.3" />
          <Circle cx={currentLocation.x} cy={currentLocation.y} r="20" fill="#006256" opacity="0.1" />
        </G>
      )}
      
      {/* 사용자 정의 콘텐츠 */}
      <G mask="url(#mapMask)">
        {children}
      </G>
      
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
};

export default MapBorder;

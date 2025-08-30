import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth * 0.7;
const cardSpacing = 20;

const ChallengeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(2); // 초기값을 2로 설정 (첫 번째 세트의 중앙)
  const scrollViewRef = useRef(null);
  
  const challenges = [
    {
      id: 1,
      title: '지난 챌린지',
      icon: '🥤',
      description: '오늘의 추천 미션: "오늘 2km 걷기"',
      type: 'previous'
    },
    {
      id: 2,
      title: '걷기 챌린지',
      icon: '🚶',
      description: '일상 속 걷기로 건강한 습관 만들기',
      type: 'walking'
    },
    {
      id: 3,
      title: '텀블러 챌린지',
      icon: '☕',
      description: '일회용 컵 대신 텀블러 사용하기',
      type: 'tumbler'
    },
    {
      id: 4,
      title: '분리수거 챌린지',
      icon: '♻️',
      description: '올바른 분리수거로 환경 보호하기',
      type: 'recycling'
    },
    {
      id: 5,
      title: '대중교통 챌린지',
      icon: '🚌',
      description: '자동차 대신 대중교통 이용하기',
      type: 'transport'
    }
  ];

  // 무한 리스트를 위한 데이터 복제
  const infiniteChallenges = [...challenges, ...challenges, ...challenges];

  // 스크롤 중앙에 있는 카드 인덱스 계산 (이전 인덱스로)
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidthWithSpacing = cardWidth + cardSpacing;
    const centerPosition = scrollPosition + (screenWidth / 2);
    const index = Math.floor(centerPosition / cardWidthWithSpacing); // Math.round → Math.floor로 변경
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>오늘의 챌린지 선택</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={cardWidth + cardSpacing}
        decelerationRate={0.8}
        pagingEnabled={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          // 스크롤이 끝에 도달했을 때 처음으로 돌아가기
          const contentOffset = event.nativeEvent.contentOffset.x;
          const maxOffset = event.nativeEvent.contentSize.width - event.nativeEvent.layoutMeasurement.width;
          
          if (contentOffset >= maxOffset - 10) {
            // 끝에 도달했을 때 처음으로 스크롤
            event.target.scrollTo({ x: 0, animated: false });
          }
        }}
      >
        {infiniteChallenges.map((challenge, index) => (
          <View
            key={`${challenge.id}-${index}`}
            style={[
              styles.card,
              // 현재 화면 중앙에 보이는 카드만 강조
              index === activeIndex ? styles.activeCard : styles.inactiveCard,
            ]}
          >
            <Text style={[
              styles.cardTitle,
              index === activeIndex ? styles.activeText : styles.inactiveText
            ]}>
              {challenge.title}
            </Text>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{challenge.icon}</Text>
            </View>
            <Text style={[
              styles.cardDescription,
              index === activeIndex ? styles.activeText : styles.inactiveText
            ]}>
              {challenge.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 20,
    marginLeft: 20,
    fontFamily: 'Pretendard Variable',
  },
  scrollContainer: {
    paddingHorizontal: (screenWidth - cardWidth) / 2 - cardSpacing * 1.5, // 카드 간격 고려하여 정확한 중앙 정렬
  },
  card: {
    width: cardWidth,
    height: 148,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: cardSpacing / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  activeCard: {
    shadowOpacity: 0.2,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#006256',
  },
  inactiveCard: {
    opacity: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Pretendard Variable',
  },
  activeText: {
    color: '#2D2D2D',
  },
  inactiveText: {
    color: '#999999',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    fontSize: 32,
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'Pretendard Variable',
  },
});

export default ChallengeCarousel;

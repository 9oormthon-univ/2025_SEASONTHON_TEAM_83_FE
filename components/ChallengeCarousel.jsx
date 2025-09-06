import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { apiClient } from '../services/api';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth * 0.7;
const cardSpacing = 20;

const ChallengeCarousel = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1); // 추천 챌린지가 중앙에 오도록 (두 번째 챌린지)
  const scrollViewRef = useRef(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // API에서 챌린지 추천 데이터 가져오기
  useEffect(() => {
    const loadRecommendedChallenges = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/challenges/recommendation');
        
        if (response.isSuccess) {
          const apiChallenges = [
            {
              ...response.result.lastChallenge,
              type: 'lastChallenge',
              icon: '🔄',
              description: '지난 챌린지 다시 도전하기',
              imageUrl: response.result.lastChallenge.imageUrl?.startsWith('http') 
                ? response.result.lastChallenge.imageUrl 
                : `https://dev.seonyeong.site${response.result.lastChallenge.imageUrl}`
            },
            {
              ...response.result.recommendedChallenge,
              type: 'recommendedChallenge',
              icon: '⭐',
              description: '오늘의 추천 챌린지',
              imageUrl: response.result.recommendedChallenge.imageUrl?.startsWith('http') 
                ? response.result.recommendedChallenge.imageUrl 
                : `https://dev.seonyeong.site${response.result.recommendedChallenge.imageUrl}`
            }
          ];
          setChallenges(apiChallenges);
          // 데이터 로드 후 두 번째 챌린지(추천 챌린지)로 스크롤
          setTimeout(() => {
            if (scrollViewRef.current) {
              const cardWidthWithSpacing = cardWidth + cardSpacing;
              scrollViewRef.current.scrollTo({ x: cardWidthWithSpacing, animated: false });
            }
          }, 100);
        } else {
          console.error('챌린지 추천 로드 실패:', response.message);
          // API 실패 시 기본 데이터 사용
          setChallenges([
            {
              challengeId: 2,
              title: '텀블러 챌린지',
              imageUrl: null,
              point: 50,
              type: 'lastChallenge',
              icon: '🔄',
              description: '지난 챌린지 다시 도전하기'
            },
            {
              challengeId: 1,
              title: '걷기 챌린지',
              imageUrl: null,
              point: 20,
              type: 'recommendedChallenge',
              icon: '⭐',
              description: '오늘의 추천 챌린지'
            }
          ]);
          // 기본 데이터 사용 시에도 두 번째 챌린지로 스크롤
          setTimeout(() => {
            if (scrollViewRef.current) {
              const cardWidthWithSpacing = cardWidth + cardSpacing;
              scrollViewRef.current.scrollTo({ x: cardWidthWithSpacing, animated: false });
            }
          }, 100);
        }
      } catch (error) {
        console.error('챌린지 추천 로드 중 오류:', error);
        // 에러 시 기본 데이터 사용
        setChallenges([
          {
            challengeId: 2,
            title: '텀블러 챌린지',
            imageUrl: null,
            point: 50,
            type: 'lastChallenge',
            icon: '🔄',
            description: '지난 챌린지 다시 도전하기'
          },
          {
            challengeId: 1,
            title: '걷기 챌린지',
            imageUrl: null,
            point: 20,
            type: 'recommendedChallenge',
            icon: '⭐',
            description: '오늘의 추천 챌린지'
          }
        ]);
        // 에러 시 기본 데이터 사용 시에도 두 번째 챌린지로 스크롤
        setTimeout(() => {
          if (scrollViewRef.current) {
            const cardWidthWithSpacing = cardWidth + cardSpacing;
            scrollViewRef.current.scrollTo({ x: cardWidthWithSpacing, animated: false });
          }
        }, 100);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedChallenges();
  }, []);

  // 무한 리스트를 위한 데이터 복제
  const infiniteChallenges = challenges.length > 0 ? [...challenges, ...challenges, ...challenges] : [];
  
  console.log('챌린지 데이터:', challenges);
  console.log('무한 챌린지 데이터:', infiniteChallenges);

  // 스크롤 중앙에 있는 카드 인덱스 계산 (이전 인덱스로)
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidthWithSpacing = cardWidth + cardSpacing;
    const centerPosition = scrollPosition + (screenWidth / 2);
    const index = Math.floor(centerPosition / cardWidthWithSpacing); // Math.round → Math.floor로 변경
    setActiveIndex(index);
  };

  // 챌린지 카드 클릭 처리
  const handleChallengePress = (challenge) => {
    console.log('챌린지 클릭:', challenge);
    
    // 챌린지 ID에 따라 해당 페이지로 이동
    if (challenge.challengeId === 1) {
      router.push('/challenge-walk');
    } else if (challenge.challengeId === 2) {
      router.push('/challenge-tumbler');
    } else {
      // 기본적으로 텀블러 챌린지로 이동
      router.push('/challenge-tumbler');
    }
  };

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>오늘의 챌린지 선택</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006256" />
          <Text style={styles.loadingText}>챌린지를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 데이터가 없을 때 렌더링
  if (challenges.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>오늘의 챌린지 선택</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>챌린지 데이터가 없습니다.</Text>
        </View>
      </View>
    );
  }

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
          <TouchableOpacity
            key={`${challenge.challengeId}-${index}`}
            style={[
              styles.card,
              // 현재 화면 중앙에 보이는 카드만 강조
              index === activeIndex ? styles.activeCard : styles.inactiveCard,
            ]}
            onPress={() => handleChallengePress(challenge)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.cardTitle,
              index === activeIndex ? styles.activeText : styles.inactiveText
            ]}>
              {challenge.title}
            </Text>
            
            <View style={styles.iconContainer}>
              {challenge.imageUrl ? (
                <Image 
                  source={{ uri: challenge.imageUrl }} 
                  style={styles.challengeImage}
                  resizeMode="cover"
                  onError={() => {
                    console.log('이미지 로딩 실패:', challenge.imageUrl);
                  }}
                />
              ) : (
                <View style={[
                  styles.iconBackground,
                  challenge.type === 'lastChallenge' ? styles.lastChallengeIcon : styles.recommendedIcon
                ]}>
                  <View style={styles.squareIcon}>
                    <Text style={styles.squareIconText}>
                      {challenge.type === 'lastChallenge' ? '↻' : '★'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            
            <Text style={[
              styles.cardDescription,
              index === activeIndex ? styles.activeText : styles.inactiveText
            ]}>
              {challenge.description}
            </Text>
            
            {/* 포인트 표시 */}
            <View style={styles.pointContainer}>
              <Text style={[
                styles.pointText,
                index === activeIndex ? styles.activePointText : styles.inactivePointText
              ]}>
                {challenge.point}P
              </Text>
            </View>
          </TouchableOpacity>
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
  iconBackground: {
    width: 100,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastChallengeIcon: {
    backgroundColor: '#E8F5E8',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  recommendedIcon: {
    backgroundColor: '#FFF3E0',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  icon: {
    fontSize: 32,
  },
  squareIcon: {
    width: 80,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  squareIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'Pretendard Variable',
  },
  loadingContainer: {
    height: 148,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  challengeImage: {
    width: 80,
    height: 50,
    borderRadius: 8,
  },
  pointContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#006256',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Pretendard Variable',
  },
  activePointText: {
    color: '#FFFFFF',
  },
  inactivePointText: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
});

export default ChallengeCarousel;

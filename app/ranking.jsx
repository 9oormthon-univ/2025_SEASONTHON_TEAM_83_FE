import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import RankingService from '../services/rankingService';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function RankingScreen() {
  const router = useRouter();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 컴포넌트 마운트 시 랭킹 데이터 로드
  useEffect(() => {
    loadRankings();
  }, []);

  // 랭킹 데이터 로드
  const loadRankings = async (page = 0) => {
    try {
      setLoading(true);
      const response = await RankingService.getRankings(page, 10);
      
      if (response.success) {
        const newRankings = response.data.content;
        if (page === 0) {
          setRankings(newRankings);
        } else {
          setRankings(prev => [...prev, ...newRankings]);
        }
        setCurrentPage(page);
        setHasMore(!response.data.last);
      } else {
        Alert.alert('오류', response.error || '랭킹을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('랭킹 로드 중 오류:', error);
      Alert.alert('오류', '랭킹을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 더 많은 랭킹 로드
  const loadMoreRankings = () => {
    if (!loading && hasMore) {
      loadRankings(currentPage + 1);
    }
  };

  // 랭킹 아이템 렌더링
  const renderRankingItem = (item, index) => {
    const isTopThree = item.rank <= 3;
    
    if (isTopThree) {
      return renderTopThreeRanking(item);
    } else {
      return renderRegularRanking(item);
    }
  };

  // 상위 3위 렌더링
  const renderTopThreeRanking = (item) => {
    if (item.rank === 1) {
      return (
        <View key={item.memberId} style={styles.firstPlace}>
          <View style={styles.firstPlaceContent}>
            <View style={styles.avatarGradientContainer}>
              <LinearGradient
                colors={['#87CEEB', '#98D8E8', '#B0E0E6']}
                locations={[0, 0.5, 1]}
                style={styles.avatarGradient}
              >
                <View style={styles.firstPlaceAvatar}>
                  <Image 
                    source={item.profileUrl ? { uri: item.profileUrl } : require('../assets/images/icon_logo_badge.png')} 
                    style={styles.profileImage} 
                  />
                </View>
              </LinearGradient>
            </View>
            <Text style={styles.firstPlaceNickname}>{item.nickname}</Text>
            <View style={styles.firstPlaceInfo}>
              <Text style={styles.firstPlaceText}>총 {item.totalPoint.toLocaleString()}점</Text>
              <Text style={styles.firstPlaceText}>보유 뱃지 {item.badgeCount}개</Text>
            </View>
          </View>
        </View>
      );
    } else if (item.rank === 2 || item.rank === 3) {
      return (
        <View key={item.memberId} style={item.rank === 2 ? styles.secondPlace : styles.thirdPlace}>
          <Text style={styles.rankText}>{item.rank}위</Text>
          <View style={styles.avatarContainer}>
            <Image 
              source={item.profileUrl ? { uri: item.profileUrl } : require('../assets/images/icon_logo_badge.png')} 
              style={styles.profileImage} 
            />
          </View>
          <Text style={styles.userName}>{item.nickname}</Text>
          <Text style={styles.pointsText}>{item.totalPoint.toLocaleString()}p</Text>
        </View>
      );
    }
  };

  // 일반 랭킹 렌더링
  const renderRegularRanking = (item) => {
    return (
      <View key={item.memberId} style={styles.rankingItem}>
        <Text style={styles.rankNumber}>{item.rank}</Text>
        <View style={styles.avatarContainer}>
          <Image 
            source={item.profileUrl ? { uri: item.profileUrl } : require('../assets/images/icon_logo_badge.png')} 
            style={styles.profileImage} 
          />
        </View>
        <Text style={styles.userName}>{item.nickname}</Text>
        <View style={styles.separator} />
        <Text style={styles.pointsText}>{item.totalPoint.toLocaleString()}p</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#E8F8F5', '#F0F8FF', '#FFF8DC']}
      locations={[0, 0.5, 1]}
      useAngle={true}
      angle={135}
      style={styles.fullScreenGradient}
    >
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
        {/* 현재 랭킹 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>현재 랭킹</Text>
        </View>

        {/* 랭킹 섹션 */}
        <View style={styles.rankingSection}>
          {loading && rankings.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#006256" />
              <Text style={styles.loadingText}>랭킹을 불러오는 중...</Text>
            </View>
          ) : (
            <>
              {/* 상위 3위 */}
              {rankings.filter(item => item.rank <= 3).map(item => renderTopThreeRanking(item))}
              
              {/* 2위와 3위를 위한 컨테이너 */}
              {rankings.filter(item => item.rank === 2 || item.rank === 3).length > 0 && (
                <View style={styles.secondThirdRow}>
                  {rankings.filter(item => item.rank === 2 || item.rank === 3).map(item => 
                    <View key={item.memberId} style={item.rank === 2 ? styles.secondPlace : styles.thirdPlace}>
                      <Text style={styles.rankText}>{item.rank}위</Text>
                      <View style={styles.avatarContainer}>
                        <Image 
                          source={item.profileUrl ? { uri: item.profileUrl } : require('../assets/images/icon_logo_badge.png')} 
                          style={styles.profileImage} 
                        />
                      </View>
                      <Text style={styles.userName}>{item.nickname}</Text>
                      <Text style={styles.pointsText}>{item.totalPoint.toLocaleString()}p</Text>
                    </View>
                  )}
                </View>
              )}

              {/* 4위부터 리스트 */}
              <ScrollView 
                style={styles.rankingList} 
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={loadMoreRankings}
              >
                {rankings.filter(item => item.rank > 3).map(item => renderRegularRanking(item))}
                
                {/* 더 보기 로딩 */}
                {loading && (
                  <View style={styles.loadMoreContainer}>
                    <ActivityIndicator size="small" color="#006256" />
                    <Text style={styles.loadMoreText}>더 많은 랭킹을 불러오는 중...</Text>
                  </View>
                )}
                
                {/* 더 이상 데이터가 없는 경우 */}
                {!hasMore && rankings.length > 0 && (
                  <View style={styles.noMoreContainer}>
                    <Text style={styles.noMoreText}>모든 랭킹을 불러왔습니다.</Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
        </View>
        
        <CustomTabBar />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    marginHorizontal: -20, // 양쪽으로 꽉 채우기
  },
  titlePattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  rankingSection: {
    flex: 1,
  },
  firstPlace: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  firstPlaceContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
  },

  avatarGradientContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  avatarGradient: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstPlaceAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    resizeMode: 'cover',
  },
  firstPlaceNickname: {
    fontSize: 24,
    letterSpacing: -0.3,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#525252',
    marginBottom: 10,
  },
  firstPlaceInfo: {
    alignItems: 'center',
  },
  firstPlaceText: {
    fontSize: 13,
    letterSpacing: -0.2,
    fontWeight: '300',
    fontFamily: 'Pretendard Variable',
    color: '#959595',
    lineHeight: 18,
  },
  secondThirdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  secondPlace: {
    alignItems: 'center',
    flex: 1,
  },
  thirdPlace: {
    alignItems: 'center',
    flex: 1,
  },
  rankText: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '500',
    fontFamily: 'Pretendard Variable',
    color: '#525252',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rankingList: {
    flex: 1,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#006256',
    marginRight: 15,
    width: 30,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2D2D',
    marginRight: 15,
    left: 5,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E2E2',
    marginRight: 15,
  },
  pointsText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    marginTop: 10,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    marginLeft: 10,
  },
  noMoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMoreText: {
    fontSize: 14,
    color: '#999999',
    fontFamily: 'Pretendard Variable',
  },
});

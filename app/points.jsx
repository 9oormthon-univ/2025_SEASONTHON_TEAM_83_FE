import { useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function PointsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
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
        {/* 보유 포인트 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>보유 포인트</Text>
        </View>

        {/* 현재 묘목 단계 섹션 */}
        <View style={styles.seedlingSection}>
          <Text style={styles.seedlingTitle}>현재 묘목 단계</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>다음 단계까지 10%</Text>
          </View>
        </View>

        {/* 포인트 획득 내역 섹션 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>포인트 획득 내역</Text>
          <ScrollView 
            style={styles.historyCard}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {/* 포인트 내역 아이템들 */}
            <View style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Image 
                    source={require('../assets/images/icon_walk.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>걷기 1.3km 인증</Text>
                  <Text style={styles.itemSubtitle}>2025-01-15</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>+20p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Image 
                    source={require('../assets/images/icon_tumblr.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>텀블러 사용 인증</Text>
                  <Text style={styles.itemSubtitle}>2025-01-14</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>+50p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Image 
                    source={require('../assets/images/icon_calendar.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>출석체크</Text>
                  <Text style={styles.itemSubtitle}>2025-01-13</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>+10p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Image 
                    source={require('../assets/images/icon_badge.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>첫 번째 뱃지 획득</Text>
                  <Text style={styles.itemSubtitle}>2025-01-12</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>+100p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Image 
                    source={require('../assets/images/icon_walk.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>걷기 2.1km 인증</Text>
                  <Text style={styles.itemSubtitle}>2025-01-11</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>+30p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Image 
                    source={require('../assets/images/icon_calendar.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>출석체크</Text>
                  <Text style={styles.itemSubtitle}>2025-01-10</Text>
                </View>
              </View>
              <Text style={styles.itemPoints}>+10p</Text>
            </View>
          </ScrollView>
        </View>

        {/* 포인트 정보 */}
        <View style={styles.pointsInfo}>
          <Text style={styles.currentPoints}>
            보유 포인트는 <Text style={styles.pointsValue}>30p</Text> 입니다
          </Text>
          <Text style={styles.totalPoints}>누적 포인트 1000p</Text>
        </View>

        {/* 리워드 전환 버튼 */}
        <TouchableOpacity style={styles.rewardButton}>
          <Text style={styles.rewardButtonText}>리워드 전환</Text>
        </TouchableOpacity>
      </View>
      
      <CustomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
  },
  header: {
    position: 'relative',
    height: 80,
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
    top: 10,
  },
  headerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  seedlingSection: {
    marginBottom: 20,
  },
  seedlingTitle: {
    width: 112,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 11,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    marginRight: 15,
    overflow: 'hidden',
  },
  progressFill: {
    width: '90%',
    height: '100%',
    backgroundColor: '#006256',
    borderRadius: 6,
  },
  progressText: {
    width: 79,
    fontSize: 10,
    letterSpacing: -0.1,
    lineHeight: 28,
    fontFamily: 'Pretendard Variable',
    color: '#525252',
    textAlign: 'right',
  },
  historySection: {
    marginBottom: 30,
  },
  historyTitle: {
    width: 129,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: 200, // 높이 제한
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
  },
  itemPoints: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#006256',
  },
  pointsInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  currentPoints: {
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'center',
    marginBottom: 10,
  },
  pointsValue: {
    fontWeight: '700',
    color: '#0061E9',
  },
  totalPoints: {
    width: 110,
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 18,
    fontFamily: 'Pretendard Variable',
    color: '#6B6B6B',
    textAlign: 'center',
  },
  rewardButton: {
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
  },
  rewardButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
});

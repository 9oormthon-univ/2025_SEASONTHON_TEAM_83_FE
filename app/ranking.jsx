import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function RankingScreen() {
  const router = useRouter();

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
          {/* 1위 */}
          <View style={styles.firstPlace}>
            <View style={styles.firstPlaceContent}>
              <View style={styles.avatarGradientContainer}>
                <LinearGradient
                  colors={['#87CEEB', '#98D8E8', '#B0E0E6']}
                  locations={[0, 0.5, 1]}
                  style={styles.avatarGradient}
                >
                  <View style={styles.firstPlaceAvatar}>
                    <Image 
                      source={require('../assets/images/icon_logo_badge.png')} 
                      style={styles.profileImage} 
                    />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.firstPlaceNickname}>닉네임</Text>
              <View style={styles.firstPlaceInfo}>
                <Text style={styles.firstPlaceText}>총 10000점</Text>
                <Text style={styles.firstPlaceText}>보유 뱃지 n개</Text>
              </View>
            </View>
          </View>

          {/* 2위와 3위 */}
          <View style={styles.secondThirdRow}>
            {/* 2위 */}
            <View style={styles.secondPlace}>
              <Text style={styles.rankText}>2위</Text>
              <View style={styles.avatarContainer}>
                <Image 
                  source={require('../assets/images/icon_logo_badge.png')} 
                  style={styles.profileImage} 
                />
              </View>
            </View>

            {/* 3위 */}
            <View style={styles.thirdPlace}>
              <Text style={styles.rankText}>3위</Text>
              <View style={styles.avatarContainer}>
                <Image 
                  source={require('../assets/images/icon_logo_badge.png')} 
                  style={styles.profileImage} 
                />
              </View>
            </View>
          </View>

          {/* 4위부터 10위까지 리스트 */}
          <ScrollView style={styles.rankingList} showsVerticalScrollIndicator={false}>
            {[
              { rank: 4, points: 8500 },
              { rank: 5, points: 7800 },
              { rank: 6, points: 7200 },
              { rank: 7, points: 6800 },
              { rank: 8, points: 6200 },
              { rank: 9, points: 5800 },
              { rank: 10, points: 5400 }
            ].map((item) => (
              <View key={item.rank} style={styles.rankingItem}>
                <Text style={styles.rankNumber}>{item.rank}</Text>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={require('../assets/images/icon_logo_badge.png')} 
                    style={styles.profileImage} 
                  />
                </View>
                <Text style={styles.userName}>User</Text>
                <View style={styles.separator} />
                <Text style={styles.pointsText}>{item.points.toLocaleString()}p</Text>
              </View>
            ))}
          </ScrollView>
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
    fontWeight: 'bold',
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
});

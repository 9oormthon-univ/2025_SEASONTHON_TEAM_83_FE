import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function BadgesScreen() {
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
        {/* 보유 뱃지 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>보유 뱃지</Text>
        </View>

        {/* 사용자 정보 섹션 */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoLeft}>
            <Text style={styles.nicknameText}>닉네임</Text>
            <View style={styles.profilePlaceholder} />
          </View>
          <TouchableOpacity style={styles.plantTreeButton}>
            <Text style={styles.plantTreeText}>나무심기</Text>
          </TouchableOpacity>
        </View>

        {/* 뱃지 섹션 */}
        <View style={styles.badgeSection}>
          <Text style={styles.badgeTitle}>현재 보유 뱃지</Text>
          
          <View style={styles.badgeCard}>
            {/* 활동 뱃지 */}
            <View style={styles.badgeCategory}>
              <Text style={styles.categoryTitle}>1. 활동 뱃지</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badgeItem}>
                  <Image 
                    source={require('../assets/images/icon_walk.png')} 
                    style={styles.badgeIcon} 
                  />
                </View>
                <View style={styles.badgeItem}>
                  <Image 
                    source={require('../assets/images/icon_tumblr.png')} 
                    style={styles.badgeIcon} 
                  />
                </View>
                <View style={styles.badgeItem}>
                  <Image 
                    source={require('../assets/images/icon_walk.png')} 
                    style={styles.badgeIcon} 
                  />
                </View>
                <View style={styles.badgeItem}>
                  <Image 
                    source={require('../assets/images/icon_tumblr.png')} 
                    style={styles.badgeIcon} 
                  />
                </View>
              </View>
            </View>

            {/* 누적 포인트 뱃지 */}
            <View style={styles.badgeCategory}>
              <Text style={styles.categoryTitle}>2. 누적 포인트 뱃지</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.emptyText}>아직 획득한 뱃지가 없습니다</Text>
              </View>
            </View>

            {/* 이벤트 뱃지 */}
            <View style={styles.badgeCategory}>
              <Text style={styles.categoryTitle}>3. 이벤트 뱃지</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.emptyText}>아직 획득한 뱃지가 없습니다</Text>
              </View>
            </View>
          </View>
        </View>
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
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameText: {
    width: 52,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginRight: 15,
  },
  profilePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
  },
  plantTreeButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(16, 24, 40, 0.18)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  plantTreeText: {
    fontSize: 15,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'Pretendard Variable',
    color: '#F9F8E1',
    textAlign: 'left',
  },
  badgeSection: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 20,
    textAlign: 'center',
  },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeCategory: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 15,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  badgeItem: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Pretendard Variable',
    fontStyle: 'italic',
  },
});

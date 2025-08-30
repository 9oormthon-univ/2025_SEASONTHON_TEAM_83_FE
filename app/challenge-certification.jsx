import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function ChallengeCertificationScreen() {
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
        {/* 챌린지 인증 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>챌린지 인증</Text>
        </View>

        {/* 챌린지 카드들 */}
        <View style={styles.challengeSection}>
          {/* 1Km 이상 걷기 챌린지 */}
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>1Km 이상 걷기</Text>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../assets/images/walk_challenge.png')} 
                style={styles.challengeImage} 
              />
            </View>
            <Text style={styles.pointsText}>20p</Text>
          </View>

          {/* 텀블러 사용 챌린지 */}
          <View style={styles.challengeCard}>
            <Text style={styles.challengeTitle}>텀블러 사용</Text>
            <View style={styles.imageContainer}>
              <Text style={styles.uploadText}>인증 사진을 올려주세요</Text>
            </View>
            <Text style={styles.pointsText}>50p</Text>
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
  challengeSection: {
    flex: 1,
  },
  challengeCard: {
    marginBottom: 20,
  },
  challengeTitle: {
    width: 140,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 15,
  },
  imageContainer: {
    width: '100%',
    height: 170,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  challengeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  uploadText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
  },
  pointsText: {
    width: 40,
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 18,
    fontFamily: 'Pretendard Variable',
    color: '#000',
    textAlign: 'left',
    alignSelf: 'flex-end',
  },
});

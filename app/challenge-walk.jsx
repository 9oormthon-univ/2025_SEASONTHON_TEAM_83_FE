import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeWalkScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 오늘의 챌린지 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>오늘의 챌린지</Text>
        </View>

        {/* 챌린지 상세 정보 */}
        <View style={styles.challengeDetailSection}>
          {/* 챌린지 제목 */}
          <Text style={styles.challengeTitle}>1Km 이상 걷기</Text>
          
          {/* 챌린지 이미지 */}
          <View style={styles.imageContainer}>
            <Image 
              style={styles.challengeImage}
              source={require('../assets/images/walk_challenge.png')}
              resizeMode="cover"
            />
            <Text style={styles.challengePoints}>20p</Text>
          </View>
          
          {/* 구분선 */}
          <View style={styles.divider} />
          
          {/* 챌린지 조건 */}
          <View style={styles.conditionSection}>
            <Text style={styles.conditionTitle}>챌린지 조건</Text>
            <Text style={styles.conditionText}>
              최소 1km 이상 보행 시 성공 처리{'\n'}
              GPS 기반으로 사용자의 이동 경로 기록
            </Text>
          </View>
          
          {/* 포인트 지급 기준 */}
          <View style={styles.pointSection}>
            <Text style={styles.pointTitle}>포인트 지급 기준</Text>
            <Text style={styles.pointText}>
              1. 1km 당 20P{'\n'}
              2. 하루 1회만 포인트 적립 가능
            </Text>
          </View>
          
          {/* 챌린지 시작 버튼 */}
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>챌린지 시작</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
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
    marginHorizontal: -20,
  },
  titlePattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    bottom: 0,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  challengeDetailSection: {
    marginBottom: 100,
  },
  challengeTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  challengeImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  challengePoints: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    fontSize: 16,
    fontWeight: '700',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  conditionSection: {
    marginBottom: 20,
  },
  conditionTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  conditionText: {
    fontSize: 16,
    lineHeight: 18,
    color: '#000',
    fontFamily: 'Pretendard Variable',
  },
  pointSection: {
    marginBottom: 30,
  },
  pointTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 10,
  },
  pointText: {
    fontSize: 16,
    lineHeight: 18,
    color: '#6B6B6B',
    fontFamily: 'Pretendard Variable',
  },
  startButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 12,
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
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
});

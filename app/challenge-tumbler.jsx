import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeTumblerScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
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
          <Text style={styles.challengeTitle}>텀블러 사용</Text>
          
          {/* 챌린지 이미지 */}
          <View style={styles.imageContainer}>
            <Image 
              style={styles.challengeImage}
              source={require('../assets/images/tumbler.png')}
              resizeMode="cover"
            />
            <Text style={styles.challengePoints}>50p</Text>
          </View>
          
          {/* 구분선 */}
          <View style={styles.divider} />
          
          {/* 챌린지 조건 */}
          <View style={styles.conditionSection}>
            <Text style={styles.conditionTitle}>챌린지 조건</Text>
            <View style={styles.conditionTextContainer}>
              <Text style={[styles.conditionText, styles.conditionTextBold]}>
                {`테이크아웃 또는 매장에서 음료를 받을 때
반드시 텀블러 사용`}
              </Text>
              <Text style={styles.conditionTextSub}>
                {`카페 영수증 + 텀블러 사진 제출 (1회 주문당 1회 인정)`}
              </Text>
            </View>
          </View>
          
          {/* 포인트 지급 기준 */}
          <View style={styles.pointSection}>
            <Text style={styles.pointTitle}>포인트 지급 기준</Text>
            <Text style={styles.pointText}>
              1. 1회 사용 시 50P{'\n'}
              2. 하루 최대 1회 인증 가능
            </Text>
          </View>
          
          {/* 챌린지 시작 버튼 */}
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/challenge-tumbler-upload')}
          >
            <Text style={styles.startButtonText}>챌린지 시작</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
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
    fontWeight: '500',
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
    marginBottom: 8,
  },
  challengeImage: {
    width: '100%',
    height: 170,
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
  conditionTextContainer: {
    paddingLeft: 16,
  },
  conditionText: {
    color: '#000',
    fontFamily: 'Pretendard Variable',
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 12,
  },
  conditionTextBold: {
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
  },
  conditionTextSub: {
    fontSize: 14,
    color: '#6b6b6b',
    fontFamily: 'Pretendard Variable',
    lineHeight: 20,
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
    marginLeft: 16,
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

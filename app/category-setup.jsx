import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const icon_walk = require('../assets/images/icon_walk.png');
const icon_tumblr = require('../assets/images/icon_tumblr.png');

export default function CategorySetupScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.container}>
        {/* 로고 */}
        <View style={styles.logoContainer}>
          <Image
            source={icon_pleanet_logo}
            style={styles.logo}
          />
        </View>

        {/* Welcome 배너 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>Welcome, User!</Text>
        </View>

        {/* 환영 메시지들 */}
        <View style={styles.welcomeMessages}>
          <Text style={styles.welcomeMessage}>"환영합니다, 플리닛 스카우트"</Text>
          <Text style={styles.welcomeMessage}>이제 당신은 지구를 지키는 대원입니다.</Text>
          <Text style={styles.welcomeMessage3}>작은 걸음 하나가 모두의 숲을 만듭니다.</Text>
        </View>

        {/* 관심 카테고리 설정 제목 */}
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitleText}>관심 카테고리 설정</Text>
        </View>

        {/* 카테고리 아이콘들 */}
        <View style={styles.categoryIcons}>
          <TouchableOpacity
            style={[styles.categoryIcon, { opacity: selectedCategory && selectedCategory !== 'walk' ? 0.5 : 1 }]}
            onPress={() => setSelectedCategory('walk')}
            activeOpacity={0.8}
          >
            <Image source={icon_walk} style={styles.iconImage} />
            <Text style={styles.iconText}>걷기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.categoryIcon, { opacity: selectedCategory && selectedCategory !== 'tumblr' ? 0.5 : 1 }]}
            onPress={() => setSelectedCategory('tumblr')}
            activeOpacity={0.8}
          >
            <Image source={icon_tumblr} style={styles.iconImage} />
            <Text style={styles.iconText}>텀블러</Text>
          </TouchableOpacity>
        </View>

        {/* 함께 출발하기 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => {
              console.log('함께 출발하기 버튼 클릭됨');
              router.replace('/home'); // 스택 초기화하고 홈화면으로 이동
            }}
          >
            <Text style={styles.startButtonText}>함께 출발하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F8E1', // background_main
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  titlePattern: {
    width: 400,
    height: 40,
    resizeMode: 'stretch',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    position: 'absolute',
    fontFamily: '109LeantheWall',
  },
  welcomeMessages: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeMessage: {
    fontSize: 18,
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeMessage3: {
    fontSize: 16,
    color: '#006256', // 요청하신 색상
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTitleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  categoryTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
  },
  categoryIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 50,
    gap: 40, // 아이콘 사이의 간격을 조절합니다.
  },
  categoryIcon: {
    alignItems: 'center',
  },
  iconImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 16,
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#006256',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Pretendard Variable',
  },
});

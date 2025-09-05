import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import NotificationPopup from '../components/NotificationPopup';
import { useAuth } from '../contexts/AuthContext';


const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const icon_walk = require('../assets/images/icon_walk.png');
const icon_tumblr = require('../assets/images/icon_tumblr.png');

export default function CategorySetupScreen() {
  const router = useRouter();
  const { setInterests } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 관심활동 설정 함수
  const handleSetInterests = async () => {
    if (!selectedCategory) {
      Alert.alert('알림', '관심 카테고리를 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 선택된 카테고리를 API 형식으로 변환
      const interests = selectedCategory === 'walk' ? ['WALK'] : ['TUMBLER'];
      
      
      // 실제 API 호출
      const result = await setInterests(interests);

      if (result.success) {
        console.log('관심활동 설정 성공:', result.data);
        // 성공 시 알림 팝업 표시
        setShowNotificationPopup(true);
      } else {
        Alert.alert('오류', result.error || '관심활동 설정에 실패했습니다.');
      }
    } catch (error) {
      console.error('관심활동 설정 오류:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
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
            style={[
              styles.categoryIcon, 
              selectedCategory === 'walk' ? styles.categoryIconActive : styles.categoryIconInactive
            ]}
            onPress={() => setSelectedCategory('walk')}
            activeOpacity={0.8}
          >
            <Image 
              source={icon_walk} 
              style={[
                styles.iconImage,
                selectedCategory === 'walk' ? styles.iconImageActive : styles.iconImageInactive
              ]} 
            />
            <Text style={[
              styles.iconText,
              selectedCategory === 'walk' ? styles.iconTextActive : styles.iconTextInactive
            ]}>걷기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryIcon, 
              selectedCategory === 'tumblr' ? styles.categoryIconActive : styles.categoryIconInactive
            ]}
            onPress={() => setSelectedCategory('tumblr')}
            activeOpacity={0.8}
          >
            <Image 
              source={icon_tumblr} 
              style={[
                styles.iconImage,
                selectedCategory === 'tumblr' ? styles.iconImageActive : styles.iconImageInactive
              ]} 
            />
            <Text style={[
              styles.iconText,
              selectedCategory === 'tumblr' ? styles.iconTextActive : styles.iconTextInactive
            ]}>텀블러</Text>
          </TouchableOpacity>
        </View>

        {/* 함께 출발하기 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.startButton, isLoading && styles.disabledButton]}
            onPress={handleSetInterests}
            disabled={isLoading}
          >
            <Text style={styles.startButtonText}>
              {isLoading ? '설정 중...' : '함께 출발하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 알림 허용 팝업 */}
      {showNotificationPopup && (
        <NotificationPopup
          onClose={() => setShowNotificationPopup(false)}
          onConfirm={(settings) => {
            console.log('알림 설정:', settings);
            setShowNotificationPopup(false);
            // 설정 저장 후 홈화면으로 이동
            router.replace('/home');
          }}
        />
      )}
    </View>
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
    paddingTop: 60,
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
  categoryIconActive: {
    // 활성화된 상태의 추가 스타일 (필요시)
  },
  categoryIconInactive: {
    opacity: 0.4, // 비활성화 상태일 때 투명도
  },
  iconImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  iconImageActive: {
    // 활성화된 아이콘 이미지 스타일
  },
  iconImageInactive: {
    opacity: 0.4, // 비활성화된 아이콘 이미지 투명도
  },
  iconText: {
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    fontWeight: '600',
    textAlign: 'center',
  },
  iconTextActive: {
    color: '#006256', // 활성화된 텍스트 색상 (녹색)
  },
  iconTextInactive: {
    color: '#999999', // 비활성화된 텍스트 색상 (회색)
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
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Pretendard Variable',
  },
});

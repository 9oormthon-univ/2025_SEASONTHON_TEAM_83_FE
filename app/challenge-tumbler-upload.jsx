import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import ImageUploader from '../components/ImageUploader';
import { useAuth } from '../contexts/AuthContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeTumblerUploadScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { uploadChallengePhoto, verifyChallenge } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // 업로드 성공 처리
  const handleUploadSuccess = (data) => {
    setUploadedImage(data.photoUrl);
    setUploadedPhotoUrl(data.photoUrl);
    console.log('텀블러 인증 사진 업로드 성공:', data.photoUrl);
  };

  // 업로드 에러 처리
  const handleUploadError = (error) => {
    console.error('텀블러 인증 사진 업로드 실패:', error);
  };

  // 챌린지 완료 처리
  const handleCompleteChallenge = async () => {
    if (!uploadedImage) {
      Alert.alert('알림', '텀블러와 영수증이 함께 찍힌 사진을 업로드해주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      console.log('=== 텀블러 챌린지 완료 프로세스 시작 ===');
      console.log('업로드된 이미지:', uploadedImage);
      console.log('챌린지 ID: 2 (텀블러 챌린지)');
      
      // 1단계: 사진 업로드 API 호출
      console.log('=== 1단계: 사진 업로드 API 호출 ===');
      const uploadResult = await uploadChallengePhoto(2, uploadedImage);
      
      console.log('=== 사진 업로드 API 응답 ===');
      console.log('전체 응답:', JSON.stringify(uploadResult, null, 2));
      console.log('성공 여부:', uploadResult.success);
      console.log('데이터:', uploadResult.data);
      console.log('에러:', uploadResult.error);
      
      if (!uploadResult.success) {
        console.error('❌ 사진 업로드 실패');
        Alert.alert(
          '업로드 실패',
          uploadResult.error || '사진 업로드에 실패했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
        return;
      }
      
      console.log('✅ 사진 업로드 성공');
      console.log('업로드된 사진 URL:', uploadResult.data?.photoUrl);
      
      // 2단계: 사진 인증 검증 API 호출
      console.log('=== 2단계: 사진 인증 검증 API 호출 ===');
      const verifyResult = await verifyChallenge(2);
      
      console.log('=== 사진 인증 검증 API 응답 ===');
      console.log('전체 응답:', JSON.stringify(verifyResult, null, 2));
      console.log('성공 여부:', verifyResult.success);
      console.log('데이터:', verifyResult.data);
      console.log('에러:', verifyResult.error);
      
      if (verifyResult.success) {
        console.log('✅ 텀블러 챌린지 인증 성공');
        console.log('획득 포인트:', verifyResult.data?.reward);
        Alert.alert(
          '챌린지 완료',
          `텀블러 사용 챌린지가 완료되었습니다!\n${verifyResult.data?.reward || 50}포인트가 적립되었습니다.`,
          [
            {
              text: '확인',
              onPress: () => router.replace('/home'),
            },
          ]
        );
      } else {
        console.error('❌ 텀블러 챌린지 인증 실패');
        console.error('실패 이유:', verifyResult.error);
        Alert.alert(
          '인증 실패',
          verifyResult.error || '챌린지 인증에 실패했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      console.error('❌ 텀블러 챌린지 완료 프로세스 오류 발생');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      console.error('전체 오류 객체:', JSON.stringify(error, null, 2));
      Alert.alert(
        '오류',
        `챌린지 완료 중 오류가 발생했습니다.\n오류: ${error.message}`,
        [{ text: '확인' }]
      );
    } finally {
      console.log('=== 텀블러 챌린지 완료 프로세스 종료 ===');
      setIsVerifying(false);
    }
  };

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
              source={require('../assets/images/walk_challenge.png')}
              resizeMode="cover"
            />
          </View>
          
          {/* 포인트 표시 */}
          <View style={styles.pointsContainer}>
            <Text style={styles.challengePoints}>50p</Text>
          </View>
          
          {/* 텀블러 인증 사진 업로드 */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadSectionTitle}>텀블러 인증 사진</Text>
            <Text style={styles.uploadDescription}>
              텀블러와 영수증을 함께 찍어주세요
            </Text>
            <ImageUploader
              challengeId={2} // 텀블러 챌린지 ID
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              placeholder="텀블러와 영수증이 함께 찍힌 사진을 선택해주세요"
              buttonText="인증 사진 선택"
            />
          </View>
          
          {/* 구분선 */}
          <View style={styles.divider} />
          
          {/* 챌린지 조건 */}
          <View style={styles.conditionSection}>
            <Text style={styles.conditionTitle}>챌린지 조건</Text>
            <Text style={styles.conditionText}>
              테이크아웃 또는 매장에서 음료를 받을 때{'\n'}
              반드시 텀블러 사용{'\n'}
              텀블러와 영수증을 함께 찍은 사진 제출 (1회 주문당 1회 인정)
            </Text>
          </View>
          
          {/* 포인트 지급 기준 */}
          <View style={styles.pointSection}>
            <Text style={styles.pointTitle}>포인트 지급 기준</Text>
            <Text style={styles.pointText}>
              1. 1회 사용 시 50P{'\n'}
              2. 하루 최대 1회 인증 가능
            </Text>
          </View>

          {/* 챌린지 완료 버튼 */}
          <TouchableOpacity 
            style={[
              styles.completeButton,
              (!uploadedImage || isVerifying) && styles.disabledButton
            ]}
            onPress={handleCompleteChallenge}
            disabled={!uploadedImage || isVerifying}
          >
            {isVerifying ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.completeButtonText}>인증 중...</Text>
              </View>
            ) : (
              <Text style={styles.completeButtonText}>
                {uploadedImage ? '챌린지 완료' : '인증 사진 업로드 필요'}
              </Text>
            )}
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
    marginBottom: 80,
  },
  challengeTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 20,
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
    height: 140,
    borderRadius: 8,
  },
  pointsContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  challengePoints: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
  },
  uploadButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
    height: 40,
  },
  uploadButtonText: {
    fontSize: 15,
    letterSpacing: 0.3,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily: 'Pretendard Variable',
    color: '#F9F8E1',
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
  uploadSection: {
    marginBottom: 20,
  },
  uploadSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 5,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    marginBottom: 15,
    lineHeight: 20,
  },
  completeButton: {
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
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard Variable',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

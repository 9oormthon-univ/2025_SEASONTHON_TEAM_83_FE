import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';

import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { useAuth } from '../contexts/AuthContext';
import { TokenManager } from '../services/api';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeTumblerUploadScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { uploadChallengePhoto, verifyChallenge, completeChallenge } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // 사진 업로드 처리 (실제 API 호출)
  const handlePhotoUpload = async (photoUri) => {
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      
      console.log('=== 텀블러 사진 업로드 시작 ===');
      console.log('사진 URI:', photoUri);
      console.log('챌린지 ID: 2 (텀블러 챌린지)');
      
      // 사진 업로드 API 호출 (미션 시작 여부와 상관없이 업로드)
      console.log('=== 사진 업로드 API 호출 ===');
      
      // FormData 생성
      const formData = new FormData();
      
      console.log('=== FormData 생성 시작 ===');
      console.log('photoUri 타입:', typeof photoUri);
      console.log('photoUri 값:', photoUri);
      console.log('photoUri가 file://로 시작하는가:', photoUri?.startsWith('file://'));
      
      const fileObject = {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'challenge_photo.jpg',
      };
      
      console.log('fileObject:', fileObject);
      
      formData.append('file', fileObject);
      
      console.log('FormData 생성 완료');
      console.log('FormData _parts:', formData._parts);
      console.log('FormData _parts 길이:', formData._parts?.length);
      console.log('FormData _parts[0]:', formData._parts?.[0]);
      console.log('FormData _parts[0][1]:', formData._parts?.[0]?.[1]);
      
      // 직접 fetch 사용
      const token = await TokenManager.getToken();
      const uploadUrl = `https://dev.seonyeong.site/api/challenges/2/photo`;
      
      console.log('업로드 URL:', uploadUrl);
      console.log('토큰 존재 여부:', !!token);
      
      console.log('=== fetch 요청 시작 ===');
      console.log('요청 URL:', uploadUrl);
      console.log('요청 메서드: POST');
      console.log('요청 헤더:', {
        'Authorization': `Bearer ${token}`,
      });
      console.log('요청 body 타입:', typeof formData);
      console.log('요청 body:', formData);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Content-Type을 설정하지 않음 - React Native가 자동으로 multipart/form-data로 설정
        },
        body: formData,
      });
      
      console.log('=== fetch 응답 수신 ===');
      console.log('응답 상태:', uploadResponse.status);
      console.log('응답 상태 텍스트:', uploadResponse.statusText);
      console.log('응답 헤더:', Object.fromEntries(uploadResponse.headers.entries()));
      
      console.log('=== 사진 업로드 API 응답 수신 ===');
      console.log('상태 코드:', uploadResponse.status);
      console.log('응답 헤더:', Object.fromEntries(uploadResponse.headers.entries()));
      
      const uploadResponseText = await uploadResponse.text();
      console.log('응답 본문 (원본):', uploadResponseText);
      
      let uploadData;
      if (uploadResponseText.trim() === '') {
        console.log('⚠️ 빈 응답 수신');
        uploadData = { message: 'Empty response' };
      } else {
        try {
          uploadData = JSON.parse(uploadResponseText);
          console.log('응답 본문 (파싱됨):', JSON.stringify(uploadData, null, 2));
        } catch (parseError) {
          console.error('❌ JSON 파싱 오류:', parseError);
          console.error('파싱 실패한 텍스트:', uploadResponseText);
          throw new Error(`JSON Parse error: ${parseError.message}`);
        }
      }

      if (!uploadResponse.ok) {
        // 409 에러는 조용히 처리 (이미 리워드를 지급받은 미션)
        if (uploadResponse.status === 409) {
          console.log('이미 리워드를 지급받은 미션입니다. (409 에러 무시)');
          return {
            success: false,
            error: '이미 리워드를 지급받은 미션입니다.',
            isAlreadyCompleted: true
          };
        }
        
        console.error(`❌ HTTP 오류: ${uploadResponse.status}`);
        console.error(`오류 메시지: ${uploadData.message || '요청 실패'}`);
        
        // 413 에러 특별 처리
        if (uploadResponse.status === 413) {
          throw new Error('HTTP 413: 사진 파일이 너무 큽니다. 더 작은 사진을 선택해주세요.');
        }
        
        throw new Error(`HTTP ${uploadResponse.status}: ${uploadData.message || '요청 실패'}`);
      }
      
      console.log('✅ 사진 업로드 성공');
      console.log('업로드된 사진 URL:', uploadData.result?.photoUrl);
      
      const uploadResult = {
        success: true,
        data: uploadData.result,
        message: uploadData.message,
      };
      
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
      
      // 업로드 성공 처리
      setUploadedImage(uploadResult.data?.photoUrl);
      setUploadedPhotoUrl(uploadResult.data?.photoUrl);
      setUploadSuccess(true);

      
      Alert.alert(
        '업로드 완료',
        '사진이 성공적으로 업로드되었습니다!\n이제 챌린지 완료 버튼을 눌러주세요.',
        [{ text: '확인' }]
      );
      
    } catch (error) {
      console.error('❌ 사진 업로드 프로세스 오류 발생');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      Alert.alert(
        '오류',
        `사진 업로드 중 오류가 발생했습니다.\n오류: ${error.message}`,
        [{ text: '확인' }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 선택 함수 (갤러리 또는 카메라)
  const selectImage = async () => {
    try {
      Alert.alert(
        '사진 선택',
        '어떤 방법으로 사진을 가져오시겠습니까?',
        [
          {
            text: '갤러리에서 선택',
            onPress: () => selectFromGallery(),
          },
          {
            text: '카메라로 촬영',
            onPress: () => takePhoto(),
          },
          {
            text: '취소',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('이미지 선택 실패:', error);
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  // 갤러리에서 이미지 선택
  const selectFromGallery = async () => {
    try {
      // 갤러리 권한 요청
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      // 갤러리에서 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // 품질을 더 낮춰서 파일 크기 줄이기
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        console.log('갤러리에서 이미지 선택됨:', imageUri);
        
        // 이미지 선택 후 자동으로 업로드 시작
        handlePhotoUpload(imageUri);
      }
    } catch (error) {
      console.error('갤러리에서 이미지 선택 실패:', error);
      Alert.alert('오류', '갤러리에서 이미지 선택 중 오류가 발생했습니다.');
    }
  };

  // 카메라로 사진 촬영
  const takePhoto = async () => {
    try {
      // 카메라 권한 요청
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
        return;
      }

      // 카메라로 사진 촬영
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // 품질을 더 낮춰서 파일 크기 줄이기
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        console.log('카메라로 촬영된 이미지:', imageUri);
        
        // 이미지 선택 후 자동으로 업로드 시작
        handlePhotoUpload(imageUri);
      }
    } catch (error) {
      console.error('카메라 촬영 실패:', error);
      Alert.alert('오류', '카메라 촬영 중 오류가 발생했습니다.');
    }
  };

  const handleVerifyChallenge = async () => {
    try {

      setIsVerifying(true);
      console.log('사진 인증 검증 시작ㄹㄹㅇㅇ');
      
      const response = await completeChallenge(2);
      
      if (response.success) {
        console.log('사진 인증 검증 성공:', response.data);
        Alert.alert(
          '인증 성공!', 
          `챌린지 인증이 완료되었습니다!\n리워드: ${response.data.rewardPoint || 0}포인트`,
          [
            {
              text: '확인',
              onPress: () => router.push('/home'),
            },
          ]
        );
      } else {
        console.error('사진 인증 검증 실패:', response.error);
        Alert.alert('인증 실패', response.error || '사진 인증에 실패했습니다.');
      }
    } catch (error) {
      console.error('사진 인증 검증 오류:', error);
      Alert.alert('오류', '사진 인증 중 오류가 발생했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };
  // 챌린지 완료 처리 (검증만)
  const handleCompleteChallenge = async () => {
    if (!uploadSuccess) {
      Alert.alert('알림', '먼저 사진을 업로드해주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      console.log('=== 텀블러 챌린지 검증 시작 ===');
      console.log('업로드된 이미지:', uploadedImage);
      console.log('챌린지 ID: 2 (텀블러 챌린지)');
      
      // 사진 인증 검증 API 호출
      console.log('=== 사진 인증 검증 API 호출 ===');
      const verifyResult = await verifyChallenge(2);
      
      console.log('=== 사진 인증 검증 API 응답 ===');
      console.log('전체 응답:', JSON.stringify(verifyResult, null, 2));
      console.log('성공 여부:', verifyResult.success);
      console.log('데이터:', verifyResult.data);
      console.log('에러:', verifyResult.error);
      
      if (verifyResult.success && verifyResult.data) {
        // 인증 결과 확인
        if (verifyResult.data.success) {
          // 인증 성공
          console.log('✅ 텀블러 챌린지 인증 성공');
          console.log('획득 포인트:', verifyResult.data?.reward || 0);
          
          setUploadSuccess(true);
          setUploadedPhotoUrl(uploadedPhotoUrl);
          setUploadedImage(uploadedImage);
          setShowModal(true)
          
          // 포인트 획득 알림
          if (verifyResult.data.reward && verifyResult.data.reward > 0) {
            Alert.alert(
              '🎉 챌린지 완료!',
              `텀블러 챌린지를 성공적으로 완료했습니다!\n획득 포인트: ${verifyResult.data.reward}P`,
              [
                {
                  text: '확인',
                  onPress: () => router.push('/home'),
                },
              ]
            );
          } else {
            Alert.alert(
              '✅ 챌린지 완료',
              '텀블러 챌린지를 성공적으로 완료했습니다!',
              [
                {
                  text: '확인',
                  onPress: () => router.push('/home'),
                },
              ]
            );
          }
        } else {
          // 인증 실패
          console.log('❌ 텀블러 챌린지 인증 실패');
          console.log('실패 메시지:', verifyResult.data.message);
          
          Alert.alert(
            '인증 실패',
            verifyResult.data.message || '텀블러와 영수증이 제대로 보이게 다시 찍어주세요.',
            [
              {
                text: '다시 촬영',
                onPress: () => {
                  setSelectedImage(null);
                  setUploadSuccess(false);
                  setUploadedPhotoUrl(null);
                  setUploadedImage(null);
                }
              },
              { text: '확인' }
            ]
          );
        }
      } else {
        // 409 에러 (이미 리워드를 지급받은 미션)는 조용히 처리
        if (verifyResult.error && verifyResult.error.includes('409')) {
          console.log('이미 리워드를 지급받은 미션입니다. (409 에러 무시)');
          Alert.alert(
            '알림',
            '이미 완료된 챌린지입니다.',
            [{ text: '확인', onPress: () => router.push('/home') }]
          );
          return;
        }
        
        console.error('❌ 텀블러 챌린지 인증 API 오류');
        console.error('오류:', verifyResult.error);
        // AI 서버 오류인 경우 특별한 메시지 표시
        const isAIServerError = verifyResult.error && verifyResult.error.includes('AI 서버');
        Alert.alert(
          '인증 오류',
          isAIServerError 
            ? '사진 분석 서버에 일시적인 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.'
            : verifyResult.error || '챌린지 인증 중 오류가 발생했습니다. 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      // 409 에러 (이미 리워드를 지급받은 미션)는 조용히 처리
      if (error.message && error.message.includes('409')) {
        console.log('이미 리워드를 지급받은 미션입니다. (409 에러 무시)');
        Alert.alert(
          '알림',
          '이미 완료된 챌린지입니다.',
          [{ text: '확인', onPress: () => router.push('/home') }]
        );
        return;
      }
      
      console.error('❌ 텀블러 챌린지 검증 오류 발생');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      Alert.alert(
        '오류',
        `챌린지 검증 중 오류가 발생했습니다.\n오류: ${error.message}`,
        [{ text: '확인' }]
      );
    } finally {
      console.log('=== 텀블러 챌린지 검증 종료 ===');
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
          {/* <Text style={styles.challengeTitle}>텀블러 사용</Text> */}
          
          {/* 챌린지 이미지 */}
          {/* <View style={styles.imageContainer}>
            <Image 
              style={styles.challengeImage}
              source={require('../assets/images/tumbler.png')}
              resizeMode="cover"
            />
          </View> */}
          
          {/* 포인트 표시 */}
          {/* <View style={styles.pointsContainer}>
            <Text style={styles.challengePoints}>50p</Text>
          </View> */}
          
          {/* 텀블러 인증 사진 업로드 */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadSectionTitle}>텀블러 인증 사진</Text>
            <Text style={styles.uploadDescription}>
              텀블러와 영수증을 함께 찍어주세요
            </Text>
            {/* 이미지 선택 버튼 */}
            <TouchableOpacity 
              style={styles.imageSelectButton}
              onPress={selectImage}
              disabled={isUploading}
            >
              {isUploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator color="#006256" size="small" />
                  <Text style={styles.uploadingText}>업로드 중...</Text>
                </View>
              ) : selectedImage ? (
                <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                  <Text style={styles.selectedImageText}>사진이 선택되었습니다</Text>
                </View>
              ) : (
                <View style={styles.imageSelectContainer}>
                  <Text style={styles.imageSelectText}>인증 사진 선택</Text>
                  <Text style={styles.imageSelectSubText}>텀블러와 영수증이 함께 찍힌 사진을 선택해주세요</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* 구분선 */}
          <View style={styles.divider} />
          
          {/* 챌린지 조건 */}
          <View style={styles.conditionSection}>
            <Text style={styles.conditionTitle}>챌린지 조건</Text>
            <Text style={styles.conditionTextContainer}>
              <Text style={[styles.conditionText, styles.conditionTextBold]}>
                {`테이크아웃 또는 매장에서 음료를 받을 때
반드시 텀블러 사용
`}
              </Text>
              <Text style={styles.conditionTextSub}>
                {`카페 영수증 + 텀블러 사진 제출 (1회 주문당 1회 인정)
`}
              </Text>
              <Text style={styles.conditionTextBlank}>
                {' '}
              </Text>
              {/* <Text style={[styles.conditionTextBold, styles.conditionTextBlank]}>
                {`포인트 지급 기준
`}
              </Text>
              <Text style={styles.conditionTextSub}>
                {`1회 사용 시 50P
하루 최대 1회 인증 가능`}
              </Text> */}
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
              (!uploadSuccess || isVerifying) && styles.disabledButton
            ]}
            onPress={handleCompleteChallenge}
            disabled={!uploadSuccess || isVerifying}
          >
            {isVerifying ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.completeButtonText}>인증 중...</Text>
              </View>
            ) : (
              <Text style={styles.completeButtonText}>
                {uploadSuccess ? '챌린지 완료' : '사진 업로드 후 활성화'}
              </Text>
            )}
          </TouchableOpacity>
          
        </View>
      </ScrollView>
      

      {/* 챌린지 성공 모달 */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>챌린지 성공!</Text>
            
            <TouchableOpacity 
              style={[styles.rewardButton, isVerifying && styles.disabledButton]}
              onPress={handleVerifyChallenge}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.rewardButtonText}>리워드 받기</Text>
              )}
            </TouchableOpacity>
            
            <LinearGradient 
              style={styles.modalGradient} 
              colors={['#fffff6', '#faf8d7', '#a0f4eb']} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}}
            />
          </View>
        </View>
              </Modal>
        
        


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
  conditionTextContainer: {
    width: 302,
    lineHeight: 28,
    marginLeft: 16,
    textAlign: 'left',
  },
  conditionText: {
    color: '#000',
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    fontSize: 14,
  },
  conditionTextBold: {
    fontWeight: '700',
    lineHeight: 28,
    fontFamily: 'Pretendard Variable',
  },
  conditionTextSub: {
    fontSize: 14,
    color: '#6b6b6b',
    fontFamily: 'Pretendard Variable',
  },
  conditionTextBlank: {
    color: '#000',
    fontFamily: 'Pretendard Variable',
  },
  pointSection: {
    marginBottom: 0,
    marginTop: -10,
  },
  pointTitle: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 5,
  },
  pointText: {
    fontSize: 16,
    lineHeight: 18,
    color: '#6B6B6B',
    marginLeft: 16,
    fontFamily: 'Pretendard Variable',
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
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
  imageSelectButton: {
    borderWidth: 2,
    borderColor: '#006256',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  imageSelectContainer: {
    alignItems: 'center',
  },
  imageSelectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
    marginBottom: 4,
  },
  imageSelectSubText: {
    fontSize: 14,
    color: '#6B6B6B',
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 16,
    color: '#006256',
    fontFamily: 'Pretendard Variable',
    marginLeft: 8,
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedImageText: {
    fontSize: 14,
    color: '#006256',
    fontFamily: 'Pretendard Variable',
    fontWeight: '500',
  },



  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: 183,
    width: '80%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderStyle: 'solid',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalTitle: {
    fontSize: 24,
    letterSpacing: -0.3,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#0061E9',
    textAlign: 'center',
    marginBottom: 30,
    zIndex: 1,
  },
  rewardButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 8,
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
    zIndex: 1,
  },
  rewardButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
  modalGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.6,
  },
});

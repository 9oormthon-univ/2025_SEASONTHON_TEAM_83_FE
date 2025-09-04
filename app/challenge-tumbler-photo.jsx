import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import RewardPopup from '../components/RewardPopup';
import AuthService from '../services/authService';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function ChallengeTumblerPhotoScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const challengeId = 5; // 텀블러 챌린지 ID
  
  // 헤더 숨기기
  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  // 사진 인증 검증 처리
  const handleVerifyChallenge = async () => {
    try {
      setIsVerifying(true);
      console.log('사진 인증 검증 시작:', challengeId);
      
      const response = await AuthService.verifyChallenge(challengeId);
      
      if (response.success) {
        console.log('사진 인증 검증 성공:', response.data);
        Alert.alert(
          '인증 성공!', 
          `챌린지 인증이 완료되었습니다!\n리워드: ${response.data.reward || 0}포인트`,
          [
            {
              text: '확인',
              onPress: () => setShowRewardPopup(true),
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
              source={require('../assets/images/tumblr_challenge.png')}
              resizeMode="cover"
            />
          </View>
          
          {/* 사진 업로드 버튼 */}
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.uploadButtonText}>사진 인증하기</Text>
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
        
        {/* 리워드 팝업 */}
        {showRewardPopup && (
          <RewardPopup onClose={() => setShowRewardPopup(false)} />
        )}
        
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
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  challengeImage: {
    width: '100%',
    height: 340,
    borderRadius: 8,
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
    height: 40,
  },
  uploadButtonText: {
    fontSize: 15,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'Pretendard Variable',
    color: '#F9F8E1',
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

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import TreePopup from '../components/TreePopup';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function RewardConversionScreen() {
  const router = useRouter();
  
  // 팝업 관련 상태
  const [currentPopupIndex, setCurrentPopupIndex] = useState(-1);
  const [isPopupSequenceActive, setIsPopupSequenceActive] = useState(false);
  
  // 4개의 팝업 메시지
  const popupMessages = [
    "리워드 전환 완료!",
    "하나의 나무, 하나의 변화.\n당신이 시작했습니다.",
    "함께 심은 나무, 함께 키워가는 지구.",
    "당신의 실천이 지구에\n초록 숨결을 더합니다."
  ];

  // 팝업 시퀀스 제어
  useEffect(() => {
    if (isPopupSequenceActive && currentPopupIndex < popupMessages.length) {
      const timer = setTimeout(() => {
        if (currentPopupIndex < popupMessages.length - 1) {
          setCurrentPopupIndex(currentPopupIndex + 1);
        } else {
          // 마지막 팝업 후 시퀀스 종료
          setTimeout(() => {
            setCurrentPopupIndex(-1);
            setIsPopupSequenceActive(false);
          }, 2000); // 마지막 팝업도 2초간 표시
        }
      }, 2000); // 2초 간격

      return () => clearTimeout(timer);
    }
  }, [isPopupSequenceActive, currentPopupIndex, popupMessages.length]);

  // 리워드 전환 버튼 핸들러
  const handleRewardConversion = () => {
    setCurrentPopupIndex(0);
    setIsPopupSequenceActive(true);
  };

  // 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setCurrentPopupIndex(-1);
    setIsPopupSequenceActive(false);
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

      <View style={styles.content}>
        {/* 보유 포인트 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>보유 포인트</Text>
        </View>

        {/* 현재 보유 포인트 표시 */}
        <View style={styles.currentPointsSection}>
          <Text style={styles.currentPointsText}>
            현재 보유 포인트는 <Text style={styles.pointsValue}>30p</Text> 입니다.
          </Text>
        </View>

        {/* 포인트 입력 필드 */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="전환할 포인트를 입력해주세요."
              placeholderTextColor="#9C9C9C"
            />
            <TouchableOpacity style={styles.arrowButton}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 나무 심기로 전환 섹션 */}
        <View style={styles.treeSection}>
          <View style={styles.treeHeader}>
            <View style={styles.treeTextContainer}>
              <Text style={styles.treeTitle}>나무 심기로 전환</Text>
              <Text style={styles.treeSubtitle}>현재 심을 수 있는 나무는 3그루 입니다.</Text>
            </View>
            <TouchableOpacity style={styles.plantTreeButton}>
              <Text style={styles.plantTreeText}>나무심기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 리워드 전환 내역 섹션 */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>리워드 전환 내역</Text>
          <ScrollView 
            style={styles.historyCard}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {/* 더미데이터로 채워진 내역 */}
            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Image 
                    source={require('../assets/images/icon_reward.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyItemTitle}>나무 심기 전환</Text>
                  <Text style={styles.historyItemSubtitle}>2025-01-15</Text>
                </View>
              </View>
              <Text style={styles.historyPoints}>-100p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Image 
                    source={require('../assets/images/icon_badge.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyItemTitle}>뱃지 획득</Text>
                  <Text style={styles.historyItemSubtitle}>2025-01-14</Text>
                </View>
              </View>
              <Text style={styles.historyPoints}>+50p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Image 
                    source={require('../assets/images/icon_reward.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyItemTitle}>나무 심기 전환</Text>
                  <Text style={styles.historyItemSubtitle}>2025-01-12</Text>
                </View>
              </View>
              <Text style={styles.historyPoints}>-200p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Image 
                    source={require('../assets/images/icon_point.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyItemTitle}>포인트 적립</Text>
                  <Text style={styles.historyItemSubtitle}>2025-01-10</Text>
                </View>
              </View>
              <Text style={styles.historyPoints}>+150p</Text>
            </View>

            <View style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Image 
                    source={require('../assets/images/icon_reward.png')} 
                    style={styles.iconImage}
                  />
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyItemTitle}>나무 심기 전환</Text>
                  <Text style={styles.historyItemSubtitle}>2025-01-08</Text>
                </View>
              </View>
              <Text style={styles.historyPoints}>-100p</Text>
            </View>
          </ScrollView>
        </View>

        {/* 리워드 전환 버튼 */}
        <TouchableOpacity style={styles.rewardButton} onPress={handleRewardConversion}>
          <Text style={styles.rewardButtonText}>리워드 전환</Text>
        </TouchableOpacity>
      </View>
      
      {/* 나무 팝업 시퀀스 */}
      {currentPopupIndex >= 0 && (
        <TreePopup 
          visible={true}
          onClose={handleClosePopup}
          message={popupMessages[currentPopupIndex]}
          isFirstPopup={currentPopupIndex === 0}
        />
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
  currentPointsSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentPointsText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  pointsValue: {
    color: '#0061E9',
  },
  inputSection: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 4,
    paddingHorizontal: 17,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputField: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  arrowButton: {
    width: 25,
    height: 25,
    backgroundColor: '#006256',
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  treeSection: {
    marginBottom: 20,
  },
  treeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  treeTextContainer: {
    flex: 1,
  },
  treeTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 6,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  treeSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#6B6B6B',
    textAlign: 'left',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  plantTreeButton: {
    backgroundColor: '#006256',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  plantTreeText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard Variable',
    color: '#F9F8E1',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  historySection: {
    marginBottom: 30,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: 200, // 높이를 160에서 180으로 증가
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  historyContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  historyItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#666666',
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#006256',
  },
  rewardButton: {
    width: '100%',
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
  },
  rewardButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
});

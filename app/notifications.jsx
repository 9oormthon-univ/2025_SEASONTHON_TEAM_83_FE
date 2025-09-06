import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import NotificationDetailModal from '../components/NotificationDetailModal';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function NotificationsScreen() {
  const router = useRouter();
  const [readProcessing, setReadProcessing] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      content: '텀블러 사용 인증 성공! 50P가 쌓였어요.', 
      type: 'activity',
      isSelected: false 
    },
    { 
      id: 2, 
      content: '5,000P로 지역화폐 전환이 가능해요. 지금 교환하러 가볼까요?', 
      type: 'reward',
      isSelected: false 
    },
    { 
      id: 3, 
      content: '이번 주 포인트 랭킹 5위에 올랐습니다.', 
      type: 'reward',
      isSelected: false 
    },
    { 
      id: 4, 
      content: '새싹 뱃지를 획득했어요! 첫 500P 달성 축하합니다.', 
      type: 'badge',
      isSelected: false 
    },
    { 
      id: 5, 
      content: '1Km 걷기 챌린지 완료! 20P를 획득했습니다.', 
      type: 'activity',
      isSelected: false 
    },
    { 
      id: 6, 
      content: '친구 초대 성공! 100P 보너스를 받았어요.', 
      type: 'reward',
      isSelected: false 
    },
  ]);

  const toggleNotification = (id) => {
    if (!isSelectionMode) return;
    
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleReadProcessing = () => {
    const newReadProcessing = !readProcessing;
    setReadProcessing(newReadProcessing);
    
    if (newReadProcessing) {
      // 모든 알림을 읽음 처리
      const allNotificationIds = notifications.map(n => n.id);
      setReadNotifications(new Set(allNotificationIds));
    }
  };

  const toggleDeleteAll = () => {
    const newDeleteAll = !deleteAll;
    setDeleteAll(newDeleteAll);
    
    if (newDeleteAll) {
      // 전체 삭제 확인 팝업
      Alert.alert(
        '전체 삭제',
        '모든 알림을 삭제하시겠습니까?',
        [
          {
            text: '취소',
            onPress: () => setDeleteAll(false),
            style: 'cancel'
          },
          {
            text: '삭제',
            onPress: () => {
              setNotifications([]);
              setReadNotifications(new Set());
              setSelectedNotifications([]);
            },
            style: 'destructive'
          }
        ]
      );
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedNotifications([]);
    }
  };

  const handleDeleteSelected = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    // 선택된 알림들을 필터링하여 제거
    const updatedNotifications = notifications.filter(
      notification => !selectedNotifications.includes(notification.id)
    );
    // 실제로는 상태 업데이트나 API 호출이 필요
    console.log('삭제된 알림:', selectedNotifications);
    setSelectedNotifications([]);
    setIsSelectionMode(false);
    setShowDeletePopup(false);
  };

  const handleNotificationPress = (notification) => {
    if (isSelectionMode) {
      // 선택 모드일 때는 토글만
      toggleNotification(notification.id);
    } else {
      // 일반 모드일 때는 상세 모달 표시하고 읽음 처리
      setSelectedNotification(notification);
      setShowDetailModal(true);
      
      // 해당 알림을 읽음 처리
      setReadNotifications(prev => new Set([...prev, notification.id]));
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'activity':
        return '활동';
      case 'reward':
        return '리워드';
      case 'badge':
        return '뱃지';
      default:
        return '알림';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'activity':
        return '#00DDC5';
      case 'reward':
        return '#FFB800';
      case 'badge':
        return '#8B5CF6';
      default:
        return '#006256';
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
        <TouchableOpacity style={styles.notificationButton}>
          <Image
            source={require('../assets/images/icon_alarm.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 토글 설정 */}
        <View style={styles.toggleSection}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>읽음 처리</Text>
            <TouchableOpacity 
              style={[styles.toggle, readProcessing && styles.toggleActive]}
              onPress={toggleReadProcessing}
            >
              <View style={[styles.toggleCircle, readProcessing && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>전체 삭제</Text>
            <TouchableOpacity 
              style={[styles.toggle, deleteAll && styles.toggleActive]}
              onPress={toggleDeleteAll}
            >
              <View style={[styles.toggleCircle, deleteAll && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 알림 헤더 */}
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>현재 알림({notifications.length}개)</Text>
          <View style={styles.headerButtons}>
            {isSelectionMode && selectedNotifications.length > 0 && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteSelected}
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleSelectionMode}>
              <Text style={styles.selectButton}>
                {isSelectionMode ? '취소' : '선택'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 알림 목록 */}
        <View style={styles.notificationList}>
          {notifications.map((notification, index) => {
            const isRead = readNotifications.has(notification.id);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  index === 0 && styles.firstItem,
                  index === notifications.length - 1 && styles.lastItem,
                  isSelectionMode && styles.notificationItemSelectionMode,
                ]}
                onPress={() => handleNotificationPress(notification)}
              >
                <View style={styles.notificationContentContainer}>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) }]}>
                    <Text style={styles.typeText}>{getTypeLabel(notification.type)}</Text>
                  </View>
                  <Text style={[
                    styles.notificationContent,
                    isRead && styles.readNotificationContent
                  ]}>
                    {notification.content.length > 10 
                      ? notification.content.substring(0, 10) + '...' 
                      : notification.content
                    }
                  </Text>
                </View>
                {isSelectionMode && (
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => toggleNotification(notification.id)}
                  >
                    <View style={[
                      styles.radioCircle,
                      selectedNotifications.includes(notification.id) && styles.radioCircleSelected
                    ]} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      <CustomTabBar />

      {/* 삭제 확인 팝업 */}
      {showDeletePopup && (
        <View style={styles.deletePopupOverlay}>
          <View style={styles.deletePopup}>
            <Text style={styles.deletePopupTitle}>알림 삭제</Text>
            <Text style={styles.deletePopupMessage}>
              선택한 {selectedNotifications.length}개의 알림을 삭제하시겠습니까?
            </Text>
            <View style={styles.deletePopupButtons}>
              <TouchableOpacity 
                style={styles.deletePopupCancelButton}
                onPress={() => setShowDeletePopup(false)}
              >
                <Text style={styles.deletePopupCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deletePopupConfirmButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deletePopupConfirmText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 알림 상세 모달 */}
      <NotificationDetailModal
        visible={showDetailModal}
        notification={selectedNotification}
        onClose={closeDetailModal}
      />
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
    marginBottom: 40,
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
    width: 40,
    height: 40,
    top: 70,

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
  toggleSection: {
    marginBottom: 30,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleLabel: {
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
  },
  toggle: {
    width: 54,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#006256',
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
  },
  selectButton: {
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontFamily: 'Pretendard Variable',
    color: '#0F0F0F',
  },
  notificationList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: '#FFFFF6',
    borderBottomWidth: 1,
    borderBottomColor: '#D6D6D6',
  },
  firstItem: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  notificationContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
  notificationContent: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontFamily: 'Pretendard Variable',
    color: '#525252',
    flex: 1,
  },
  readNotificationContent: {
    color: '#9E9E9E',
  },
  radioButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: '#D6D6D6',
    backgroundColor: 'transparent',
  },
  radioCircleSelected: {
    backgroundColor: '#006256',
    borderColor: '#006256',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
  notificationItemSelectionMode: {
    backgroundColor: '#F8F8F8',
  },
  deletePopupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  deletePopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  deletePopupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 16,
    textAlign: 'center',
  },
  deletePopupMessage: {
    fontSize: 16,
    color: '#525252',
    fontFamily: 'Pretendard Variable',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  deletePopupButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deletePopupCancelButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
  },
  deletePopupCancelText: {
    color: '#525252',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
  },
  deletePopupConfirmButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
  },
  deletePopupConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
  },
});

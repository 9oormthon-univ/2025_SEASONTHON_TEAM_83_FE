import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import PermissionService from "../services/permissionService";

const NotificationPopup = ({ onClose, onConfirm }) => {
  const { 
    updateAgreements, 
    requestLocationPermission, 
    requestNotificationPermission 
  } = useAuth();
  const [pushNotification, setPushNotification] = useState(true);
  const [locationService, setLocationService] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      let actualLocationPermission = false;
      let actualNotificationPermission = false;

      // 위치 서비스 권한 요청
      if (locationService) {
        const locationResult = await requestLocationPermission();
        actualLocationPermission = locationResult.success;
        
        if (!locationResult.success) {
          Alert.alert(
            '위치 서비스 권한 필요', 
            '챌린지 인증을 위해 위치 서비스 권한이 필요합니다.',
            [
              { text: '취소', onPress: () => setLocationService(false) },
              { text: '설정으로 이동', onPress: async () => {
                await PermissionService.openAppSettings();
                setLocationService(false);
              }}
            ]
          );
        }
      }

      // 푸시 알림 권한 요청
      if (pushNotification) {
        const notificationResult = await requestNotificationPermission();
        actualNotificationPermission = notificationResult.success;
        
        if (!notificationResult.success) {
          Alert.alert(
            '푸시 알림 권한 필요', 
            '중요한 알림을 받기 위해 푸시 알림 권한이 필요합니다.',
            [
              { text: '취소', onPress: () => setPushNotification(false) },
              { text: '설정으로 이동', onPress: async () => {
                await PermissionService.openAppSettings();
                setPushNotification(false);
              }}
            ]
          );
        }
      }

      // 실제 권한 상태로 서버에 저장
      const agreements = {
        "allowLocation": actualLocationPermission,
        "allowPush": actualNotificationPermission
      };

      // 실제 API 호출
      const result = await updateAgreements(agreements);

      if (result.success) {
        console.log('동의항목 수정 성공:', result.data);
        // 실제 권한 상태로 onConfirm 콜백 호출
        onConfirm({ 
          pushNotification: actualNotificationPermission, 
          locationService: actualLocationPermission 
        });
      } else {
        Alert.alert('오류', result.error || '동의항목 수정에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '권한 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        {/* 제목 */}
        <Text style={styles.title}>알림</Text>

        {/* 푸시 알림 토글 */}
        <View style={styles.toggleRow}>
          <Text style={styles.label}>푸시 알림 허용</Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              pushNotification ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => setPushNotification(!pushNotification)}
          >
            <View style={[
              styles.toggleHandle,
              pushNotification ? styles.toggleHandleActive : styles.toggleHandleInactive
            ]} />
          </TouchableOpacity>
        </View>

        {/* 위치 서비스 토글 */}
        <View style={styles.toggleRow}>
          <Text style={styles.label}>위치 서비스 허용</Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              locationService ? styles.toggleActive : styles.toggleInactive
            ]}
            onPress={() => setLocationService(!locationService)}
          >
            <View style={[
              styles.toggleHandle,
              locationService ? styles.toggleHandleActive : styles.toggleHandleInactive
            ]} />
          </TouchableOpacity>
        </View>

        {/* 확인 버튼 */}
        <TouchableOpacity 
          style={[styles.confirmButton, isLoading && styles.disabledButton]} 
          onPress={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>확인</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
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
  popup: {
    backgroundColor: '#FFFFF6',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D6D6D6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F0F0F',
    fontFamily: 'Pretendard Variable',
    marginBottom: 24,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    letterSpacing: 0.3,
    lineHeight: 24,
    color: '#0F0F0F',
    fontFamily: 'Pretendard Variable',
    flex: 1,
  },
  toggle: {
    width: 54,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#006256',
  },
  toggleInactive: {
    backgroundColor: '#E0E0E0',
  },
  toggleHandle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  toggleHandleActive: {
    alignSelf: 'flex-end',
  },
  toggleHandleInactive: {
    alignSelf: 'flex-start',
  },
  confirmButton: {
    backgroundColor: '#006256',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.6,
  },
});

export default NotificationPopup;

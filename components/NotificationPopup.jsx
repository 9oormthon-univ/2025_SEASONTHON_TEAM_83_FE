import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NotificationPopup = ({ onClose, onConfirm }) => {
  const [pushNotification, setPushNotification] = useState(true);
  const [locationService, setLocationService] = useState(true);

  const handleConfirm = () => {
    onConfirm({ pushNotification, locationService });
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
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>확인</Text>
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
});

export default NotificationPopup;

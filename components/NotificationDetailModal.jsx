import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const NotificationDetailModal = ({ visible, notification, onClose }) => {
  if (!notification) return null;

  const getTypeLabel = (type) => {
    switch (type) {
      case 'activity':
        return '활동 인증';
      case 'reward':
        return '포인트/리워드';
      case 'badge':
        return '뱃지/성취';
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
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) }]}>
              <Text style={styles.typeText}>{getTypeLabel(notification.type)}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* 내용 */}
          <View style={styles.content}>
            <Text style={styles.fullContent} numberOfLines={0}>
              {notification.content || '알림 내용이 없습니다.'}
            </Text>
          </View>

          {/* 하단 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#525252',
  },
  content: {
    padding: 20,
    minHeight: 100,
  },
  fullContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    textAlign: 'left',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: '#006256',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
});

export default NotificationDetailModal;

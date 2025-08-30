import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function NotificationsScreen() {
  const router = useRouter();
  const [readProcessing, setReadProcessing] = useState(false);
  const [deleteAll, setDeleteAll] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const notifications = [
    { id: 1, content: '미리보기 내용', isSelected: false },
    { id: 2, content: '미리보기 내용', isSelected: false },
    { id: 3, content: '미리보기 내용', isSelected: false },
    { id: 4, content: '미리보기 내용', isSelected: false },
    { id: 5, content: '미리보기 내용', isSelected: false },
    { id: 6, content: '미리보기 내용', isSelected: false },
  ];

  const toggleNotification = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleReadProcessing = () => setReadProcessing(!readProcessing);
  const toggleDeleteAll = () => setDeleteAll(!deleteAll);

  return (
    <SafeAreaView style={styles.container}>
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
          <TouchableOpacity>
            <Text style={styles.selectButton}>선택</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 목록 */}
        <View style={styles.notificationList}>
          {notifications.map((notification, index) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                index === 0 && styles.firstItem,
                index === notifications.length - 1 && styles.lastItem,
              ]}
              onPress={() => toggleNotification(notification.id)}
            >
              <Text style={styles.notificationContent}>{notification.content}</Text>
              <TouchableOpacity 
                style={styles.radioButton}
                onPress={() => toggleNotification(notification.id)}
              >
                <View style={[
                  styles.radioCircle,
                  selectedNotifications.includes(notification.id) && styles.radioCircleSelected
                ]} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <CustomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
  },
  header: {
    position: 'relative',
    height: 80,
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
    top: 10,
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
  notificationContent: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontFamily: 'Pretendard Variable',
    color: '#525252',
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
});

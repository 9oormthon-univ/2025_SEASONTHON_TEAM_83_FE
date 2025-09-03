// services/permissionService.js
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

// 권한 관리 서비스
export const PermissionService = {
  // 위치 서비스 권한 요청
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return {
        success: status === 'granted',
        status: status,
        message: status === 'granted' ? '위치 서비스 권한이 허용되었습니다.' : '위치 서비스 권한이 거부되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        message: '위치 서비스 권한 요청 중 오류가 발생했습니다.',
        error: error.message
      };
    }
  },

  // 위치 서비스 권한 상태 확인
  async checkLocationPermission() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return {
        success: true,
        granted: status === 'granted',
        status: status
      };
    } catch (error) {
      return {
        success: false,
        granted: false,
        status: 'error',
        error: error.message
      };
    }
  },

  // 푸시 알림 권한 요청
  async requestNotificationPermission() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return {
        success: status === 'granted',
        status: status,
        message: status === 'granted' ? '푸시 알림 권한이 허용되었습니다.' : '푸시 알림 권한이 거부되었습니다.'
      };
    } catch (error) {
      return {
        success: false,
        status: 'error',
        message: '푸시 알림 권한 요청 중 오류가 발생했습니다.',
        error: error.message
      };
    }
  },

  // 푸시 알림 권한 상태 확인
  async checkNotificationPermission() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return {
        success: true,
        granted: status === 'granted',
        status: status
      };
    } catch (error) {
      return {
        success: false,
        granted: false,
        status: 'error',
        error: error.message
      };
    }
  },

  // 모든 권한 상태 확인
  async checkAllPermissions() {
    try {
      const [locationResult, notificationResult] = await Promise.all([
        this.checkLocationPermission(),
        this.checkNotificationPermission()
      ]);

      return {
        success: true,
        location: locationResult,
        notification: notificationResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 설정 앱으로 이동 (권한이 거부된 경우)
  async openAppSettings() {
    try {
      // iOS의 경우 설정 앱으로 이동
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        // Android의 경우 앱 설정으로 이동
        await Linking.openSettings();
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default PermissionService;

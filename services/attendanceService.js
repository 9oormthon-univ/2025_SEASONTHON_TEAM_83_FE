// services/attendanceService.js

import { ENDPOINTS } from '../config/api';
import { apiClient } from './api';

export const AttendanceService = {
  /**
   * 오늘 출석하기
   */
  async checkAttendance() {
    try {
      console.log('출석 체크 API 요청 시작');
      const response = await apiClient.post(ENDPOINTS.ATTENDANCE.CHECK);
      console.log('출석 체크 API 원본 응답:', response);
      return {
        success: true,
        data: response, // result 필드가 없으므로 전체 응답 사용
        message: response.message,
      };
    } catch (error) {
      console.error('출석 체크 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 월별 출석 현황 조회
   */
  async getMonthlyAttendance() {
    try {
      const response = await apiClient.get(ENDPOINTS.ATTENDANCE.MONTHLY);
      return {
        success: true,
        data: response,
        message: response.message || '월별 출석 현황 조회 성공',
      };
    } catch (error) {
      console.error('월별 출석 현황 조회 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * 이번 달 출석 포인트 합계 조회
   */
  async getAttendanceSummary() {
    try {
      console.log('출석 포인트 합계 API 요청 시작');
      const response = await apiClient.get(ENDPOINTS.ATTENDANCE.SUMMARY);
      console.log('출석 포인트 합계 API 원본 응답:', response);
      return {
        success: true,
        data: response,
        message: response.message || '출석 포인트 합계 조회 성공',
      };
    } catch (error) {
      console.error('출석 포인트 합계 조회 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default AttendanceService;

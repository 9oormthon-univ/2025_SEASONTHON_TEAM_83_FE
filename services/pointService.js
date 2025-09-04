import { apiClient } from './api';

// 포인트 서비스
export const PointService = {
  // 보유 포인트 조회
  async getBalance() {
    try {
      console.log('포인트 잔액 조회 API 호출 시작');
      const response = await apiClient.get('/api/points/balance');
      console.log('포인트 잔액 조회 API 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('포인트 잔액 조회 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 포인트 히스토리 조회
  async getHistory() {
    try {
      console.log('포인트 히스토리 조회 API 호출 시작');
      const response = await apiClient.get('/api/points/history');
      console.log('포인트 히스토리 조회 API 응답:', response);
      return {
        success: true,
        data: response.histories,
        message: response.message,
      };
    } catch (error) {
      console.error('포인트 히스토리 조회 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default PointService;

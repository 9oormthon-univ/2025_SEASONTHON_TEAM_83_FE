import { apiClient } from './api';

// 포인트 서비스
export const PointService = {
  // 보유 포인트 조회
  async getBalance() {
    try {
      console.log('포인트 잔액 조회 API 호출: /api/points/balance');
      const response = await apiClient.get('/api/points/balance');
      console.log('포인트 잔액 조회 API 응답:', response);
      
      // API 응답 구조에 맞게 처리
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result, // { currentPoints, totalEarnedPoints, currentLevel, nextLevel, progressToNextLevel }
          message: response.message,
        };
      } else {
        return {
          success: false,
          error: response.message || '포인트 잔액 조회에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('포인트 잔액 조회 API 에러:', error);
      return {
        success: false,
        error: error.message.includes('접근 권한') || error.message.includes('인증') 
          ? '로그인이 필요합니다. 로그인 후 다시 시도해주세요.'
          : error.message,
      };
    }
  },

  // 포인트 히스토리 조회
  async getHistory() {
    try {
      console.log('🔄 포인트 히스토리 조회 API 호출: /api/points/history');
      console.log('📡 요청 URL:', 'https://dev.seonyeong.site/api/points/history');
      
      // 토큰 상태 확인
      const { TokenManager } = await import('./api');
      const token = await TokenManager.getToken();
      console.log('🔐 포인트 히스토리 조회 시 토큰 상태:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        isLoggedIn: await TokenManager.isLoggedIn()
      });
      
      const response = await apiClient.get('/api/points/history');
      console.log('📥 포인트 히스토리 조회 API 응답:', response);
      console.log('📊 응답 타입:', typeof response);
      console.log('📋 응답 키들:', Object.keys(response || {}));
      
      // API 응답 구조에 맞게 처리 (서버 API 문서 기준)
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result || [], // [{ date, type, description, pointChange }, ...]
          message: response.message || '포인트 히스토리 조회 성공',
        };
      } else {
        return {
          success: false,
          error: response.message || '포인트 히스토리 조회에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('포인트 히스토리 조회 API 에러:', error);
      return {
        success: false,
        error: error.message.includes('접근 권한') || error.message.includes('인증') 
          ? '로그인이 필요합니다. 로그인 후 다시 시도해주세요.'
          : error.message,
      };
    }
  },
};

export default PointService;

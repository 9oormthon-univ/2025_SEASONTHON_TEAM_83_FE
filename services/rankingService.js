import { apiClient } from './api';

// 랭킹 서비스
export const RankingService = {
  // 랭킹 조회
  async getRankings(page = 0, size = 10, sort = 'totalPoint,desc') {
    try {
      console.log('랭킹 조회 시작:', { page, size, sort });
      const response = await apiClient.get(`/api/members/rankings?page=${page}&size=${size}&sort=${sort}`);
      console.log('랭킹 조회 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('랭킹 조회 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 내 랭킹 조회 (현재 사용자)
  async getMyRanking() {
    try {
      console.log('내 랭킹 조회 시작');
      const response = await apiClient.get('/api/members/rankings/me');
      console.log('내 랭킹 조회 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('내 랭킹 조회 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default RankingService;

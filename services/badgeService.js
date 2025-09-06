import { apiClient } from './api';

export const BadgeService = {
  // 뱃지 목록 조회
  getBadges: async () => {
    try {
      console.log('=== 뱃지 목록 조회 시작 ===');
      const response = await apiClient.get('/api/members/me/badges');
      
      console.log('=== 뱃지 목록 조회 응답 ===');
      console.log('전체 응답:', JSON.stringify(response, null, 2));
      console.log('성공 여부:', response.isSuccess);
      console.log('뱃지 데이터:', response.result);
      
      if (response.isSuccess) {
        console.log('✅ 뱃지 목록 조회 성공');
        return {
          success: true,
          data: response.result || [],
          message: response.message || '성공입니다'
        };
      } else {
        console.error('❌ 뱃지 목록 조회 실패');
        console.error('오류:', response.message);
        return {
          success: false,
          data: [],
          error: response.message || '뱃지 목록 조회에 실패했습니다.'
        };
      }
    } catch (error) {
      console.error('❌ 뱃지 목록 조회 중 오류 발생');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      return {
        success: false,
        data: [],
        error: `뱃지 목록 조회 중 오류가 발생했습니다: ${error.message}`
      };
    }
  }
};

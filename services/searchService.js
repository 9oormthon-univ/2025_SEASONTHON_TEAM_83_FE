import { apiClient } from './api';

// 검색 서비스
export const SearchService = {
  // 통합 검색
  async search(keyword) {
    try {
      console.log('통합 검색 시작:', { keyword });
      const response = await apiClient.get(`/api/search?keyword=${encodeURIComponent(keyword)}`);
      console.log('통합 검색 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('통합 검색 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 최근 검색어 조회
  async getSearchHistory() {
    try {
      console.log('최근 검색어 조회 시작');
      const response = await apiClient.get('/api/search/history');
      console.log('최근 검색어 조회 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('최근 검색어 조회 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 최근 검색어 삭제
  async deleteSearchHistory(id) {
    try {
      console.log('검색어 삭제 시작:', { id });
      const response = await apiClient.delete(`/api/search/history/${id}`);
      console.log('검색어 삭제 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('검색어 삭제 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default SearchService;

// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentApiConfig } from '../config/api';

// API 설정
const API_CONFIG = getCurrentApiConfig();

// 토큰 관리
export const TokenManager = {
  // 토큰 저장
  async setToken(token) {
    try {
      await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  },

  // 토큰 조회
  async getToken() {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('토큰 조회 실패:', error);
      return null;
    }
  },

  // 토큰 삭제
  async removeToken() {
    try {
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  },

  // 로그인 상태 확인
  async isLoggedIn() {
    const token = await this.getToken();
    return token !== null;
  }
};

// API 클라이언트
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL; // https://dev.seonyeong.site
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // 공통 헤더 생성
  async getHeaders() {
    const token = await TokenManager.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // 공통 요청 처리
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const config = {
      method: 'GET',
      headers,
      timeout: this.timeout,
      ...options,
    };

    try {
      console.log(`API 요청: ${config.method} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      console.log(`API 응답: ${response.status}`, data);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.message || '요청 실패'}`);
      }

      return data;
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw this.handleError(error);
    }
  }

  // 에러 처리
  handleError(error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new Error('네트워크 연결을 확인해주세요.');
    }
    
    if (error.message.includes('timeout')) {
      return new Error('요청 시간이 초과되었습니다.');
    }

    return error;
  }

  // GET 요청
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, { method: 'GET' });
  }

  // POST 요청
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PATCH 요청
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE 요청
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient();

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증 관련
  SIGNUP: '/api/members/signup',
  LOGIN: '/api/members/login',
  EMAIL_CHECK: '/api/members/email-check',
  KAKAO_LOGIN: '/api/members/kakao-login',
  KAKAO_CALLBACK: '/api/callback',
  
  // 사용자 정보
  PROFILE: '/api/members/me',
  INTERESTS: '/api/members/interests',
  AGREEMENTS: '/api/members/agreements',
};

// 유저 정보 조회 API
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PROFILE);
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    throw error;
  }
};

// 유저 정보 수정 API
export const updateUserProfile = async (updateData) => {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.PROFILE, updateData);
    return response;
  } catch (error) {
    console.error('유저 정보 수정 실패:', error);
    throw error;
  }
};

export default apiClient;
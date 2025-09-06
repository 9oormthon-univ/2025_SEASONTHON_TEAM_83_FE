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
      console.log(`=== API 요청 시작 ===`);
      console.log(`메서드: ${config.method}`);
      console.log(`URL: ${url}`);
      console.log(`헤더:`, JSON.stringify(headers, null, 2));
      console.log(`요청 본문:`, options.body ? JSON.parse(options.body) : '없음');
      
      const response = await fetch(url, config);
      
      console.log(`=== API 응답 수신 ===`);
      console.log(`상태 코드: ${response.status}`);
      console.log(`응답 헤더:`, Object.fromEntries(response.headers.entries()));
      
      // 응답이 비어있는지 확인
      const responseText = await response.text();
      console.log(`응답 본문 (원본):`, responseText);
      
      let data;
      if (responseText.trim() === '') {
        // 빈 응답인 경우
        console.log('⚠️ 빈 응답 수신');
        data = { message: 'Empty response' };
      } else {
        try {
          data = JSON.parse(responseText);
          console.log(`응답 본문 (파싱됨):`, JSON.stringify(data, null, 2));
        } catch (parseError) {
          console.error('❌ JSON 파싱 오류:', parseError);
          console.error('파싱 실패한 텍스트:', responseText);
          throw new Error(`JSON Parse error: ${parseError.message}`);
        }
      }

      if (!response.ok) {
        console.error(`❌ HTTP 오류: ${response.status}`);
        console.error(`오류 메시지: ${data.message || '요청 실패'}`);
        throw new Error(`HTTP ${response.status}: ${data.message || '요청 실패'}`);
      }

      console.log(`✅ API 요청 성공`);
      return data;
    } catch (error) {
      console.error('❌ API 요청 실패');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
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

  // POST 요청 (multipart/form-data)
  async postFormData(endpoint, formData) {
    const headers = await this.getHeaders();
    // multipart/form-data 요청에서는 Content-Type을 자동으로 설정하도록 제거
    delete headers['Content-Type'];
    
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      console.log(`=== FormData API 요청 시작 ===`);
      console.log(`메서드: POST`);
      console.log(`URL: ${url}`);
      console.log(`헤더:`, JSON.stringify(headers, null, 2));
      console.log(`FormData 내용:`, formData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        timeout: this.timeout,
      });
      
      console.log(`=== FormData API 응답 수신 ===`);
      console.log(`상태 코드: ${response.status}`);
      console.log(`응답 헤더:`, Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log(`응답 본문 (원본):`, responseText);
      
      let data;
      if (responseText.trim() === '') {
        console.log('⚠️ 빈 응답 수신');
        data = { message: 'Empty response' };
      } else {
        try {
          data = JSON.parse(responseText);
          console.log(`응답 본문 (파싱됨):`, JSON.stringify(data, null, 2));
        } catch (parseError) {
          console.error('❌ JSON 파싱 오류:', parseError);
          console.error('파싱 실패한 텍스트:', responseText);
          throw new Error(`JSON Parse error: ${parseError.message}`);
        }
      }

      if (!response.ok) {
        console.error(`❌ HTTP 오류: ${response.status}`);
        console.error(`오류 메시지: ${data.message || '요청 실패'}`);
        throw new Error(`HTTP ${response.status}: ${data.message || '요청 실패'}`);
      }

      console.log(`✅ FormData API 요청 성공`);
      return data;
    } catch (error) {
      console.error('❌ FormData API 요청 실패');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      throw this.handleError(error);
    }
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
  
  // 챌린지
  CHALLENGES: '/api/challenges',
  CHALLENGE_DETAIL: '/api/challenges',
  CHALLENGE_START: '/api/challenges',
  CHALLENGE_COMPLETE: '/api/challenges',
  CHALLENGE_GPS: '/api/challenges',
  CHALLENGE_STATUS: '/api/challenges',
  
  // 출석
  ATTENDANCE_MONTHLY: '/api/attendance/monthly',
  ATTENDANCE_CHECK: '/api/attendance/check',
  ATTENDANCE_SUMMARY: '/api/attendance/summary',
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
// services/authService.js
import { API_ENDPOINTS, apiClient, TokenManager } from './api';

// 인증 서비스
export const AuthService = {
  // 회원가입
  async signup(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SIGNUP, {
        nickname: userData.nickname,
        birthday: userData.birthday,
        email: userData.email,
        password: userData.password,
      });

      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 로그인
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        emailOrNickname: credentials.emailOrNickname,
        password: credentials.password,
      });

      // 로그인 성공 시 토큰 저장
      if (response.isSuccess && response.result.accessToken) {
        await TokenManager.setToken(response.result.accessToken);
      }

      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 이메일 중복 체크
  async checkEmailDuplicate(email) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMAIL_CHECK, {
        email: email,
      });

      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 카카오 로그인
  async kakaoLogin(code) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.KAKAO_CALLBACK}?code=${code}`);

      // 로그인 성공 시 토큰 저장
      if (response.isSuccess && response.result.accessToken) {
        await TokenManager.setToken(response.result.accessToken);
      }

      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 로그아웃
  async logout() {
    try {
      await TokenManager.removeToken();
      return {
        success: true,
        message: '로그아웃되었습니다.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 로그인 상태 확인
  async checkLoginStatus() {
    try {
      const isLoggedIn = await TokenManager.isLoggedIn();
      return {
        success: true,
        isLoggedIn,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 프로필 조회
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PROFILE);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 프로필 수정
  async updateProfile(profileData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PROFILE, profileData);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default AuthService;

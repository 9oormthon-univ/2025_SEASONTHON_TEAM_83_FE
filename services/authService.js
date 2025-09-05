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
      console.log('사용자 정보 조회 API 호출: /api/members/me');
      const response = await apiClient.get('/api/members/me');
      console.log('사용자 정보 조회 API 응답:', response);
      
      // API 응답 구조에 맞게 처리
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result, // { profileUrl, nickname, email, birthday }
          message: response.message,
        };
      } else {
        return {
          success: false,
          error: response.message || '사용자 정보 조회에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('사용자 정보 조회 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 프로필 수정 (profileUrl, nickname, birthday 필드 수정 가능)
  async updateProfile(profileData) {
    try {
      console.log('사용자 정보 수정 API 호출: /api/members/me', profileData);
      
      // 수정 가능한 필드만 필터링
      const allowedFields = ['profileUrl', 'nickname', 'birthday'];
      const updateData = {};
      
      allowedFields.forEach(field => {
        if (profileData[field] !== undefined) {
          updateData[field] = profileData[field];
        }
      });
      
      const response = await apiClient.patch('/api/members/me', updateData);
      console.log('사용자 정보 수정 API 응답:', response);
      
      // API 응답 구조에 맞게 처리
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result, // { profileUrl, nickname, birthday }
          message: response.message,
        };
      } else {
        return {
          success: false,
          error: response.message || '사용자 정보 수정에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('사용자 정보 수정 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 닉네임 수정
  async updateNickname(nickname) {
    try {
      console.log('닉네임 수정 API 호출:', nickname);
      const response = await apiClient.patch('/api/members/me', {
        nickname: nickname
      });
      console.log('닉네임 수정 API 응답:', response);
      
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result,
          message: response.message,
        };
      } else {
        return {
          success: false,
          error: response.message || '닉네임 수정에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('닉네임 수정 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 생년월일 수정
  async updateBirthday(birthday) {
    try {
      console.log('생년월일 수정 API 호출:', birthday);
      const response = await apiClient.patch('/api/members/me', {
        birthday: birthday
      });
      console.log('생년월일 수정 API 응답:', response);
      
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result,
          message: response.message,
        };
      } else {
        return {
          success: false,
          error: response.message || '생년월일 수정에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('생년월일 수정 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 프로필 이미지 수정 (profileUrl 필드 사용)
  async updateProfileImage(imageUrl) {
    try {
      console.log('프로필 이미지 수정 API 호출:', imageUrl);
      const response = await apiClient.patch('/api/members/me', {
        profileUrl: imageUrl
      });
      console.log('프로필 이미지 수정 API 응답:', response);
      
      if (response.isSuccess) {
        return {
          success: true,
          data: response.result,
          message: response.message,
        };
      } else {
        return {
          success: false,
          error: response.message || '프로필 이미지 수정에 실패했습니다.',
        };
      }
    } catch (error) {
      console.error('프로필 이미지 수정 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 사용자 통계 정보 조회
  async getUserStats() {
    try {
      console.log('사용자 통계 정보 조회 API 호출');
      const response = await apiClient.get('/api/members/stats');
      console.log('사용자 통계 정보 조회 API 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('사용자 통계 정보 조회 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 사용자 활동 내역 조회
  async getUserActivity() {
    try {
      console.log('사용자 활동 내역 조회 API 호출');
      const response = await apiClient.get('/api/members/activity');
      console.log('사용자 활동 내역 조회 API 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('사용자 활동 내역 조회 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 비밀번호 변경
  async changePassword(passwordData) {
    try {
      console.log('비밀번호 변경 API 호출');
      const response = await apiClient.patch('/api/members/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      console.log('비밀번호 변경 API 응답:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('비밀번호 변경 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 계정 삭제
  async deleteAccount() {
    try {
      console.log('계정 삭제 API 호출');
      const response = await apiClient.delete('/api/members/account');
      console.log('계정 삭제 API 응답:', response);
      
      // 계정 삭제 성공 시 토큰 제거
      if (response.isSuccess) {
        await TokenManager.removeToken();
      }
      
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('계정 삭제 API 에러:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 관심활동 설정
  async setInterests(interests) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.INTERESTS, {
        interests: interests
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

  // 동의항목 수정
  async updateAgreements(agreements) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.AGREEMENTS, agreements);
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

  // 동의항목 조회
  async getAgreements() {
    try {
      const response = await apiClient.get('/api/members/agreements');
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

  // 월별 출석 현황 조회
  async getMonthlyAttendance() {
    try {
      const response = await apiClient.get('/api/attendance/monthly');
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

  // 오늘 출석하기
  async checkAttendance() {
    try {
      const response = await apiClient.post('/api/attendance/check');
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

  // 이번 달 출석 포인트 합계 조회
  async getAttendanceSummary() {
    try {
      const response = await apiClient.get('/api/attendance/summary');
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

  // 챌린지 목록 조회
  async getChallenges() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHALLENGES);
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

  // 챌린지 상세 조회
  async getChallengeDetail(challengeId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHALLENGE_DETAIL}/${challengeId}`);
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

  // 챌린지 시작
  async startChallenge(challengeId) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CHALLENGE_START}/${challengeId}/start`);
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

  // GPS 정보 전송
  async sendGpsData(challengeId, gpsData) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CHALLENGE_GPS}/${challengeId}/gps`, gpsData);
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

  // 챌린지 완료 (리워드 받기)
  async completeChallenge(challengeId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHALLENGE_COMPLETE}/${challengeId}/reward`);
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

  // 챌린지 진행 상태 확인
  async getChallengeStatus(challengeId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHALLENGE_STATUS}/${challengeId}/status`);
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

  // 사진 인증 검증
  async verifyChallenge(challengeId) {
    try {
      const response = await apiClient.post(`/api/challenges/${challengeId}/verify`);
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

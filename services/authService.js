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

  // 사진 업로드
  async uploadChallengePhoto(challengeId, photoUri) {
    try {
      console.log('=== AuthService.uploadChallengePhoto 시작 ===');
      console.log('챌린지 ID:', challengeId);
      console.log('사진 URI:', photoUri);
      
      // React Native FormData 생성
      const formData = new FormData();
      
      // React Native에서 FormData에 파일 추가하는 올바른 방법
      formData.append('file', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'challenge_photo.jpg',
      });
      
      console.log('FormData 생성 완료');
      console.log('사진 URI:', photoUri);
      console.log('FormData 타입:', typeof formData);
      console.log('FormData _parts:', formData._parts);
      console.log('FormData _parts 길이:', formData._parts?.length);
      
      // 직접 fetch 사용 (apiClient.postFormData 대신)
      const token = await TokenManager.getToken();
      const url = `https://dev.seonyeong.site/api/challenges/${challengeId}/photo`;
      
      console.log('업로드 URL:', url);
      console.log('토큰 존재 여부:', !!token);
      
      // 헤더 설정 (Content-Type 제외)
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      
      console.log('요청 헤더:', headers);
      console.log('FormData body 타입:', typeof formData);
      console.log('FormData body:', formData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      });
      
      console.log('=== uploadChallengePhoto API 응답 수신 ===');
      console.log('상태 코드:', response.status);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('응답 본문 (원본):', responseText);
      
      let data;
      if (responseText.trim() === '') {
        console.log('⚠️ 빈 응답 수신');
        data = { message: 'Empty response' };
      } else {
        try {
          data = JSON.parse(responseText);
          console.log('응답 본문 (파싱됨):', JSON.stringify(data, null, 2));
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
      
      console.log('=== uploadChallengePhoto API 응답 성공 ===');
      console.log('전체 응답:', JSON.stringify(data, null, 2));
      console.log('result 필드:', data.result);
      console.log('photoUrl:', data.result?.photoUrl);
      
      return {
        success: true,
        data: data.result,
        message: data.message,
      };
    } catch (error) {
      console.error('=== uploadChallengePhoto API 오류 ===');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      console.error('전체 오류 객체:', JSON.stringify(error, null, 2));
      
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 사진 인증 검증
  async verifyChallenge(challengeId) {
    try {
      console.log('=== AuthService.verifyChallenge 시작 ===');
      console.log('챌린지 ID:', challengeId);
      console.log('요청 URL:', `/api/challenges/${challengeId}/verify`);
      
      const response = await apiClient.post(`/api/challenges/${challengeId}/verify`);
      
      console.log('=== verifyChallenge API 응답 성공 ===');
      console.log('전체 응답:', JSON.stringify(response, null, 2));
      console.log('result 필드:', response.result);
      console.log('message 필드:', response.message);
      
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('=== verifyChallenge API 오류 ===');
      console.error('오류 타입:', error.constructor.name);
      console.error('오류 메시지:', error.message);
      console.error('오류 스택:', error.stack);
      console.error('전체 오류 객체:', JSON.stringify(error, null, 2));
      
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

export default AuthService;

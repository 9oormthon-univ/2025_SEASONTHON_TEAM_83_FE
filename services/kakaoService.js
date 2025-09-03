// services/kakaoService.js
// 카카오 로그인 서비스

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { API_ENDPOINTS, apiClient } from './api';

// WebBrowser 완료 후 결과 처리
WebBrowser.maybeCompleteAuthSession();

// 카카오 로그인 설정
const KAKAO_CONFIG = {
  clientId: 'YOUR_KAKAO_APP_KEY', // 실제 카카오 앱 키로 교체 필요
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'pleanetapp', // 앱 스킴
    path: 'kakao-callback'
  }),
  scopes: ['profile_nickname', 'account_email', 'birthday'],
};

// 카카오 로그인 서비스
const KakaoService = {
  // 카카오 로그인 URL 생성
  getKakaoLoginUrl() {
    const authUrl = `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${KAKAO_CONFIG.clientId}&` +
      `redirect_uri=${encodeURIComponent(KAKAO_CONFIG.redirectUri)}&` +
      `response_type=code&` +
      `scope=${KAKAO_CONFIG.scopes.join(' ')}`;
    
    return authUrl;
  },

  // 카카오 로그인 실행
  async loginWithKakao() {
    try {
      const authUrl = this.getKakaoLoginUrl();
      
      // WebBrowser를 사용한 인증 세션 시작
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        KAKAO_CONFIG.redirectUri
      );

      if (result.type === 'success' && result.url) {
        // URL에서 인증 코드 추출
        const url = new URL(result.url);
        const code = url.searchParams.get('code');
        
        if (code) {
          // 인증 코드를 서버로 전송하여 토큰 교환
          const loginResult = await this.exchangeCodeForToken(code);
          return loginResult;
        } else {
          return {
            success: false,
            error: '인증 코드를 받지 못했습니다.'
          };
        }
      } else {
        return {
          success: false,
          error: '카카오 로그인이 취소되었습니다.'
        };
      }
    } catch (error) {
      console.error('Kakao login error:', error);
      return {
        success: false,
        error: '카카오 로그인 중 오류가 발생했습니다.'
      };
    }
  },

  // 인증 코드를 서버로 전송하여 토큰 교환
  async exchangeCodeForToken(code) {
    try {
      const response = await apiClient(`${API_ENDPOINTS.kakaoLogin}?code=${code}`, {
        method: 'GET',
      });

      if (response.isSuccess && response.result.accessToken) {
        return {
          success: true,
          data: response.result,
          needsAdditionalInfo: this.checkIfNeedsAdditionalInfo(response.result)
        };
      } else {
        return {
          success: false,
          error: response.message || '카카오 로그인에 실패했습니다.'
        };
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      return {
        success: false,
        error: '서버와의 통신 중 오류가 발생했습니다.'
      };
    }
  },

  // 추가 정보 입력이 필요한지 확인
  checkIfNeedsAdditionalInfo(userData) {
    // 닉네임이나 생일이 없으면 추가 정보 입력 필요
    return !userData.nickname || !userData.birthday;
  },

  // 카카오 사용자 정보 파싱
  parseKakaoUserInfo(kakaoUserInfo) {
    return {
      nickname: kakaoUserInfo.kakao_account?.profile?.nickname || '',
      email: kakaoUserInfo.kakao_account?.email || '',
      birthday: kakaoUserInfo.kakao_account?.birthday || '',
      gender: kakaoUserInfo.kakao_account?.gender || '',
      profileImage: kakaoUserInfo.kakao_account?.profile?.profile_image_url || '',
    };
  },

  // 추가 정보 업데이트
  async updateAdditionalInfo(accessToken, additionalInfo) {
    try {
      const response = await apiClient(API_ENDPOINTS.profile, {
        method: 'PATCH',
        body: additionalInfo,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.isSuccess) {
        return {
          success: true,
          data: response.result
        };
      } else {
        return {
          success: false,
          error: response.message || '추가 정보 업데이트에 실패했습니다.'
        };
      }
    } catch (error) {
      console.error('Update additional info error:', error);
      return {
        success: false,
        error: '추가 정보 업데이트 중 오류가 발생했습니다.'
      };
    }
  }
};

export default KakaoService;

// services/kakaoService.js
// 카카오 로그인 서비스

import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { API_ENDPOINTS, apiClient } from './api';

// WebBrowser 완료 후 결과 처리
WebBrowser.maybeCompleteAuthSession();

// Expo Go용 리다이렉트 URI 확인
const redirectUri = Linking.createURL('kakao-login-callback');
console.log('My Expo Go Redirect URI:', redirectUri);

// 카카오 로그인 설정
const KAKAO_CONFIG = {
  clientId: Constants.expoConfig?.extra?.kakaoApiKey || 'c3ee702cb0fea17ff01715a1797c1de7',
  redirectUri: redirectUri, // Expo Go용 동적 URI
  scopes: ['profile_nickname', 'account_email'],
};

// 카카오 로그인 서비스
const KakaoService = {
  // 카카오 로그인 URL 생성
  getKakaoLoginUrl() {
    console.log('=== 카카오 로그인 디버깅 ===');
    console.log('Client ID:', KAKAO_CONFIG.clientId);
    console.log('Redirect URI:', KAKAO_CONFIG.redirectUri);
    console.log('Scopes:', KAKAO_CONFIG.scopes);
    console.log('=== 실제 사용할 Redirect URI ===');
    console.log('등록해야 할 URI:', KAKAO_CONFIG.redirectUri);
    
    const authUrl = `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${KAKAO_CONFIG.clientId}&` +
      `redirect_uri=${encodeURIComponent(KAKAO_CONFIG.redirectUri)}&` +
      `response_type=code&` +
      `scope=${KAKAO_CONFIG.scopes.join(' ')}`;
    
    console.log('Full Auth URL:', authUrl);
    console.log('========================');
    
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
    // 백엔드에서 nickname이 이미 제공되므로 추가 정보 입력 불필요
    // 만약 생일 등 추가 정보가 필요하다면 여기서 체크
    return false; // 일단 항상 false로 설정 (추가 정보 입력 불필요)
  },

  // 카카오 사용자 정보 파싱
  parseKakaoUserInfo(kakaoUserInfo) {
    return {
      nickname: kakaoUserInfo.kakao_account?.profile?.nickname || '',
      email: kakaoUserInfo.kakao_account?.email || '',
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

// config/api.js

// API 환경 설정
export const API_CONFIG = {
  // 개발 환경
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:8080', // 로컬 개발 서버
    TIMEOUT: 10000,
  },
  
  // 스테이징 환경
  STAGING: {
    BASE_URL: 'https://staging-api.pleanet.com',
    TIMEOUT: 10000,
  },
  
  // 프로덕션 환경
  PRODUCTION: {
    BASE_URL: 'https://api.pleanet.com',
    TIMEOUT: 10000,
  },
};

// 현재 환경 설정 (환경에 따라 변경)
export const CURRENT_ENV = __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION';

// 현재 API 설정
export const getCurrentApiConfig = () => {
  return API_CONFIG[CURRENT_ENV];
};

// API 엔드포인트
export const ENDPOINTS = {
  // 인증 관련
  AUTH: {
    SIGNUP: '/api/members/signup',
    LOGIN: '/api/members/login',
    EMAIL_CHECK: '/api/members/email-check',
    KAKAO_CALLBACK: '/api/callback',
    LOGOUT: '/api/members/logout',
  },
  
  // 사용자 정보
  USER: {
    PROFILE: '/api/members/me',
    UPDATE_PROFILE: '/api/members/me',
  },
  
  // 챌린지 관련
  CHALLENGE: {
    LIST: '/api/challenges',
    DETAIL: '/api/challenges/:id',
    PARTICIPATE: '/api/challenges/:id/participate',
  },
  
  // 포인트 관련
  POINT: {
    BALANCE: '/api/points/balance',
    HISTORY: '/api/points/history',
  },
  
  // 뱃지 관련
  BADGE: {
    LIST: '/api/badges',
    USER_BADGES: '/api/badges/user',
  },
};

export default {
  API_CONFIG,
  CURRENT_ENV,
  getCurrentApiConfig,
  ENDPOINTS,
};

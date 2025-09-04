// constants/ProfileConstants.js
import { Platform } from 'react-native';

// 공통 색상
export const PROFILE_COLORS = {
  bg: '#F9F8E1',
  card: '#FFFFFF',
  ink: '#1F2A22',
  sub: '#7A8B83',
  green: '#0F6D52',
  line: '#EAEFE7',
  header: '#0F3A2D',
  ivory: '#FFF7D6',
  kakao: '#FEE500',
};

// 공통 크기
export const PROFILE_SIZES = {
  SP: 14,
  GAP: 10,
  R: 12,
  BADGE_SIZE: 56,
  RIBBON_H: 14,
  TABBAR_H: 72,
  GRID_GAP: 12,
  GRID_PAD_H: 16,
  TARGET_SIZE: 96,
  MODAL_IMG_SIZE: 140,
};

// 공통 그림자 스타일
export const PROFILE_SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 1 },
});

// 공통 모달 그림자
export const MODAL_SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 6 },
  web: { boxShadow: '0 12px 24px rgba(0,0,0,0.18)' },
});

// 뱃지 이미지 매핑
export const BADGE_IMAGES = {
  tree: require('../assets/images/tree_badge.png'),
  walk: require('../assets/images/icon_walk.png'),
  tumbler: require('../assets/images/icon_tumblr.png'),
  earth: require('../assets/images/icon_earth.png'),
};

// 인용구
export const QUOTES = [
  '"하나의 나무, 하나의 변화.\n당신이 시작했습니다."',
  '"당신의 실천이 지구에 초록 숨결을 더합니다."',
  '"함께 심은 나무, 함께 키워가는 지구."',
];

// 스토리지 키
export const STORAGE_KEYS = {
  BADGE_BOARD: 'badge_board_v1',
};

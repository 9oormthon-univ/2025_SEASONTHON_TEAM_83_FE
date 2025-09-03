# API 서비스 가이드

## 📁 파일 구조

```
services/
├── api.js              # API 클라이언트 및 토큰 관리
├── authService.js      # 인증 관련 API 서비스
└── README.md          # 이 파일

contexts/
└── AuthContext.js     # 인증 상태 관리 Context

utils/
└── validation.js      # 유효성 검사 유틸리티

config/
└── api.js            # API 환경 설정
```

## 🚀 사용법

### 1. 앱에 AuthProvider 추가

```jsx
// app/_layout.tsx
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* 앱 컴포넌트들 */}
    </AuthProvider>
  );
}
```

### 2. 인증 상태 사용

```jsx
// 컴포넌트에서
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  // 로그인 상태에 따른 UI 렌더링
  if (isAuthenticated) {
    return <Text>안녕하세요, {user.nickname}님!</Text>;
  }
  
  return <LoginForm />;
}
```

### 3. API 호출 예시

```jsx
// 로그인
const handleLogin = async () => {
  const result = await login({
    emailOrNickname: 'user@example.com',
    password: 'password123'
  });
  
  if (result.success) {
    // 로그인 성공
    router.push('/home');
  } else {
    // 로그인 실패
    alert(result.error);
  }
};

// 회원가입
const handleSignup = async () => {
  const result = await signup({
    nickname: '닉네임',
    birthday: '2000-01-01',
    email: 'user@example.com',
    password: 'password123'
  });
  
  if (result.success) {
    // 회원가입 성공
    alert('회원가입이 완료되었습니다.');
  }
};

// 이메일 중복 체크
const checkEmail = async (email) => {
  const result = await checkEmailDuplicate(email);
  
  if (result.success) {
    if (result.data.available) {
      // 사용 가능
      setEmailAvailable(true);
    } else {
      // 중복
      setEmailAvailable(false);
    }
  }
};
```

## 🔧 설정

### API 도메인 변경

```javascript
// config/api.js
export const API_CONFIG = {
  DEVELOPMENT: {
    BASE_URL: 'http://your-dev-server.com', // 개발 서버
  },
  PRODUCTION: {
    BASE_URL: 'https://your-prod-server.com', // 프로덕션 서버
  },
};
```

## 📝 주요 기능

### ✅ 구현된 기능
- [x] API 클라이언트 설정
- [x] 토큰 관리 (AsyncStorage)
- [x] 공통 에러 처리
- [x] 인증 상태 관리 (Context API)
- [x] 유효성 검사 유틸리티
- [x] 환경별 API 설정

### 🔄 다음 단계
- [ ] 이메일 중복 체크 API 연동
- [ ] 회원가입 API 연동
- [ ] 로그인 API 연동
- [ ] 카카오 로그인 연동

## 🐛 에러 처리

모든 API 호출은 다음과 같은 형태로 에러를 처리합니다:

```javascript
{
  success: true/false,
  data: {}, // 성공 시 데이터
  error: "에러 메시지", // 실패 시 에러 메시지
  message: "응답 메시지" // API 응답 메시지
}
```

## 🔐 보안

- 토큰은 AsyncStorage에 안전하게 저장됩니다
- 모든 API 요청에 자동으로 Authorization 헤더가 추가됩니다
- 토큰 만료 시 자동으로 로그아웃 처리됩니다

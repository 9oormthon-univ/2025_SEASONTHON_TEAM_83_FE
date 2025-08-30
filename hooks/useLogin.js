import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

// 로그인 화면의 모든 로직과 상태를 관리하는 Hook
export default function useLogin() {
  const router = useRouter(); // 화면 이동을 위한 라우터

  // 1. 상태(State) 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // 2. 로직(Logic) 관리
  const handleLogin = () => {
    // 간단한 유효성 검사
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log('로그인 시도:', { email, password });
      setIsLoading(true);

    // TODO: 나중에 여기에 실제 API 통신 코드가 들어갑니다.
    // 지금은 2초 후에 성공했다고 가정하고 메인 화면으로 이동합니다.
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      // 로그인 성공 시 메인 화면(탭이 있는 홈)으로 이동합니다.
      // replace를 사용해서 뒤로가기로 로그인 화면에 다시 돌아오지 못하게 합니다.
      router.replace('/(tabs)'); 
    }, 2000);
  };

  // 3. View(화면)에서 사용할 상태와 함수들을 내보냅니다.
  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    loginSuccess,
  };
}

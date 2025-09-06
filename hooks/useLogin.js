import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// 로그인 화면의 모든 로직과 상태를 관리하는 Hook
export default function useLogin() {
  const router = useRouter(); // 화면 이동을 위한 라우터
  const { login } = useAuth(); // 인증 Context에서 login 함수 가져오기

  // 1. 상태(State) 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // 2. 로직(Logic) 관리
  const handleLogin = async () => {
    // 간단한 유효성 검사
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log('로그인 시도:', { email, password });
    setIsLoading(true);

    try {
      // 실제 API를 통한 로그인 시도
      const result = await login({
        emailOrNickname: email,
        password: password,
      });

      if (result.success) {
        console.log('로그인 성공:', result.data);
        setLoginSuccess(true);
        // 로그인 성공 시 메인 화면(탭이 있는 홈)으로 이동합니다.
        // replace를 사용해서 뒤로가기로 로그인 화면에 다시 돌아오지 못하게 합니다.
        router.replace('/(tabs)');
      } else {
        console.error('로그인 실패:', result.error);
        Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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

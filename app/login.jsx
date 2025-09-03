import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validation';

// 색상 정의
const COLORS = {
  background: '#006256',
  text: '#2D2D2D',
  placeholder: 'rgba(45, 45, 45, 0.6)',
  loginButtonBackground: '#0F0F0F',
  loginButtonText: '#FAF8D7',
  kakaoButton: '#FEE500',
  signupButton: '#FFFFFF',
  inputBorder: '#2D2D2D',
};
const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, loginWithKakao } = useAuth();

  // 폼 데이터
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 유효성 검사 상태
  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' }
  });

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 로그인 성공 시 자동으로 홈 화면으로 이동
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  // 폼 데이터 업데이트
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 실시간 유효성 검사
    switch (field) {
      case 'email':
        if (value && !validateEmail(value)) {
          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' }
          }));
        } else if (value && validateEmail(value)) {
          setValidation(prev => ({
            ...prev,
            email: { isValid: true, message: '올바른 이메일 형식입니다.' }
          }));
        } else {
          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: '' }
          }));
        }
        break;
        
      case 'password':
        if (value && value.length < 8) {
          setValidation(prev => ({
            ...prev,
            password: { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' }
          }));
        } else if (value && value.length >= 8) {
          setValidation(prev => ({
            ...prev,
            password: { isValid: true, message: '올바른 비밀번호 형식입니다.' }
          }));
        } else {
          setValidation(prev => ({
            ...prev,
            password: { isValid: false, message: '' }
          }));
        }
        break;
    }
  };

  // 로그인 처리
  const handleLogin = async () => {
    // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
    // 전체 폼 유효성 검사
    // const isFormValid = Object.values(validation).every(field => field.isValid);
    
    // if (!isFormValid) {
    //   Alert.alert('입력 오류', '모든 필드를 올바르게 입력해주세요.');
    //   return;
    // }

    // setIsLoading(true);

    // try {
    //   const result = await login({
    //     emailOrNickname: formData.email,
    //     password: formData.password
    //   });

    //   if (result.success) {
    //     // 로그인 성공 - useEffect에서 자동으로 홈 화면으로 이동
    //     console.log('로그인 성공:', result.data);
    //   } else {
    //     // 로그인 실패 - 에러 메시지 표시
    //     let errorMessage = '로그인에 실패했습니다.';
        
    //     if (result.error) {
    //       if (result.error.includes('가입된 계정이 아닙니다')) {
    //         errorMessage = '가입된 계정이 아닙니다.';
    //       } else if (result.error.includes('비밀번호가 올바르지 않습니다')) {
    //         errorMessage = '비밀번호가 올바르지 않습니다.';
    //       } else if (result.error.includes('네트워크')) {
    //         errorMessage = '네트워크 문제로 로그인할 수 없습니다.';
    //       } else {
    //         errorMessage = result.error;
    //       }
    //     }
        
    //     Alert.alert('로그인 실패', errorMessage);
    //   }
    // } catch (error) {
    //   Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    // } finally {
    //   setIsLoading(false);
    // }

    // 임시: 서버 없이 바로 회원가입 화면으로 이동
    console.log('임시 로그인 - 회원가입 화면으로 이동');
    router.push('/signup');
  };

  // 카카오 로그인 처리
  const handleKakaoLogin = async () => {
    try {
      const result = await loginWithKakao();

      if (result.success) {
        if (result.needsAdditionalInfo) {
          // 추가 정보 입력이 필요한 경우
          console.log('추가 정보 입력 필요:', result.data);
          router.push('/kakao-additional-info');
        } else {
          // 로그인 성공 - useEffect에서 자동으로 홈 화면으로 이동
          console.log('카카오 로그인 성공:', result.data);
        }
      } else {
        Alert.alert('카카오 로그인 실패', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignupPress = () => {
    router.push('/signup');
  };

  return (
    <LinearGradient
      colors={['#00DDC5', '#FFFFFF']}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* 로고 및 슬로건 */}
          <View style={styles.header}>
            <Image
              source={icon_pleanet_logo}
              style={styles.logo}
            />
            <View style={styles.sloganContainer}>
              <Image
                style={styles.sloganPattern}
                source={require('../assets/images/bar_green.png')}
              />
              <Text style={styles.slogan}>
                Pledge for the Planet
              </Text>
            </View>
            <Text style={styles.sloganSub}>Welcome to Pleanet</Text>
          </View>

          {/* 입력 필드 */}
          <View style={styles.inputGroup}>
            {/* 이메일 입력 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, !validation.email.isValid && formData.email ? styles.inputError : null]}
                placeholder="이메일 또는 닉네임"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                editable={!isLoading}
              />
              {validation.email.message && (
                <Text style={[styles.validationText, validation.email.isValid ? styles.validationSuccess : styles.validationError]}>
                  {validation.email.message}
                </Text>
              )}
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, !validation.password.isValid && formData.password ? styles.inputError : null]}
                  placeholder="비밀번호"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeButtonText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              {validation.password.message && (
                <Text style={[styles.validationText, validation.password.isValid ? styles.validationSuccess : styles.validationError]}>
                  {validation.password.message}
                </Text>
              )}
            </View>
          </View>

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.loginButtonText} />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </TouchableOpacity>

          {/* 소셜 로그인 및 회원가입 */}
          <View style={styles.socialGroup}>
            <View style={styles.socialButtonContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: COLORS.kakaoButton }, isLoading && styles.disabledButton]}
                onPress={handleKakaoLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Image
                    source={require('../assets/images/icon_kakao.png')}
                    style={styles.socialIcon}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.socialButtonText}>
                {isLoading ? '처리 중...' : '카카오톡'}
              </Text>
            </View>
            <View style={styles.socialButtonContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: COLORS.signupButton }]}
                onPress={handleSignupPress}
              >
                <Image
                  source={require('../assets/images/icon_signup.png')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <Text style={styles.socialButtonText}>회원가입</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // 패딩 줄여서 입력 필드를 아래로 이동
  },
  socialIcon: {
    width: 50, // 아이콘 크기 조정
    height: 50, // 아이콘 크기 조정
    resizeMode: 'contain', // 이미지 비율 유지
  },
  header: {
    alignItems: 'center',
    marginBottom: 30, // 헤더와 입력 필드 사이 여백 조정
  },
  logo: {
    width: 300, // 150 * 1.5 = 225
    height: 300, // 150 * 1.5 = 225
    marginBottom: 25, // 로고 아래 여백 조정
    resizeMode: 'contain', // 이미지 비율 유지
  },
  slogan: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: '109LeantheWall',
    position: 'absolute',
  },
  sloganSub: {
    color: '#2D2D2D',
    fontFamily: '109LeantheWall',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 4,
  },
  sloganContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sloganPattern: {
    width: 500,
    height: 40,
    resizeMode: 'stretch',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12, // 입력 필드 아래 여백 조정
  },
  input: {
    color: COLORS.text,
    fontSize: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    paddingVertical: 12,
    marginBottom: 5,
  },
  inputError: {
    borderBottomColor: '#ff4444',
    borderBottomWidth: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  validationText: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  validationSuccess: {
    color: '#00aa44',
  },
  validationError: {
    color: '#ff4444',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButton: {
    width: '100%',
    backgroundColor: COLORS.loginButtonBackground,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: COLORS.loginButtonText,
    fontSize: 16,
    fontWeight: '600',
  },
  socialGroup: {
    flexDirection: 'row',
  },
  socialButtonContainer: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  socialButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 8,
    justifyContent: 'center', // 아이콘 중앙 정렬
    alignItems: 'center', // 아이콘 중앙 정렬
  },
  socialButtonText: {
    color: COLORS.text,
    fontSize: 12,
  },
});

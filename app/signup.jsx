import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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
import { validateBirthday, validateEmail, validateNickname, validatePassword, validatePasswordConfirm } from '../utils/validation';

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
  greenBar: '#2D5A4F',
};

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function SignupScreen() {
  const router = useRouter();
  const { signup, checkEmailDuplicate, loginWithKakao, login } = useAuth();
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    nickname: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // 유효성 검사 상태
  const [validation, setValidation] = useState({
    email: { isValid: false, message: '', isChecking: false },
    password: { isValid: false, message: '', strength: 'Weak' },
    confirmPassword: { isValid: false, message: '' },
    nickname: { isValid: false, message: '' },
    birthday: { isValid: false, message: '' }
  });
  
  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 이메일 중복 체크 (실시간)
  const handleEmailCheck = async (email) => {
    if (!validateEmail(email)) {
      setValidation(prev => ({
        ...prev,
        email: { isValid: false, message: '올바른 이메일 형식을 입력해주세요.', isChecking: false }
      }));
      return;
    }

    setValidation(prev => ({
      ...prev,
      email: { ...prev.email, isChecking: true }
    }));

    try {
      const result = await checkEmailDuplicate(email);
      
      if (result.success) {
        if (result.data.available) {
          setValidation(prev => ({
            ...prev,
            email: { isValid: true, message: '사용 가능한 이메일입니다.', isChecking: false }
          }));
        } else {
          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: '이미 존재하는 계정입니다. 로그인 하시겠습니까?', isChecking: false }
          }));
        }
      } else {
        setValidation(prev => ({
          ...prev,
          email: { isValid: false, message: '이메일 확인 중 오류가 발생했습니다.', isChecking: false }
        }));
      }
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        email: { isValid: false, message: '네트워크 오류가 발생했습니다.', isChecking: false }
      }));
    }
  };

  // 이메일 입력 핸들러 (디바운스 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email && formData.email.length > 0) {
        handleEmailCheck(formData.email);
      }
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  // 폼 데이터 업데이트
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 실시간 유효성 검사
    switch (field) {
      case 'email':
        if (value && !validateEmail(value)) {
          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: '올바른 이메일 형식을 입력해주세요.', isChecking: false }
          }));
        }
        break;
        
      case 'password':
        const passwordValidation = validatePassword(value);
        setValidation(prev => ({
          ...prev,
          password: {
            isValid: passwordValidation.valid,
            message: passwordValidation.message,
            strength: getPasswordStrength(value)
          }
        }));
        break;
        
      case 'confirmPassword':
        const confirmValidation = validatePasswordConfirm(formData.password, value);
        setValidation(prev => ({
          ...prev,
          confirmPassword: {
            isValid: confirmValidation.valid,
            message: confirmValidation.message
          }
        }));
        break;
        
      case 'nickname':
        const nicknameValidation = validateNickname(value);
        setValidation(prev => ({
          ...prev,
          nickname: {
            isValid: nicknameValidation.valid,
            message: nicknameValidation.message
          }
        }));
        break;
        
      case 'birthday':
        const birthdayValidation = validateBirthday(value);
        setValidation(prev => ({
          ...prev,
          birthday: {
            isValid: birthdayValidation.valid,
            message: birthdayValidation.message
          }
        }));
        break;
    }
  };

  // 비밀번호 강도 계산
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  // 비밀번호 강도 색상
  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return '#ff4444';
      case 'Medium': return '#ffaa00';
      case 'Strong': return '#00aa44';
      default: return '#666';
    }
  };

  const handleSignup = async () => {
    // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
    // 전체 폼 유효성 검사
    const isFormValid = Object.values(validation).every(field => field.isValid);
    
    if (!isFormValid) {
      Alert.alert('입력 오류', '모든 필드를 올바르게 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        nickname: formData.nickname,
        birthday: formData.birthday,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        // 회원가입 성공 후 자동 로그인
        const loginResult = await login({
          emailOrNickname: formData.email,
          password: formData.password
        });

        if (loginResult.success) {
          Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.', [
            {
              text: '확인',
              onPress: () => router.push('/category-setup')
            }
          ]);
        } else {
          Alert.alert('회원가입 성공', '회원가입이 완료되었습니다. 로그인해주세요.', [
            {
              text: '확인',
              onPress: () => router.push('/login')
            }
          ]);
        }
      } else {
        Alert.alert('회원가입 실패', result.error || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
    
    // // 임시: 서버 없이 바로 카테고리 설정 화면으로 이동
    // console.log('임시 회원가입 - 카테고리 설정 화면으로 이동');
    // router.push('/category-setup');
  };

  const handleKakaoLink = async () => {
    try {
      setIsLoading(true);
      const result = await loginWithKakao();
      
      if (result.success) {
        // 백엔드에서 nickname이 이미 제공되므로 바로 카테고리 설정으로 이동
        router.push('/category-setup');
      } else {
        Alert.alert('카카오 로그인 실패', result.error || '카카오 로그인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '카카오 로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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
            {/* 로고 - 최상단 배치 */}
            <View style={styles.logoContainer}>
              <Image
                source={icon_pleanet_logo}
                style={styles.logo}
              />
            </View>

            {/* 회원가입 제목 */}
            <View style={styles.titleContainer}>
              <Image
                style={styles.titlePattern}
                source={require('../assets/images/bar_green.png')}
              />
              <Text style={styles.titleText}>회원가입</Text>
            </View>

            {/* 입력 필드들 */}
            <View style={styles.inputGroup}>
              {/* 닉네임과 생년월일 */}
              <View style={styles.topInputs}>
                <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, !validation.nickname.isValid && formData.nickname ? styles.inputError : null]}
                    placeholder="닉네임 (2-12자)"
                  placeholderTextColor={COLORS.placeholder}
                    value={formData.nickname}
                    onChangeText={(value) => updateFormData('nickname', value)}
                  />
                  {validation.nickname.message && (
                    <Text style={[styles.validationText, validation.nickname.isValid ? styles.validationSuccess : styles.validationError]}>
                      {validation.nickname.message}
                    </Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, !validation.birthday.isValid && formData.birthday ? styles.inputError : null]}
                    placeholder="생년월일 (YYYY-MM-DD)"
                  placeholderTextColor={COLORS.placeholder}
                    value={formData.birthday}
                    onChangeText={(value) => updateFormData('birthday', value)}
                  />
                  {validation.birthday.message && (
                    <Text style={[styles.validationText, validation.birthday.isValid ? styles.validationSuccess : styles.validationError]}>
                      {validation.birthday.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* 이메일, 비밀번호, 비밀번호 재확인 */}
              <View style={styles.bottomInputs}>
                {/* 이메일 */}
                <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, !validation.email.isValid && formData.email ? styles.inputError : null]}
                  placeholder="이메일"
                  placeholderTextColor={COLORS.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                  />
                  {validation.email.isChecking && (
                    <Text style={styles.checkingText}>이메일 확인 중...</Text>
                  )}
                  {validation.email.message && !validation.email.isChecking && (
                    <Text style={[styles.validationText, validation.email.isValid ? styles.validationSuccess : styles.validationError]}>
                      {validation.email.message}
                    </Text>
                  )}
                </View>

                {/* 비밀번호 */}
                <View style={styles.inputContainer}>
                  <View style={styles.passwordContainer}>
                <TextInput
                      style={[styles.input, styles.passwordInput, !validation.password.isValid && formData.password ? styles.inputError : null]}
                      placeholder="비밀번호 (영문+숫자, 8자 이상)"
                  placeholderTextColor={COLORS.placeholder}
                      value={formData.password}
                      onChangeText={(value) => updateFormData('password', value)}
                      secureTextEntry={!showPassword}
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
                  {formData.password && (
                    <View style={styles.passwordStrengthContainer}>
                      <Text style={styles.passwordStrengthLabel}>비밀번호 강도:</Text>
                      <Text style={[styles.passwordStrengthText, { color: getPasswordStrengthColor(validation.password.strength) }]}>
                        {validation.password.strength}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 비밀번호 확인 */}
                <View style={styles.inputContainer}>
                  <View style={styles.passwordContainer}>
                <TextInput
                      style={[styles.input, styles.passwordInput, !validation.confirmPassword.isValid && formData.confirmPassword ? styles.inputError : null]}
                  placeholder="비밀번호 재확인"
                  placeholderTextColor={COLORS.placeholder}
                      value={formData.confirmPassword}
                      onChangeText={(value) => updateFormData('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Text style={styles.eyeButtonText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>
                  {validation.confirmPassword.message && (
                    <Text style={[styles.validationText, validation.confirmPassword.isValid ? styles.validationSuccess : styles.validationError]}>
                      {validation.confirmPassword.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* 소셜 로그인 및 회원가입 버튼 */}
            <View style={styles.socialGroup}>
              <View style={styles.socialButtonContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, { backgroundColor: COLORS.kakaoButton }]}
                  onPress={handleKakaoLink}
                >
                  <Image
                    source={require('../assets/images/icon_kakao.png')}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.socialButtonText}>카카오톡 연동</Text>
              </View>
              <View style={styles.socialButtonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.socialButton, 
                    { backgroundColor: COLORS.signupButton },
                    isLoading && styles.disabledButton
                  ]}
                  onPress={handleSignup}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Text style={styles.loadingText}>처리 중...</Text>
                  ) : (
                  <Image
                    source={require('../assets/images/icon_signup.png')}
                    style={styles.socialIcon}
                  />
                  )}
                </TouchableOpacity>
                <Text style={styles.socialButtonText}>
                  {isLoading ? '처리 중...' : '회원가입'}
                </Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150, // 로고 크기 축소
    height: 150, // 로고 크기 축소
    resizeMode: 'contain',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  titlePattern: {
    width: 400,
    height: 40,
    resizeMode: 'stretch',
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: '500',
    position: 'absolute',
    fontFamily: '109LeantheWall',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 1,
  },
  topInputs: {
    marginBottom: 15, // 닉네임, 생년월일과 이메일 사이 공백
  },
  bottomInputs: {
    // 이메일, 비밀번호, 비밀번호 재확인 그룹
  },
  input: {
    color: COLORS.text,
    fontSize: 16,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    paddingVertical: 12,
    marginBottom: 10,
  },
  socialGroup: {
    flexDirection: 'row',
    marginBottom: 30,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  socialButtonText: {
    color: COLORS.text,
    fontSize: 12,
    textAlign: 'center',
  },
  // 새로운 스타일들
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
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
    right: 15,
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
  checkingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
    fontStyle: 'italic',
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 5,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
});

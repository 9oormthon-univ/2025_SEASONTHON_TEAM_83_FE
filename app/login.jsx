import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
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
import useLogin from '../hooks/useLogin';

// 색상 정의
const COLORS = {
  background: '#006256',
  text: '#FAF8D7',
  placeholder: 'rgba(250, 248, 215, 0.6)',
  loginButtonBackground: '#0F0F0F',
  loginButtonText: '#FAF8D7',
  kakaoButton: '#FEE500',
  signupButton: '#FFFFFF',
  inputBorder: '#FAF8D7',
};
const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function LoginScreen() {
  const router = useRouter();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    loginSuccess,
  } = useLogin();

  useEffect(() => {
    if (loginSuccess) {
      console.log('로그인 성공! 메인 화면으로 이동합니다.');
    }
  }, [loginSuccess]);

  const handleSignupPress = () => {
    router.push('/signup');
  };

  return (
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
            <TextInput
              style={styles.input}
              placeholder="이메일 또는 닉네임"
              placeholderTextColor={COLORS.placeholder} // 3. 상태 연결
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input} // 3. 상태 연결
              placeholder="비밀번호"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry
              value={password} // 3. 상태 연결
              onChangeText={setPassword} // 3. 상태 변경 함수 연결
              editable={!isLoading}
            />
          </View>

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin} // 4. 로직 함수 연결
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
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: COLORS.kakaoButton }]}>
                <Image
                  source={require('../assets/images/icon_kakao.png')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <Text style={styles.socialButtonText}>카카오톡</Text>
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
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: '109LeantheWall',
    position: 'absolute',
  },
  sloganSub: {
    color: COLORS.text,
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
    marginBottom: 12,
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

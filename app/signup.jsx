import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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
  greenBar: '#2D5A4F',
};

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function SignupScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // TODO: 회원가입 로직 구현
    console.log('회원가입 시도:', { nickname, birthDate, email, password, confirmPassword });
  };

  const handleKakaoLink = () => {
    // TODO: 카카오톡 연동 로직 구현
    console.log('카카오톡 연동 시도');
  };

  return (
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
              <TextInput
                style={styles.input}
                placeholder="닉네임"
                placeholderTextColor={COLORS.placeholder}
                value={nickname}
                onChangeText={setNickname}
              />
              <TextInput
                style={styles.input}
                placeholder="생년월일"
                placeholderTextColor={COLORS.placeholder}
                value={birthDate}
                onChangeText={setBirthDate}
              />
            </View>

            {/* 이메일, 비밀번호, 비밀번호 재확인 */}
            <View style={styles.bottomInputs}>
              <TextInput
                style={styles.input}
                placeholder="이메일"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="비밀번호 재확인"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
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
                style={[styles.socialButton, { backgroundColor: COLORS.signupButton }]}
                onPress={handleSignup}
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
    marginBottom: 40,
    position: 'relative',
  },
  titlePattern: {
    width: 400,
    height: 40,
    resizeMode: 'stretch',
  },
  titleText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    fontFamily: '109LeantheWall',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 40,
  },
  topInputs: {
    marginBottom: 20, // 닉네임, 생년월일과 이메일 사이 공백
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
    marginBottom: 20,
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
});

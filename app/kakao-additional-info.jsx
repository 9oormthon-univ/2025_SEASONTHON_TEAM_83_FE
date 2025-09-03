// app/kakao-additional-info.jsx
// 카카오 로그인 추가 정보 입력 화면

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { validateBirthday, validateNickname } from '../utils/validation';

// 색상 정의
const COLORS = {
  background: '#006256',
  text: '#2D2D2D',
  placeholder: 'rgba(45, 45, 45, 0.6)',
  buttonBackground: '#0F0F0F',
  buttonText: '#FAF8D7',
  inputBorder: '#2D2D2D',
};

export default function KakaoAdditionalInfoScreen() {
  const router = useRouter();
  const { updateKakaoAdditionalInfo, isAuthenticated } = useAuth();

  // 폼 데이터
  const [formData, setFormData] = useState({
    nickname: '',
    birthday: ''
  });

  // 유효성 검사 상태
  const [validation, setValidation] = useState({
    nickname: { isValid: false, message: '' },
    birthday: { isValid: false, message: '' }
  });

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 성공 시 자동으로 홈 화면으로 이동
  if (isAuthenticated) {
    router.replace('/home');
  }

  // 폼 데이터 업데이트
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 실시간 유효성 검사
    switch (field) {
      case 'nickname':
        const nicknameValidation = validateNickname(value);
        setValidation(prev => ({
          ...prev,
          nickname: nicknameValidation
        }));
        break;
        
      case 'birthday':
        const birthdayValidation = validateBirthday(value);
        setValidation(prev => ({
          ...prev,
          birthday: birthdayValidation
        }));
        break;
    }
  };

  // 추가 정보 저장 처리
  const handleSaveAdditionalInfo = async () => {
    // 전체 폼 유효성 검사
    const isFormValid = Object.values(validation).every(field => field.isValid);
    
    if (!isFormValid) {
      Alert.alert('입력 오류', '모든 필드를 올바르게 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateKakaoAdditionalInfo({
        nickname: formData.nickname,
        birthday: formData.birthday
      });

      if (result.success) {
        Alert.alert('완료', '추가 정보가 저장되었습니다.', [
          {
            text: '확인',
            onPress: () => router.replace('/home')
          }
        ]);
      } else {
        Alert.alert('오류', result.error);
      }
    } catch (error) {
      Alert.alert('오류', '추가 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#00DDC5', '#FFFFFF']}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Image
                source={require('../assets/images/icon_pleanet_logo.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>추가 정보 입력</Text>
              <Text style={styles.subtitle}>
                서비스 이용을 위해{'\n'}추가 정보를 입력해주세요
              </Text>
            </View>

            {/* 입력 필드 */}
            <View style={styles.inputGroup}>
              {/* 닉네임 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>닉네임</Text>
                <TextInput
                  style={[styles.input, !validation.nickname.isValid && formData.nickname ? styles.inputError : null]}
                  placeholder="닉네임을 입력해주세요 (2-12자)"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.nickname}
                  onChangeText={(value) => updateFormData('nickname', value)}
                  editable={!isLoading}
                />
                {validation.nickname.message && (
                  <Text style={[styles.validationText, validation.nickname.isValid ? styles.validationSuccess : styles.validationError]}>
                    {validation.nickname.message}
                  </Text>
                )}
              </View>

              {/* 생년월일 입력 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>생년월일</Text>
                <TextInput
                  style={[styles.input, !validation.birthday.isValid && formData.birthday ? styles.inputError : null]}
                  placeholder="YYYY-MM-DD 형식으로 입력해주세요"
                  placeholderTextColor={COLORS.placeholder}
                  value={formData.birthday}
                  onChangeText={(value) => updateFormData('birthday', value)}
                  editable={!isLoading}
                />
                {validation.birthday.message && (
                  <Text style={[styles.validationText, validation.birthday.isValid ? styles.validationSuccess : styles.validationError]}>
                    {validation.birthday.message}
                  </Text>
                )}
              </View>
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.disabledButton]}
              onPress={handleSaveAdditionalInfo}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? '저장 중...' : '저장하기'}
              </Text>
            </TouchableOpacity>
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
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.placeholder,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
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
  saveButton: {
    width: '100%',
    backgroundColor: COLORS.buttonBackground,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

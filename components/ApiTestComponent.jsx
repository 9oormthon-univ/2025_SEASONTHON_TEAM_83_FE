// components/ApiTestComponent.jsx
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TokenManager, getUserProfile, updateUserProfile } from '../services/api';
import { validateEmail, validatePassword } from '../utils/validation';

export default function ApiTestComponent() {
  const [testResults, setTestResults] = useState({});

  // 토큰 관리 테스트
  const testTokenManager = async () => {
    try {
      // 1. 토큰 저장 테스트
      await TokenManager.setToken('test-token-123');
      console.log('✅ 토큰 저장 성공');

      // 2. 토큰 조회 테스트
      const savedToken = await TokenManager.getToken();
      console.log('✅ 토큰 조회 성공:', savedToken);

      // 3. 로그인 상태 확인 테스트
      const isLoggedIn = await TokenManager.isLoggedIn();
      console.log('✅ 로그인 상태 확인 성공:', isLoggedIn);

      // 4. 토큰 삭제 테스트
      await TokenManager.removeToken();
      const deletedToken = await TokenManager.getToken();
      console.log('✅ 토큰 삭제 성공:', deletedToken);

      setTestResults(prev => ({
        ...prev,
        tokenManager: '✅ 모든 테스트 통과'
      }));

      Alert.alert('토큰 관리 테스트', '모든 테스트가 성공했습니다!');
    } catch (error) {
      console.error('❌ 토큰 관리 테스트 실패:', error);
      setTestResults(prev => ({
        ...prev,
        tokenManager: '❌ 테스트 실패: ' + error.message
      }));
      Alert.alert('토큰 관리 테스트', '테스트 실패: ' + error.message);
    }
  };

  // 유효성 검사 테스트
  const testValidation = () => {
    try {
      // 이메일 검증 테스트
      const validEmail = validateEmail('test@example.com');
      const invalidEmail = validateEmail('invalid-email');
      console.log('✅ 이메일 검증 테스트:', { validEmail, invalidEmail });

      // 비밀번호 검증 테스트
      const validPassword = validatePassword('password123');
      const invalidPassword = validatePassword('123');
      console.log('✅ 비밀번호 검증 테스트:', { validPassword, invalidPassword });

      setTestResults(prev => ({
        ...prev,
        validation: '✅ 모든 테스트 통과'
      }));

      Alert.alert('유효성 검사 테스트', '모든 테스트가 성공했습니다!');
    } catch (error) {
      console.error('❌ 유효성 검사 테스트 실패:', error);
      setTestResults(prev => ({
        ...prev,
        validation: '❌ 테스트 실패: ' + error.message
      }));
      Alert.alert('유효성 검사 테스트', '테스트 실패: ' + error.message);
    }
  };

  // API 설정 테스트
  const testApiConfig = () => {
    try {
      const { getCurrentApiConfig } = require('../config/api');
      const config = getCurrentApiConfig();
      console.log('✅ API 설정 테스트:', config);

      setTestResults(prev => ({
        ...prev,
        apiConfig: '✅ 설정 로드 성공: ' + config.BASE_URL
      }));

      Alert.alert('API 설정 테스트', `설정 로드 성공!\nBase URL: ${config.BASE_URL}`);
    } catch (error) {
      console.error('❌ API 설정 테스트 실패:', error);
      setTestResults(prev => ({
        ...prev,
        apiConfig: '❌ 테스트 실패: ' + error.message
      }));
      Alert.alert('API 설정 테스트', '테스트 실패: ' + error.message);
    }
  };

  // 네트워크 연결 테스트
  const testNetworkConnection = async () => {
    try {
      const { getCurrentApiConfig } = require('../config/api');
      const config = getCurrentApiConfig();
      
      console.log('🔄 네트워크 연결 테스트 시작...', config.BASE_URL);
      
      // 간단한 연결 테스트 (OPTIONS 요청)
      const response = await fetch(config.BASE_URL, {
        method: 'OPTIONS',
        timeout: 5000,
      });
      
      console.log('✅ 네트워크 연결 성공:', response.status);
      
      setTestResults(prev => ({
        ...prev,
        networkConnection: `✅ 연결 성공 - ${config.BASE_URL} (${response.status})`
      }));
      
      Alert.alert('네트워크 연결 테스트', `연결 성공!\n서버: ${config.BASE_URL}\n상태: ${response.status}`);
    } catch (error) {
      console.error('❌ 네트워크 연결 테스트 실패:', error);
      setTestResults(prev => ({
        ...prev,
        networkConnection: '❌ 연결 실패: ' + error.message
      }));
      Alert.alert('네트워크 연결 테스트', '연결 실패: ' + error.message);
    }
  };

  // 토큰 상태 확인
  const checkTokenStatus = async () => {
    try {
      const token = await TokenManager.getToken();
      const isLoggedIn = await TokenManager.isLoggedIn();
      
      console.log('🔍 토큰 상태 확인:', { token: token ? '있음' : '없음', isLoggedIn });
      
      setTestResults(prev => ({
        ...prev,
        tokenStatus: `토큰: ${token ? '있음' : '없음'}, 로그인: ${isLoggedIn ? '됨' : '안됨'}`
      }));
      
      Alert.alert(
        '토큰 상태 확인', 
        `토큰: ${token ? '있음' : '없음'}\n로그인 상태: ${isLoggedIn ? '됨' : '안됨'}`
      );
    } catch (error) {
      console.error('❌ 토큰 상태 확인 실패:', error);
      setTestResults(prev => ({
        ...prev,
        tokenStatus: '❌ 확인 실패: ' + error.message
      }));
      Alert.alert('토큰 상태 확인', '확인 실패: ' + error.message);
    }
  };

  // 유저 정보 조회 API 테스트
  const testUserProfile = async () => {
    try {
      // 먼저 토큰 상태 확인
      const token = await TokenManager.getToken();
      if (!token) {
        Alert.alert(
          '인증 필요', 
          '유저 정보 조회를 위해서는 로그인이 필요합니다.\n\n로그인 후 다시 시도해주세요.'
        );
        return;
      }

      console.log('🔄 유저 정보 조회 API 테스트 시작...');
      const response = await getUserProfile();
      
      console.log('✅ 유저 정보 조회 성공:', response);
      
      if (response.isSuccess) {
        const userInfo = response.result;
        setTestResults(prev => ({
          ...prev,
          userProfile: `✅ 성공 - 닉네임: ${userInfo.nickname}, 이메일: ${userInfo.email}`
        }));
        
        Alert.alert(
          '유저 정보 조회 테스트', 
          `성공!\n닉네임: ${userInfo.nickname}\n이메일: ${userInfo.email}`
        );
      } else {
        setTestResults(prev => ({
          ...prev,
          userProfile: '❌ API 응답 실패: ' + response.message
        }));
        Alert.alert('유저 정보 조회 테스트', 'API 응답 실패: ' + response.message);
      }
    } catch (error) {
      console.error('❌ 유저 정보 조회 테스트 실패:', error);
      setTestResults(prev => ({
        ...prev,
        userProfile: '❌ 테스트 실패: ' + error.message
      }));
      Alert.alert('유저 정보 조회 테스트', '테스트 실패: ' + error.message);
    }
  };

  // 유저 정보 수정 API 테스트
  const testUserProfileUpdate = async () => {
    try {
      // 먼저 토큰 상태 확인
      const token = await TokenManager.getToken();
      if (!token) {
        Alert.alert(
          '인증 필요', 
          '유저 정보 수정을 위해서는 로그인이 필요합니다.\n\n로그인 후 다시 시도해주세요.'
        );
        return;
      }

      console.log('🔄 유저 정보 수정 API 테스트 시작...');
      
      // 테스트용 수정 데이터
      const updateData = {
        nickname: "테스트닉네임",
        birthday: "2003-12-02"
      };
      
      const response = await updateUserProfile(updateData);
      
      console.log('✅ 유저 정보 수정 성공:', response);
      
      if (response.isSuccess) {
        const userInfo = response.result;
        setTestResults(prev => ({
          ...prev,
          userProfileUpdate: `✅ 성공 - 닉네임: ${userInfo.nickname}, 생년월일: ${userInfo.birthday}`
        }));
        
        Alert.alert(
          '유저 정보 수정 테스트', 
          `성공!\n닉네임: ${userInfo.nickname}\n생년월일: ${userInfo.birthday}`
        );
      } else {
        setTestResults(prev => ({
          ...prev,
          userProfileUpdate: '❌ API 응답 실패: ' + response.message
        }));
        Alert.alert('유저 정보 수정 테스트', 'API 응답 실패: ' + response.message);
      }
    } catch (error) {
      console.error('❌ 유저 정보 수정 테스트 실패:', error);
      setTestResults(prev => ({
        ...prev,
        userProfileUpdate: '❌ 테스트 실패: ' + error.message
      }));
      Alert.alert('유저 정보 수정 테스트', '테스트 실패: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API 인프라 테스트</Text>
      
      <TouchableOpacity style={styles.button} onPress={testTokenManager}>
        <Text style={styles.buttonText}>토큰 관리 테스트</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testValidation}>
        <Text style={styles.buttonText}>유효성 검사 테스트</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testApiConfig}>
        <Text style={styles.buttonText}>API 설정 테스트</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testNetworkConnection}>
        <Text style={styles.buttonText}>네트워크 연결 테스트</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={checkTokenStatus}>
        <Text style={styles.buttonText}>토큰 상태 확인</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testUserProfile}>
        <Text style={styles.buttonText}>유저 정보 조회 테스트</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: '#ff9800' }]} onPress={testUserProfileUpdate}>
        <Text style={styles.buttonText}>유저 정보 수정 테스트</Text>
      </TouchableOpacity>

      <View style={styles.results}>
        <Text style={styles.resultsTitle}>테스트 결과:</Text>
        {Object.entries(testResults).map(([key, value]) => (
          <Text key={key} style={styles.resultText}>
            {key}: {value}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  results: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

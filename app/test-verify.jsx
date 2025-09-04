// app/test-verify.jsx

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AuthService from '../services/authService';

export default function TestVerifyScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const testVerifyChallenge = async () => {
    try {
      setLoading(true);
      console.log('=== 사진 인증 검증 테스트 시작 ===');
      
      const challengeId = 5; // 텀블러 챌린지 ID
      const result = await AuthService.verifyChallenge(challengeId);
      
      console.log('API 응답:', result);
      
      if (result.success) {
        Alert.alert(
          '테스트 성공!', 
          `사진 인증 검증 성공!\n\n성공: ${result.data.success}\n리워드: ${result.data.reward}포인트\n메시지: ${result.data.message}`,
          [{ text: '확인' }]
        );
      } else {
        Alert.alert('테스트 실패', `오류: ${result.error}`);
      }
    } catch (error) {
      console.error('테스트 중 오류:', error);
      Alert.alert('테스트 오류', `예외 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>사진 인증 검증 API 테스트</Text>
        <Text style={styles.subtitle}>사진 인증 검증 API를 테스트해보세요</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, loading && styles.disabledButton]}
          onPress={testVerifyChallenge}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>사진 인증 검증 테스트</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.secondaryButton]}
          onPress={() => router.push('/challenge-tumbler-photo')}
        >
          <Text style={styles.secondaryButtonText}>텀블러 사진 화면으로 이동</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>테스트 정보</Text>
        <Text style={styles.infoText}>
          • API: POST /api/challenges/5/verify{'\n'}
          • 챌린지 ID: 5 (텀블러 챌린지){'\n'}
          • JWT 토큰이 필요합니다{'\n'}
          • 응답: success, reward, message
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  testButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#666',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

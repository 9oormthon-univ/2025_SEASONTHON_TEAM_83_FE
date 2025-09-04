// app/test-attendance.jsx

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
import AttendanceService from '../services/attendanceService';

export default function TestAttendanceScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const testMonthlyAttendance = async () => {
    try {
      setLoading(true);
      console.log('=== 월별 출석 현황 조회 테스트 시작 ===');
      
      const result = await AttendanceService.getMonthlyAttendance();
      
      console.log('API 응답:', result);
      
      if (result.success) {
        Alert.alert(
          '테스트 성공!', 
          `월별 출석 현황 조회 성공!\n\n월: ${result.data.month}\n총 출석일: ${result.data.totalChecked}일\n출석 데이터: ${result.data.attendances.length}개`,
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

  const testAttendanceSummary = async () => {
    try {
      setLoading(true);
      console.log('=== 출석 포인트 합계 조회 테스트 시작 ===');
      
      const result = await AttendanceService.getAttendanceSummary();
      
      console.log('API 응답:', result);
      
      if (result.success) {
        Alert.alert(
          '테스트 성공!', 
          `출석 포인트 합계 조회 성공!\n\n총 포인트: ${result.data.totalPoints}P`,
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

  const testCheckAttendance = async () => {
    try {
      setLoading(true);
      console.log('=== 오늘 출석하기 테스트 시작 ===');
      
      const result = await AttendanceService.checkAttendance();
      
      console.log('API 응답:', result);
      
      if (result.success) {
        Alert.alert(
          '테스트 성공!', 
          `오늘 출석하기 성공!\n\n응답: ${JSON.stringify(result.data, null, 2)}`,
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

  const testAllAPIs = async () => {
    try {
      setLoading(true);
      console.log('=== 모든 출석 API 테스트 시작 ===');
      
      const results = await Promise.allSettled([
        AttendanceService.getMonthlyAttendance(),
        AttendanceService.getAttendanceSummary(),
        AttendanceService.checkAttendance(),
      ]);

      const [monthlyResult, summaryResult, checkResult] = results;
      
      let successCount = 0;
      let message = '';

      if (monthlyResult.status === 'fulfilled' && monthlyResult.value.success) {
        successCount++;
        message += `✅ 월별 출석 현황: 성공\n`;
      } else {
        message += `❌ 월별 출석 현황: 실패\n`;
      }

      if (summaryResult.status === 'fulfilled' && summaryResult.value.success) {
        successCount++;
        message += `✅ 출석 포인트 합계: 성공\n`;
      } else {
        message += `❌ 출석 포인트 합계: 실패\n`;
      }

      if (checkResult.status === 'fulfilled' && checkResult.value.success) {
        successCount++;
        message += `✅ 오늘 출석하기: 성공\n`;
      } else {
        message += `❌ 오늘 출석하기: 실패\n`;
      }

      Alert.alert(
        '전체 테스트 완료',
        `${message}\n성공: ${successCount}/3`,
        [{ text: '확인' }]
      );
    } catch (error) {
      console.error('전체 테스트 중 오류:', error);
      Alert.alert('테스트 오류', `예외 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>출석 API 테스트</Text>
        <Text style={styles.subtitle}>출석 관련 API들을 테스트해보세요</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, styles.primaryButton]}
          onPress={testAllAPIs}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>전체 API 테스트</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={testMonthlyAttendance}
          disabled={loading}
        >
          <Text style={styles.buttonText}>월별 출석 현황 조회</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={testAttendanceSummary}
          disabled={loading}
        >
          <Text style={styles.buttonText}>출석 포인트 합계 조회</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={testCheckAttendance}
          disabled={loading}
        >
          <Text style={styles.buttonText}>오늘 출석하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.secondaryButton]}
          onPress={() => router.push('/attendance')}
        >
          <Text style={styles.secondaryButtonText}>출석 현황 화면으로 이동</Text>
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
          • 월별 출석 현황 조회: GET /api/attendance/monthly{'\n'}
          • 출석 포인트 합계 조회: GET /api/attendance/summary{'\n'}
          • 오늘 출석하기: POST /api/attendance/check{'\n'}
          • 모든 API는 JWT 토큰이 필요합니다
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
  primaryButton: {
    backgroundColor: '#2E7D32',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  backButton: {
    backgroundColor: '#666',
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

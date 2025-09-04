import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageUploader from '../components/ImageUploader';

export default function TestUploadScreen() {
  const router = useRouter();
  const [uploadResults, setUploadResults] = useState([]);

  // 업로드 성공 처리
  const handleUploadSuccess = (type, data) => {
    const result = {
      type,
      success: true,
      photoUrl: data.photoUrl,
      timestamp: new Date().toLocaleTimeString(),
    };
    setUploadResults(prev => [result, ...prev]);
    console.log(`${type} 업로드 성공:`, data);
  };

  // 업로드 에러 처리
  const handleUploadError = (type, error) => {
    const result = {
      type,
      success: false,
      error: error,
      timestamp: new Date().toLocaleTimeString(),
    };
    setUploadResults(prev => [result, ...prev]);
    console.error(`${type} 업로드 실패:`, error);
  };

  // 결과 초기화
  const clearResults = () => {
    setUploadResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← 뒤로가기</Text>
        </TouchableOpacity>
        <Text style={styles.title}>사진 업로드 테스트</Text>
      </View>

      <View style={styles.content}>
        {/* 테스트 1: 텀블러 사진 */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>테스트 1: 텀블러 사진 업로드</Text>
          <ImageUploader
            challengeId={2}
            onUploadSuccess={(data) => handleUploadSuccess('텀블러', data)}
            onUploadError={(error) => handleUploadError('텀블러', error)}
            placeholder="텀블러 사진을 선택해주세요"
            buttonText="텀블러 사진 선택"
          />
        </View>

        {/* 테스트 2: 텀블러 인증 사진 */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>테스트 2: 텀블러 인증 사진 업로드</Text>
          <Text style={styles.testDescription}>
            텀블러와 영수증을 함께 찍은 사진으로 테스트
          </Text>
          <ImageUploader
            challengeId={2}
            onUploadSuccess={(data) => handleUploadSuccess('텀블러 인증', data)}
            onUploadError={(error) => handleUploadError('텀블러 인증', error)}
            placeholder="텀블러와 영수증이 함께 찍힌 사진을 선택해주세요"
            buttonText="인증 사진 선택"
          />
        </View>

        {/* 테스트 3: 걷기 챌린지 사진 */}
        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>테스트 3: 걷기 챌린지 사진 업로드</Text>
          <ImageUploader
            challengeId={1}
            onUploadSuccess={(data) => handleUploadSuccess('걷기', data)}
            onUploadError={(error) => handleUploadError('걷기', error)}
            placeholder="걷기 인증 사진을 선택해주세요"
            buttonText="걷기 사진 선택"
          />
        </View>

        {/* 결과 표시 */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>업로드 결과</Text>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearResults}
            >
              <Text style={styles.clearButtonText}>초기화</Text>
            </TouchableOpacity>
          </View>

          {uploadResults.length === 0 ? (
            <Text style={styles.noResults}>아직 업로드 결과가 없습니다.</Text>
          ) : (
            uploadResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultType}>{result.type}</Text>
                  <Text style={styles.resultTime}>{result.timestamp}</Text>
                </View>
                {result.success ? (
                  <View style={styles.successResult}>
                    <Text style={styles.successText}>✅ 성공</Text>
                    <Text style={styles.photoUrl} numberOfLines={2}>
                      {result.photoUrl}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.errorResult}>
                    <Text style={styles.errorText}>❌ 실패</Text>
                    <Text style={styles.errorMessage}>{result.error}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* API 정보 */}
        <View style={styles.apiInfoSection}>
          <Text style={styles.apiInfoTitle}>API 정보</Text>
          <Text style={styles.apiInfoText}>
            엔드포인트: POST /api/challenges/{'{challengeId}'}/photo{'\n'}
            헤더: Authorization: Bearer {'<JWT>'}, Content-Type: multipart/form-data{'\n'}
            Form Data: file (이미지 파일){'\n'}
            응답: photoUrl (업로드된 이미지 URL)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#006256',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard Variable',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Pretendard Variable',
  },
  content: {
    padding: 20,
  },
  testSection: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 5,
  },
  testDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    marginBottom: 15,
    lineHeight: 20,
  },
  resultsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Pretendard Variable',
  },
  noResults: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
    paddingVertical: 20,
  },
  resultItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
  },
  resultTime: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
  },
  successResult: {
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 6,
  },
  successText: {
    fontSize: 14,
    color: '#006256',
    fontFamily: 'Pretendard Variable',
    marginBottom: 4,
  },
  photoUrl: {
    fontSize: 12,
    color: '#006256',
    fontFamily: 'Pretendard Variable',
  },
  errorResult: {
    backgroundColor: '#FFE8E8',
    padding: 8,
    borderRadius: 6,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontFamily: 'Pretendard Variable',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: 'Pretendard Variable',
  },
  apiInfoSection: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 20,
  },
  apiInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 10,
  },
  apiInfoText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    lineHeight: 18,
  },
});

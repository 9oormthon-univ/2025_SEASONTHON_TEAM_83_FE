import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import UploadService from '../services/uploadService';

const ImageUploader = ({ 
  challengeId, 
  onUploadSuccess, 
  onUploadError,
  placeholder = "사진을 선택해주세요",
  buttonText = "사진 선택"
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  // 이미지 선택
  const selectImage = async () => {
    try {
      // 권한 요청
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        console.log('이미지 선택됨:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('이미지 선택 실패:', error);
      Alert.alert('오류', '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  // 카메라로 촬영
  const takePhoto = async () => {
    try {
      // 카메라 권한 요청
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
        return;
      }

      // 카메라로 촬영
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        console.log('사진 촬영됨:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('사진 촬영 실패:', error);
      Alert.alert('오류', '사진 촬영 중 오류가 발생했습니다.');
    }
  };

  // 이미지 업로드
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('알림', '먼저 이미지를 선택해주세요.');
      return;
    }

    try {
      setUploading(true);
      console.log('이미지 업로드 시작:', { challengeId, selectedImage });

      const response = await UploadService.uploadPhoto(challengeId, selectedImage);

      if (response.success) {
        setUploadedImageUrl(response.data.photoUrl);
        console.log('이미지 업로드 성공:', response.data.photoUrl);
        
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }
        
        Alert.alert('성공', '이미지가 성공적으로 업로드되었습니다!');
      } else {
        console.error('이미지 업로드 실패:', response.error);
        
        if (onUploadError) {
          onUploadError(response.error);
        }
        
        Alert.alert('업로드 실패', response.error || '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      
      if (onUploadError) {
        onUploadError(error.message);
      }
      
      Alert.alert('오류', '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 이미지 선택 옵션 표시
  const showImageOptions = () => {
    Alert.alert(
      '이미지 선택',
      '이미지를 어떻게 가져오시겠습니까?',
      [
        { text: '갤러리에서 선택', onPress: selectImage },
        { text: '카메라로 촬영', onPress: takePhoto },
        { text: '취소', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 이미지 미리보기 */}
      <View style={styles.imageContainer}>
        {uploadedImageUrl ? (
          <Image source={{ uri: uploadedImageUrl }} style={styles.previewImage} />
        ) : selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}
      </View>

      {/* 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.selectButton]} 
          onPress={showImageOptions}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>
            {selectedImage ? '이미지 다시 선택' : buttonText}
          </Text>
        </TouchableOpacity>

        {selectedImage && !uploadedImageUrl && (
          <TouchableOpacity 
            style={[styles.button, styles.uploadButton]} 
            onPress={uploadImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>업로드</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* 업로드 상태 */}
      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" color="#006256" />
          <Text style={styles.uploadingText}>업로드 중...</Text>
        </View>
      )}

      {/* 업로드 성공 표시 */}
      {uploadedImageUrl && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✅ 업로드 완료!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButton: {
    backgroundColor: '#006256',
  },
  uploadButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Pretendard Variable',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadingText: {
    fontSize: 14,
    color: '#006256',
    marginLeft: 8,
    fontFamily: 'Pretendard Variable',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  successText: {
    fontSize: 14,
    color: '#006256',
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
});

export default ImageUploader;

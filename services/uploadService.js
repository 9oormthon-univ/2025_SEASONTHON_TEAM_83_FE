import { apiClient } from './api';

// 업로드 서비스
export const UploadService = {
  // 사진 업로드
  async uploadPhoto(challengeId, imageUri) {
    try {
      console.log('사진 업로드 시작:', { challengeId, imageUri });
      
      // FormData 생성
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      // API 호출
      const response = await apiClient.post(
        `/api/challenges/${challengeId}/photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('사진 업로드 성공:', response);
      return {
        success: true,
        data: response.result,
        message: response.message,
      };
    } catch (error) {
      console.error('사진 업로드 실패:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // 이미지 압축 (선택사항)
  async compressImage(imageUri, quality = 0.8) {
    try {
      // expo-image-manipulator를 사용한 이미지 압축
      // 현재는 원본 이미지 반환
      return imageUri;
    } catch (error) {
      console.error('이미지 압축 실패:', error);
      return imageUri; // 압축 실패 시 원본 반환
    }
  },
};

export default UploadService;

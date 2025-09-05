// components/UserProfileTest.jsx
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfileTest() {
  const { user, updateProfile, updateNickname, updateBirthday, updateProfileImage } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const [profileUrl, setProfileUrl] = useState(user?.profileUrl || '');

  // 사용자 정보 조회
  const handleGetProfile = () => {
    if (user) {
      Alert.alert(
        '현재 사용자 정보',
        `닉네임: ${user.nickname || '없음'}\n이메일: ${user.email || '없음'}\n생년월일: ${user.birthday || '없음'}\n프로필 이미지: ${user.profileUrl || '없음'}`
      );
    } else {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
    }
  };

  // 닉네임 수정
  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert('오류', '닉네임을 입력해주세요.');
      return;
    }

    try {
      const response = await updateNickname(nickname.trim());
      if (response.success) {
        Alert.alert('성공', '닉네임이 수정되었습니다.');
      } else {
        Alert.alert('실패', response.error);
      }
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  // 생년월일 수정
  const handleUpdateBirthday = async () => {
    if (!birthday.trim()) {
      Alert.alert('오류', '생년월일을 입력해주세요. (YYYY-MM-DD 형식)');
      return;
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthday)) {
      Alert.alert('오류', '생년월일은 YYYY-MM-DD 형식으로 입력해주세요.');
      return;
    }

    try {
      const response = await updateBirthday(birthday.trim());
      if (response.success) {
        Alert.alert('성공', '생년월일이 수정되었습니다.');
      } else {
        Alert.alert('실패', response.error);
      }
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  // 프로필 이미지 수정
  const handleUpdateProfileImage = async () => {
    if (!profileUrl.trim()) {
      Alert.alert('오류', '프로필 이미지 URL을 입력해주세요.');
      return;
    }

    try {
      const response = await updateProfileImage(profileUrl.trim());
      if (response.success) {
        Alert.alert('성공', '프로필 이미지가 수정되었습니다.');
      } else {
        Alert.alert('실패', response.error);
      }
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  // 전체 프로필 수정
  const handleUpdateProfile = async () => {
    const updateData = {};
    
    if (nickname.trim()) updateData.nickname = nickname.trim();
    if (birthday.trim()) updateData.birthday = birthday.trim();
    if (profileUrl.trim()) updateData.profileUrl = profileUrl.trim();

    if (Object.keys(updateData).length === 0) {
      Alert.alert('오류', '수정할 정보를 입력해주세요.');
      return;
    }

    try {
      const response = await updateProfile(updateData);
      if (response.success) {
        Alert.alert('성공', '프로필이 수정되었습니다.');
      } else {
        Alert.alert('실패', response.error);
      }
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사용자 정보 테스트</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleGetProfile}>
        <Text style={styles.buttonText}>현재 사용자 정보 조회</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="닉네임을 입력하세요"
        />
        <TouchableOpacity style={styles.smallButton} onPress={handleUpdateNickname}>
          <Text style={styles.smallButtonText}>닉네임 수정</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>생년월일 (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={birthday}
          onChangeText={setBirthday}
          placeholder="2003-12-02"
        />
        <TouchableOpacity style={styles.smallButton} onPress={handleUpdateBirthday}>
          <Text style={styles.smallButtonText}>생년월일 수정</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>프로필 이미지 URL</Text>
        <TextInput
          style={styles.input}
          value={profileUrl}
          onChangeText={setProfileUrl}
          placeholder="https://example.com/image.jpg"
        />
        <TouchableOpacity style={styles.smallButton} onPress={handleUpdateProfileImage}>
          <Text style={styles.smallButtonText}>이미지 수정</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>전체 프로필 수정</Text>
      </TouchableOpacity>
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
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  smallButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});


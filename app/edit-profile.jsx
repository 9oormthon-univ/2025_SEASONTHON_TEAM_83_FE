// app/edit-profile.jsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ActionButton';
import FormInput from '../components/FormInput';
import HeaderBar from '../components/HeaderBar';
import ProfileCard from '../components/ProfileCard';
import { PROFILE_COLORS } from '../constants/ProfileConstants';
import { getUserProfile, updateUserProfile } from '../services/api';

export default function EditProfile() {
  const router = useRouter();

  // form state
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // 유저 정보 로드
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      
      if (response.isSuccess) {
        const userInfo = response.result;
        setUserProfile(userInfo);
        setNickname(userInfo.nickname || '');
        setEmail(userInfo.email || '');
        setBirthday(userInfo.birthday || '');
      } else {
        Alert.alert('오류', '유저 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('유저 정보 로드 실패:', error);
      Alert.alert('오류', '유저 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 유저 정보 로드
  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 입력값 검증
      if (!nickname.trim()) {
        Alert.alert('알림', '닉네임을 입력해주세요.');
        return;
      }
      
      if (!birthday.trim()) {
        Alert.alert('알림', '생년월일을 입력해주세요.');
        return;
      }
      
      // 생년월일 형식 검증 (YYYY-MM-DD)
      const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!birthdayRegex.test(birthday)) {
        Alert.alert('알림', '생년월일은 YYYY-MM-DD 형식으로 입력해주세요.');
        return;
      }
      
      // 수정할 데이터 준비
      const updateData = {
        nickname: nickname.trim(),
        birthday: birthday.trim()
      };
      
      // API 호출
      const response = await updateUserProfile(updateData);
      
      if (response && response.isSuccess) {
        // 성공 시 마이 페이지로 이동
        router.replace('/my-page');
      } else {
        Alert.alert('오류', response?.message || '프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      Alert.alert('오류', '프로필 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoEdit = () => {
    console.log('프로필 이미지 수정');
  };

  const handleKakaoUnlink = () => {
    console.log('카카오 연동 취소');
  };

  // 로딩 상태
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="dark-content" />
        <HeaderBar title="My Page" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>유저 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="dark-content" />

      <HeaderBar title="My Page" />

      <ProfileCard
        avatar={require('../assets/images/icon_level1.png')}
        name={userProfile?.nickname || "닉네임"}
        email={userProfile?.email || "이메일@naver.com"}
        badge={require('../assets/images/icon_pleanet_logo.png')}
        showEditButton={false}
        showPhotoEditButton={true}
        onPhotoEditPress={handlePhotoEdit}
      />

      <View style={styles.body}>
        <FormInput
          label="닉네임 변경"
          value={nickname}
          onChangeText={setNickname}
          onClear={() => setNickname('')}
          placeholder="새로운 닉네임을 입력하세요"
        />

        <FormInput
          label="생년월일 변경"
          value={birthday}
          onChangeText={setBirthday}
          onClear={() => setBirthday('')}
          placeholder="YYYY-MM-DD 형식으로 입력하세요"
        />

        <FormInput
          label="이메일 (읽기 전용)"
          value={email}
          editable={false}
          style={styles.readOnlyInput}
        />

        <ActionButton
          title="Kakao 연동 취소"
          onPress={handleKakaoUnlink}
          variant="kakao"
          style={styles.kakaoButton}
        />

        <ActionButton
          title={saving ? "저장 중..." : "저장하기"}
          onPress={handleSave}
          variant="primary"
          style={styles.saveButton}
          disabled={saving}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: PROFILE_COLORS.bg 
  },
  body: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 14 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  kakaoButton: {
    marginTop: 22,
  },
  saveButton: {
    marginTop: 16,
  },
});

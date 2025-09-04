// app/edit-profile.jsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButton from '../components/ActionButton';
import FormInput from '../components/FormInput';
import HeaderBar from '../components/HeaderBar';
import ProfileCard from '../components/ProfileCard';
import { PROFILE_COLORS } from '../constants/ProfileConstants';

export default function EditProfile() {
  const router = useRouter();

  // form state
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    // TODO: 서버로 저장 로직
    console.log({ nickname, email });
    router.back();
  };

  const handlePhotoEdit = () => {
    console.log('프로필 이미지 수정');
  };

  const handleKakaoUnlink = () => {
    console.log('카카오 연동 취소');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="dark-content" />

      <HeaderBar title="My Page" />

      <ProfileCard
        avatar={require('../assets/images/icon_level1.png')}
        name="닉네임"
        email="이메일@naver.com"
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
        />

        <FormInput
          label="이메일 변경"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          onClear={() => setEmail('')}
        />

        <ActionButton
          title="Kakao 연동 취소"
          onPress={handleKakaoUnlink}
          variant="kakao"
          style={styles.kakaoButton}
        />

        <ActionButton
          title="저장하기"
          onPress={handleSave}
          variant="primary"
          style={styles.saveButton}
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
  kakaoButton: {
    marginTop: 22,
  },
  saveButton: {
    marginTop: 16,
  },
});

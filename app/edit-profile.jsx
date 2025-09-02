// app/edit-profile.jsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderBar from '../components/HeaderBar';


const COLORS = {
  bg: '#EDE4CC',
  header: '#0F3A2D',
  ink: '#1F2A22',
  sub: '#7A8B83',
  card: '#FFFFFF',
  line: '#EAEFE7',
  green: '#0F6D52',
  ivory: '#FFF7D6',
  kakao: '#FEE500',
};

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // form state
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const onClear = (setter) => setter('');

  const onSave = () => {
    // TODO: 서버로 저장 로직
    console.log({ nickname, email });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar translucent={Platform.OS === 'android'} backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <HeaderBar title = "My Page"/>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image source={require('../assets/images/icon_level1.png')} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.profileName} numberOfLines={1}>닉네임</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>이메일@naver.com</Text>
          </View>
          <Image source={require('../assets/images/icon_pleanet_logo.png')} style={styles.badge} resizeMode="contain" />
        </View>

        <TouchableOpacity style={styles.photoBtn} onPress={() => console.log('프로필 이미지 수정')}>
          <Text style={styles.photoBtnTxt}>프로필 이미지 수정</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.body}>

        {/* 닉네임 변경 */}
        <Text style={styles.sectionTitle}>닉네임 변경</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="내용 입력"
            placeholderTextColor={COLORS.sub}
            style={styles.input}
          />
          {!!nickname && (
            <Pressable style={styles.clearBtn} hitSlop={10} onPress={() => onClear(setNickname)}>
              <Text style={styles.clearTxt}>×</Text>
            </Pressable>
          )}
        </View>

        {/* 이메일 변경 */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>이메일 변경</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="내용 입력"
            placeholderTextColor={COLORS.sub}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          {!!email && (
            <Pressable style={styles.clearBtn} hitSlop={10} onPress={() => onClear(setEmail)}>
              <Text style={styles.clearTxt}>×</Text>
            </Pressable>
          )}
        </View>

        {/* 계정 연동 관리 */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>계정 연동 관리</Text>
        <TouchableOpacity style={styles.kakaoBtn} onPress={() => console.log('카카오 연동 취소')}>
          <Text style={styles.kakaoTxt}>Kakao 연동 취소</Text>
        </TouchableOpacity>

        {/* 저장하기 */}
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveTxt}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const R = 12;
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  /* header */
  header: {
    backgroundColor: COLORS.bg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 20, color: COLORS.ink, marginTop: -2 },
  title: { flex: 1, textAlign: 'center', fontSize: 18, color: COLORS.ink, fontWeight: '800' },

  /* profile card */
  card: {
    backgroundColor: COLORS.card,
    borderRadius: R,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
    }),
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E4F2E4' },
  profileName: { fontSize: 16, fontWeight: '800', color: COLORS.ink },
  profileEmail: { fontSize: 12, color: COLORS.sub, marginTop: 2 },
  badge: { width: 64, height: 80 },

  photoBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#F1F6F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D4E2D8',
  },
  photoBtnTxt: { fontSize: 12, color: COLORS.ink, fontWeight: '700' },

  /* form */
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },

  sectionTitle: { fontSize: 14, fontWeight: '900', color: COLORS.ink, marginBottom: 8 },

  inputWrap: { position: 'relative' },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  clearBtn: { position: 'absolute', right: 10, top: 10, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  clearTxt: { fontSize: 18, color: COLORS.sub, lineHeight: 20 },

  kakaoBtn: {
    backgroundColor: COLORS.kakao,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  kakaoTxt: { fontSize: 14, fontWeight: '800', color: '#191600' },

  saveBtn: {
    marginTop: 16,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  saveTxt: { color: '#fff', fontSize: 16, fontWeight: '900' },
});

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../contexts/AuthContext';
import { PointProvider } from '../contexts/PointContext';

// 프로덕션 환경에서 콘솔 로그 비활성화 (폰트 로딩 완료 후에만 적용)

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // 폰트 로딩 활성화 (에러 처리 추가)
  const [fontsLoaded, fontError] = useFonts({
    '109LeantheWall': require('../assets/fonts/109LeantheWall.ttf'),
    'Pretendard Variable': require('../assets/fonts/PretendardVariable.ttf'),
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 폰트 로딩 에러 처리
  if (fontError) {
    console.error('폰트 로딩 에러:', fontError);
  }

  // 폰트 로딩 중일 때만 대기 (에러가 있어도 계속 진행)
  if (!fontsLoaded && !fontError) {
    console.log('폰트 로딩 중...');
    return null;
  }

  if (fontsLoaded) {
    console.log('폰트 로딩 완료');
  }
  
  // 폰트 로딩 완료 후 프로덕션 환경에서 콘솔 로그 비활성화
  if (!__DEV__) {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.info = () => {};
  }

  return (
    <AuthProvider>
      <PointProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="kakao-additional-info" options={{ headerShown: false }} />
        <Stack.Screen name="challenge-walk-progress" options={{ headerShown: false }} />
          <Stack.Screen name="category-setup" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="challenge" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="my-page" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="edit-profile" options={{headerShown : false, animation : 'none'}}/>
          <Stack.Screen name="my-forest" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
          <Stack.Screen name="attendance" options={{ headerShown: false }} />
          <Stack.Screen name="challenge-certification" options={{ headerShown: false }} />
          <Stack.Screen name="badges" options={{ headerShown: false }} />
          <Stack.Screen name="ranking" options={{ headerShown: false }} />
          <Stack.Screen name="points" options={{ headerShown: false }} />
          <Stack.Screen name="reward-conversion" options={{ headerShown: false }} />
          <Stack.Screen name="test-attendance" options={{ headerShown: false }} />
          <Stack.Screen name="test-verify" options={{ headerShown: false }} />
          <Stack.Screen name="user-profile-test" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PointProvider>
    </AuthProvider>
  );
}

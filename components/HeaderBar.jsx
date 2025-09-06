import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = { header: '#0F3A2D', ivory: '#FFF7D6' };
const HEADER_H = 64;

export default function HeaderBar({
  title = '',
  showRight = true,
  onRightPress,
  titleStyle, // 필요 시 외부에서 override
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  
  const [loaded] = useFonts({
    LeantheWall: require('../assets/fonts/109LeantheWall.ttf'),
  });
  if (!loaded) return null; 

  return (
    <View style={[styles.headerRoot, { paddingTop: insets.top }]}>
      <Image
        source={require('../assets/images/bar_green.png')}
        style={styles.headerBg}
        resizeMode="stretch"
      />
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="뒤로가기">
          <Image source={require('../assets/images/icon_back_button.png')} style={styles.iconImg} />
        </Pressable>

        {/* 폰트는 기본적으로 LeantheWall, 필요 시 titleStyle로 override */}
        <Text style={[styles.headerTitle, titleStyle]} numberOfLines={1}>
          {title}
        </Text>

        {showRight ? (
          <Pressable onPress={onRightPress || (() => {})} hitSlop={12} accessibilityLabel="알림">
            <Image source={require('../assets/images/icon_alarm.png')} style={styles.iconImg} />
          </Pressable>
        ) : (
          <View style={{ width: 20 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRoot: {
    position: 'relative',
    backgroundColor: COLORS.header,
    minHeight: HEADER_H,
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: COLORS.ivory,
  },
  headerTitle: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 26,
    color: COLORS.ivory,
    fontFamily: 'LeantheWall',  
    letterSpacing: 0.5,
    includeFontPadding: false,
    
  },
});

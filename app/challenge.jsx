import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { BackHandler, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

export default function ChallengeScreen() {
  const router = useRouter();
  
  // 뒤로가기 시 category-setup으로 이동
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Image
          style={styles.headerBackground}
          source={require('../assets/images/bar_green.png')}
        />
        
        {/* 뒤로가기 버튼 */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('../assets/images/icon_back_button.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        
        {/* 중앙 로고 */}
        <View style={styles.headerLogoContainer}>
          <Image
            source={require('../assets/images/icon_pleanet_logo.png')}
            style={styles.headerLogo}
          />
        </View>
        
        {/* 알림 버튼 */}
        <TouchableOpacity style={styles.notificationButton}>
          <Image
            source={require('../assets/images/icon_alarm.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Challenge</Text>
        <Text style={styles.subtitle}>챌린지 화면입니다</Text>
        <Text style={styles.description}>여기에 챌린지 관련 기능이 구현될 예정입니다.</Text>
      </View>
      <CustomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
  },
  header: {
    position: 'relative',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerLogoContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
  },
  headerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006256',
    marginBottom: 20,
    fontFamily: 'Pretendard Variable',
  },
  subtitle: {
    fontSize: 18,
    color: '#2D2D2D',
    marginBottom: 10,
    fontFamily: 'Pretendard Variable',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
  },
});

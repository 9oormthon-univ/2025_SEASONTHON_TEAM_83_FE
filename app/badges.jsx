import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { getUserProfile } from '../services/api';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function BadgesScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

  // 사용자 프로필 로드
  const loadUserProfile = async () => {
    try {
      console.log('=== 사용자 프로필 로드 시작 ===');
      const response = await getUserProfile();
      
      if (response.isSuccess) {
        console.log('✅ 사용자 프로필 로드 성공');
        console.log('사용자 정보:', response.result);
        setUserProfile(response.result);
      } else {
        console.error('❌ 사용자 프로필 로드 실패');
        console.error('에러:', response.message);
      }
    } catch (error) {
      console.error('❌ 사용자 프로필 로드 중 오류 발생');
      console.error('오류:', error);
    }
  };

  // 컴포넌트 마운트 시 사용자 프로필 로드
  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <View style={styles.container}>
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
            source={icon_pleanet_logo}
            style={styles.headerLogo}
          />
        </View>
        
        {/* 알림 버튼 */}
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <Image
            source={require('../assets/images/icon_alarm.png')}
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 보유 뱃지 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>보유 뱃지</Text>
        </View>

        {/* 사용자 정보 섹션 */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoLeft}>
            <Text style={styles.nicknameText}>{userProfile?.nickname || '닉네임'}</Text>
            <Image 
              source={require('../assets/images/icon_plant_level1.png')} 
              style={styles.profileIcon} 
            />
          </View>
          <TouchableOpacity style={styles.plantTreeButton}>
            <Text style={styles.plantTreeText}>나무심기</Text>
          </TouchableOpacity>
        </View>

        {/* 뱃지 섹션 */}
        <View style={styles.badgeSection}>
          
          
          <View style={styles.badgeCard}>
            {/* 활동 뱃지 */}
            <View style={styles.badgeCategory}>
              <Text style={styles.categoryTitle}>1. 활동 뱃지</Text>
              <View style={styles.activityBadgeContainer}>
                <Image
                  style={styles.activityBadgeBackground}
                  source={require('../assets/images/bar_green.png')}
                />
                <View style={styles.badgeRow}>
                  <View style={styles.badgeItemContainer}>
                    <View style={styles.badgeItem}>
                      <Image 
                        source={require('../assets/images/icon_walk.png')} 
                        style={styles.badgeIcon} 
                      />
                    </View>
                    <Text style={styles.badgeText}>
                      <Text style={styles.badgeName}>걷기 뱃지{'\n'}</Text>
                      <Text style={styles.badgeDate}>2025.05.05</Text>
                    </Text>
                  </View>
                  <View style={styles.badgeItemContainer}>
                    <View style={styles.badgeItem}>
                      <Image 
                        source={require('../assets/images/icon_tumblr.png')} 
                        style={styles.badgeIcon} 
                      />
                    </View>
                    <Text style={styles.badgeText}>
                      <Text style={styles.badgeName}>텀블러 뱃지{'\n'}</Text>
                      <Text style={styles.badgeDate}>2025.05.07</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 누적 포인트 뱃지 */}
            <View style={styles.badgeCategory}>
              <Text style={styles.categoryTitle}>2. 누적 포인트 뱃지</Text>
              <View style={styles.activityBadgeContainer}>
                <Image
                  style={styles.activityBadgeBackground}
                  source={require('../assets/images/bar_green.png')}
                />
                <View style={styles.badgeRow}>
                  <View style={styles.badgeItemContainer}>
                    <View style={styles.badgeItem}>
                      <Image 
                        source={require('../assets/images/icon_plant_level1.png')} 
                        style={styles.badgeIcon} 
                      />
                    </View>
                    <Text style={styles.badgeText}>
                      <Text style={styles.badgeName}>새싹 뱃지{'\n'}</Text>
                      <Text style={styles.badgeDate}>2025.04.05</Text>
                    </Text>
                  </View>
                  <View style={styles.badgeItemContainer}>
                    <View style={[styles.badgeItem, styles.badgeItemInactive]}>
                      <Image 
                        source={require('../assets/images/icon_plant_level2.png')} 
                        style={[styles.badgeIcon, styles.badgeIconInactive]} 
                      />
                    </View>
                    <Text style={styles.badgeTextInactive}>획득 전</Text>
                  </View>
                  <View style={styles.badgeItemContainer}>
                    <View style={[styles.badgeItem, styles.badgeItemInactive]}>
                      <Image 
                        source={require('../assets/images/icon_plant_level3.png')} 
                        style={[styles.badgeIcon, styles.badgeIconInactive]} 
                      />
                    </View>
                    <Text style={styles.badgeTextInactive}>획득 전</Text>
                  </View>
                  <View style={styles.badgeItemContainer}>
                    <View style={[styles.badgeItem, styles.badgeItemInactive]}>
                      <Image 
                        source={require('../assets/images/icon_plant_level4.png')} 
                        style={[styles.badgeIcon, styles.badgeIconInactive]} 
                      />
                    </View>
                    <Text style={styles.badgeTextInactive}>획득 전</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 이벤트 뱃지 */}
            <View style={styles.badgeCategory}>
              <Text style={styles.categoryTitle}>3. 이벤트 뱃지</Text>
              <View style={styles.activityBadgeContainer}>
                <Image
                  style={styles.activityBadgeBackground}
                  source={require('../assets/images/bar_green.png')}
                />
                <View style={styles.badgeRow}>
                  <View style={styles.badgeItemContainer}>
                    <View style={[styles.badgeItem, styles.badgeItemInactive]}>
                      <Image 
                        source={require('../assets/images/icon_event_cake.png')} 
                        style={[styles.badgeIcon, styles.badgeIconInactive]} 
                      />
                    </View>
                    <Text style={styles.badgeTextInactive}>획득 전</Text>
                  </View>
                  <View style={styles.badgeItemContainer}>
                    <View style={[styles.badgeItem, styles.badgeItemInactive]}>
                      <Image 
                        source={require('../assets/images/icon_event_tree.png')} 
                        style={[styles.badgeIcon, styles.badgeIconInactive]} 
                      />
                    </View>
                    <Text style={styles.badgeTextInactive}>획득 전</Text>
                  </View>
                  <View style={styles.badgeItemContainer}>
                    <View style={[styles.badgeItem, styles.badgeItemInactive]}>
                      <Image 
                        source={require('../assets/images/icon_event_earth.png')} 
                        style={[styles.badgeIcon, styles.badgeIconInactive]} 
                      />
                    </View>
                    <Text style={styles.badgeTextInactive}>획득 전</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8E1',
  },
  header: {
    position: 'relative',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    top: 70,
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
    top: 50,
  },
  headerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  notificationButton: {
    position: 'absolute',
    right: 20,
    top: 70,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
    height: 50,
    justifyContent: 'center',
    marginHorizontal: -20, // 양쪽으로 꽉 채우기
  },
  titlePattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameText: {
    width: 80,
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'left',
    marginRight: 15,
  },
  profileIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  plantTreeButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(16, 24, 40, 0.18)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  plantTreeText: {
    fontSize: 15,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: 'Pretendard Variable',
    color: '#F9F8E1',
    textAlign: 'left',
  },
  badgeSection: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 20,
    textAlign: 'center',
  },
  badgeCard: {
    padding: 10,
  },
  badgeCategory: {
    marginBottom: 15,
    marginHorizontal: 0,
  },
  activityBadgeContainer: {
    position: 'relative',
    marginBottom: 15,
    marginHorizontal: -40, // 양옆으로 꽉 채우기
  },
  activityBadgeBackground: {
    position: 'absolute',
    width: '100%',
    height: 40,
    resizeMode: 'stretch',
    top: 25,
    left: 0,
    right: 0,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 40,
  },
  badgeItemContainer: {
    alignItems: 'center',
    width: 90,
    marginRight: 0,
    marginBottom: 5,
    zIndex: 2,
  },
  badgeItem: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  badgeItemInactive: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  badgeIconInactive: {
    opacity: 0.9,
  },
  badgeText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  badgeName: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    fontWeight: '600',
  },
  badgeDate: {
    fontSize: 12,
    fontFamily: 'Pretendard Variable',
    color: '#6B6B6B',
  },
  badgeTextInactive: {
    fontSize: 14,
    fontFamily: 'Pretendard Variable',
    color: '#6B6B6B',
    textAlign: 'center',
  },
});

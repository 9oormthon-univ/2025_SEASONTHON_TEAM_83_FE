import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function AttendanceScreen() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(8);
  const [attendanceData, setAttendanceData] = useState({
    1: true, 2: true, 4: true, 5: true, 6: true, 9: true, 11: true, 12: true, 13: true, 14: true,
    16: true, 18: true, 19: true, 20: true, 21: true, 23: true, 24: true, 25: true, 26: true, 28: true, 30: true
  });

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDate = new Date().getDate();
  const currentYear = 2025;
  
  // 월별 데이터 생성 (6월부터 12월까지)
  const months = [6, 7, 8, 9, 10, 11, 12];
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handleAttendance = () => {
    // 출석 처리 로직
    const newAttendanceData = { ...attendanceData };
    newAttendanceData[currentDate] = true;
    setAttendanceData(newAttendanceData);
  };

  const renderCalendar = (month) => {
    const calendar = [];
    const totalDays = getDaysInMonth(currentYear, month);
    const firstDay = getFirstDayOfMonth(currentYear, month);
    
    // 요일 헤더
    const weekHeader = (
      <View key="header" style={styles.weekHeader}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>
    );
    calendar.push(weekHeader);

    // 첫 주 빈 칸들
    let week = [];
    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-start-${i}`} style={styles.dayContainer} />);
    }

    // 날짜들
    for (let day = 1; day <= totalDays; day++) {
      const isAttended = attendanceData[day];
      const isCurrentDay = day === currentDate && month === 8; // 8월 현재 날짜만 표시
      
      week.push(
        <View key={day} style={styles.dayContainer}>
          {isCurrentDay ? (
            <View style={styles.currentDay}>
              <Text style={styles.currentDayText}>{day}</Text>
              <Image 
                source={require('../assets/images/icon_earth.png')} 
                style={styles.earthIcon} 
              />
            </View>
          ) : (
            <View style={styles.dayItem}>
              <Text style={styles.dayText}>{day}</Text>
              {isAttended ? (
                <Image 
                  source={require('../assets/images/icon_earth.png')} 
                  style={styles.earthIcon} 
                />
              ) : (
                <View style={styles.emptyCircle} />
              )}
            </View>
          )}
        </View>
      );

      if (week.length === 7) {
        calendar.push(
          <View key={`week-${Math.floor(day / 7)}`} style={styles.weekRow}>
            {week}
          </View>
        );
        week = [];
      }
    }

    // 마지막 주 빈 칸으로 채우기
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(<View key={`empty-end-${week.length}`} style={styles.dayContainer} />);
      }
      calendar.push(
        <View key="week-last" style={styles.weekRow}>
          {week}
        </View>
      );
    }

    return calendar;
  };

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

      <View style={styles.content}>
        {/* 출석체크 제목 */}
        <View style={styles.titleContainer}>
          <Image
            style={styles.titlePattern}
            source={require('../assets/images/bar_green.png')}
          />
          <Text style={styles.titleText}>출석체크</Text>
        </View>

        {/* 월별 달력 스크롤 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.monthScrollView}
        >
          {months.map((month) => (
            <View key={month} style={styles.monthContainer}>
              {/* 월 표시 */}
              <View style={styles.monthSection}>
                <Text style={styles.monthText}>{month}월</Text>
              </View>

              {/* 달력 */}
              <View style={styles.calendarContainer}>
                <View style={styles.calendar}>
                  {renderCalendar(month)}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 출석 포인트 */}
        <View style={styles.pointsSection}>
          <Text style={styles.pointsText}>
            <Text style={styles.pointsLabel}>이번달 출석 포인트는 </Text>
            <Text style={styles.pointsValue}>30p</Text>
            <Text style={styles.pointsLabel}> 입니다</Text>
          </Text>
        </View>

        {/* 출석하기 버튼 */}
        <TouchableOpacity style={styles.attendanceButton} onPress={handleAttendance}>
          <Text style={styles.attendanceButtonText}>출석하기</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
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
    bottom: 0,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: '109LeantheWall',
    zIndex: 1,
  },
  monthScrollView: {
    marginBottom: 10,
  },
  monthContainer: {
    width: screenWidth - 40, // paddingHorizontal 20 제외
    alignItems: 'center',
  },
  monthSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    letterSpacing: -0.2,
    lineHeight: 28,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
    textAlign: 'center',
    height: 25,
  },
  calendarContainer: {
    marginBottom: 5,
  },
  calendar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    minWidth: 35,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dayText: {
    fontSize: 14,
    color: '#2D2D2D',
    marginBottom: 3,
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
  },
  currentDay: {
    backgroundColor: '#006256',
    borderRadius: 18,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDayText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Pretendard Variable',
  },
  earthIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  pointsSection: {
    alignItems: 'center',
    marginBottom: 10,
    top: -10,
  },
  pointsText: {
    width: 230,
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
  },
  pointsLabel: {
    color: '#2D2D2D',
  },
  pointsValue: {
    fontWeight: '700',
    color: '#0061E9',
  },
  attendanceButton: {
    width: '80%',
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 100,
    marginTop: 0,
    alignSelf: 'center',
  },
  attendanceButtonText: {
    fontSize: 16,
    letterSpacing: 0.3,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'Pretendard Variable',
    color: '#FFFFFF',
  },
});

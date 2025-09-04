import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import PopUpAlerts from '../components/PopUpAlerts';
import { useAuth } from '../contexts/AuthContext';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');
const { width: screenWidth } = Dimensions.get('window');

export default function AttendanceScreen() {
  const router = useRouter();
  const { getMonthlyAttendance, checkAttendance, getAttendanceSummary } = useAuth();
  
  const [currentMonth, setCurrentMonth] = useState(8);
  const [showPopup, setShowPopup] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAttendance, setIsCheckingAttendance] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDate = new Date().getDate();
  const currentYear = 2025;
  
  // 월별 데이터 생성 (6월부터 12월까지)
  const months = [6, 7, 8, 9, 10, 11, 12];

  // 월별 출석 데이터 로드
  const loadMonthlyAttendance = async (month) => {
    try {
      setIsLoading(true);
      
      // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
      // const response = await getMonthlyAttendance();
      
      // 임시: 서버 없이 성공 시뮬레이션
      console.log('임시 월별 출석 데이터 로드:', month);
      
      // 1초 지연으로 로딩 상태 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 데이터 생성 (현재 월만 출석 데이터 있음)
      if (month === 8) {
        const tempAttendanceData = {
          1: true, 2: true, 4: true, 5: true, 6: true, 9: true, 11: true, 12: true, 13: true, 14: true,
          16: true, 18: true, 19: true, 20: true, 21: true, 23: true, 24: true, 25: true, 26: true, 28: true, 30: true
        };
        setAttendanceData(tempAttendanceData);
      } else {
        setAttendanceData({});
      }
      
      // 성공 시뮬레이션
      console.log('월별 출석 데이터 로드 성공');
      
    } catch (error) {
      console.error('월별 출석 데이터 로드 실패:', error);
      Alert.alert('오류', '출석 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 출석 포인트 합계 로드
  const loadAttendanceSummary = async () => {
    try {
      // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
      // const response = await getAttendanceSummary();
      
      // 임시: 서버 없이 성공 시뮬레이션
      console.log('임시 출석 포인트 합계 로드');
      
      // 1초 지연으로 로딩 상태 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 임시 데이터
      setMonthlyPoints(30);
      
      // 성공 시뮬레이션
      console.log('출석 포인트 합계 로드 성공');
      
    } catch (error) {
      console.error('출석 포인트 합계 로드 실패:', error);
      Alert.alert('오류', '출석 포인트를 불러오는데 실패했습니다.');
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMonthlyAttendance(currentMonth);
    loadAttendanceSummary();
  }, [currentMonth]);
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handleAttendance = async () => {
    try {
      setIsCheckingAttendance(true);
      
      // TODO: 서버 연동 시 아래 주석 해제하고 임시 코드 제거
      // const response = await checkAttendance();
      
      // 임시: 서버 없이 성공 시뮬레이션
      console.log('임시 출석체크 처리');
      
      // 1초 지연으로 로딩 상태 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 성공 응답 시뮬레이션
      const mockResponse = {
        success: true,
        data: {
          message: "출석되었습니다",
          date: "2025-08-31",
          earnedPoint: 3
        }
      };
      
      if (mockResponse.success) {
        // 출석 데이터 업데이트
        const newAttendanceData = { ...attendanceData };
        newAttendanceData[currentDate] = true;
        setAttendanceData(newAttendanceData);
        
        // 포인트 업데이트
        setMonthlyPoints(prev => prev + mockResponse.data.earnedPoint);
        
        // 팝업 표시
        setShowPopup(true);
        
        console.log('출석체크 성공:', mockResponse.data);
      } else {
        Alert.alert('오류', mockResponse.error || '출석체크에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('출석체크 실패:', error);
      Alert.alert('오류', '출석체크 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingAttendance(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
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
            <Text style={styles.pointsValue}>{monthlyPoints}p</Text>
            <Text style={styles.pointsLabel}> 입니다</Text>
          </Text>
        </View>

        {/* 출석하기 버튼 */}
        <TouchableOpacity 
          style={[
            styles.attendanceButton, 
            (isCheckingAttendance || attendanceData[currentDate]) && styles.disabledButton
          ]} 
          onPress={handleAttendance}
          disabled={isCheckingAttendance || attendanceData[currentDate]}
        >
          {isCheckingAttendance ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.attendanceButtonText}>
              {attendanceData[currentDate] ? '출석완료' : '출석하기'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* 출석 완료 팝업 */}
      <PopUpAlerts 
        visible={showPopup} 
        onClose={handleClosePopup} 
      />
      
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
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.6,
  },
});

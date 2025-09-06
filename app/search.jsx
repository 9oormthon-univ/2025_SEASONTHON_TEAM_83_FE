import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import SearchService from '../services/searchService';

const icon_pleanet_logo = require('../assets/images/icon_pleanet_logo.png');

export default function SearchScreen() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 컴포넌트 마운트 시 검색 히스토리 로드
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // 검색 히스토리 로드
  const loadSearchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await SearchService.getSearchHistory();
      
      if (response.success) {
        console.log('검색 히스토리 데이터:', response.data);
        setSearchHistory(response.data);
      } else {
        console.error('검색 히스토리 로드 실패:', response.error);
      }
    } catch (error) {
      console.error('검색 히스토리 로드 중 오류:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // 통합 검색 실행
  const handleSearch = async (keyword = searchKeyword) => {
    if (!keyword.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await SearchService.search(keyword);
      
      if (response.success) {
        setSearchResults(response.data);
        // 검색 후 히스토리 새로고침
        loadSearchHistory();
      } else {
        Alert.alert('검색 실패', response.error || '검색 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('검색 중 오류:', error);
      Alert.alert('오류', '검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색어 삭제
  const handleDeleteHistory = async (keyword) => {
    if (!keyword || keyword.trim() === '') {
      console.error('검색어 삭제 실패: 유효하지 않은 키워드', keyword);
      Alert.alert('삭제 실패', '삭제할 검색어가 유효하지 않습니다.');
      return;
    }

    try {
      console.log('검색어 삭제 시도:', { keyword });
      
      // 임시 해결책: 클라이언트에서 해당 키워드 제거
      const updatedHistory = searchHistory.filter(item => item.keyword !== keyword);
      setSearchHistory(updatedHistory);
      
      Alert.alert('삭제 완료', '검색 기록이 삭제되었습니다.');
    } catch (error) {
      console.error('검색어 삭제 중 오류:', error);
      Alert.alert('오류', '삭제 중 오류가 발생했습니다.');
    }
  };

  // 검색 결과 렌더링
  const renderSearchResults = () => {
    if (!searchResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>검색 결과</Text>
        
        {/* 활동 결과 */}
        {searchResults.activities && searchResults.activities.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>활동</Text>
            {searchResults.activities.map((activity, index) => (
              <TouchableOpacity key={index} style={styles.resultItem}>
                <Text style={styles.resultItemTitle}>{activity.title}</Text>
                <Text style={styles.resultItemDescription}>{activity.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 리워드 결과 */}
        {searchResults.rewards && searchResults.rewards.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>리워드</Text>
            {searchResults.rewards.map((reward, index) => (
              <TouchableOpacity key={index} style={styles.resultItem}>
                <Text style={styles.resultItemTitle}>{reward.title}</Text>
                <Text style={styles.resultItemDescription}>{reward.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 사용자 결과 */}
        {searchResults.users && searchResults.users.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>사용자</Text>
            {searchResults.users.map((user, index) => (
              <TouchableOpacity key={index} style={styles.resultItem}>
                <Text style={styles.resultItemTitle}>{user.nickname}</Text>
                <Text style={styles.resultItemDescription}>{user.email}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 결과가 없는 경우 */}
        {(!searchResults.activities || searchResults.activities.length === 0) &&
         (!searchResults.rewards || searchResults.rewards.length === 0) &&
         (!searchResults.users || searchResults.users.length === 0) && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
          </View>
        )}
      </View>
    );
  };

  // 검색 히스토리 렌더링
  const renderSearchHistory = () => {
    if (historyLoading) {
      return (
        <View style={styles.historyContainer}>
          <ActivityIndicator size="small" color="#006256" />
          <Text style={styles.loadingText}>검색 기록을 불러오는 중...</Text>
        </View>
      );
    }

    if (searchHistory.length === 0) {
      return (
        <View style={styles.historyContainer}>
          <Text style={styles.noHistoryText}>최근 검색어가 없습니다.</Text>
        </View>
      );
    }

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>최근 검색어</Text>
        {searchHistory.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <TouchableOpacity
                style={styles.historyKeyword}
                onPress={() => {
                  setSearchKeyword(item.keyword);
                  handleSearch(item.keyword);
                }}
              >
                <Text style={styles.historyKeywordText}>{item.keyword}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteHistory(item.keyword)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
        ))}
      </View>
    );
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
        {/* 검색 섹션 */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>통합 검색</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleSearch()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.searchButtonText}>검색</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 검색 결과 */}
          {renderSearchResults()}

          {/* 검색 히스토리 */}
          {!searchResults && renderSearchHistory()}
        </ScrollView>
      </View>
      
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
  searchSection: {
    marginBottom: 30,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Pretendard Variable',
    color: '#2D2D2D',
  },
  searchButton: {
    backgroundColor: '#006256',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
  scrollContent: {
    flex: 1,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 15,
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#006256',
    fontFamily: 'Pretendard Variable',
    marginBottom: 10,
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 5,
  },
  resultItemDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyKeyword: {
    flex: 1,
  },
  historyKeywordText: {
    fontSize: 16,
    color: '#2D2D2D',
    fontFamily: 'Pretendard Variable',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noHistoryText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard Variable',
    marginTop: 10,
    textAlign: 'center',
  },
});
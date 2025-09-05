import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RankingService from '../services/rankingService';

const RankingList = () => {
  const router = useRouter();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 랭킹 데이터 로드
  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);
      const response = await RankingService.getRankings(0, 6); // 상위 6명만
      
      if (response.success) {
        setRankings(response.data.content || []);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error('랭킹 로드 실패:', error);
      setError('랭킹을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/ranking')}>
          <Text style={styles.sectionTitle}>현재 순위</Text>
        </TouchableOpacity>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#006256" />
          <Text style={styles.loadingText}>랭킹 로딩 중...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/ranking')}>
          <Text style={styles.sectionTitle}>현재 순위</Text>
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>랭킹을 불러올 수 없습니다</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/ranking')}>
        <Text style={styles.sectionTitle}>현재 순위</Text>
      </TouchableOpacity>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {rankings.map((user, index) => (
          <View key={user.memberId || user.id || index} style={styles.rankingItem}>
            <View style={styles.rankContainer}>
              <Text style={[
                styles.rankText,
                index < 3 ? styles.top3Rank : styles.otherRank
              ]}>
                {index + 1}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.profileContainer}>
                <Image 
                  source={require('../assets/images/icon_default_profile.png')} 
                  style={styles.profileIcon} 
                />
              </View>
              <Text style={[
                styles.username,
                index < 3 ? styles.top3Text : styles.otherText
              ]}>
                {user.nickname || user.username || '사용자'}
              </Text>
            </View>
            
            <Text style={[
              styles.pointsText,
              index < 3 ? styles.top3Text : styles.otherText
            ]}>
              | 누적 포인트 {user.totalPoint || user.point || 0}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Pretendard Variable',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Pretendard Variable',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D2D2D',
    marginBottom: 20,
    fontFamily: 'Pretendard Variable',
  },
  scrollView: {
    flex: 1,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Pretendard Variable',
  },
  top3Rank: {
    color: '#006256',
  },
  otherRank: {
    color: '#999999',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  profileContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#FFFFFF', // 아이콘을 흰색으로 변경
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Pretendard Variable',
  },
  top3Text: {
    color: '#0F0F0F',
  },
  otherText: {
    color: '#999999',
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Pretendard Variable',
    marginLeft: 'auto',
  },
});

export default RankingList;

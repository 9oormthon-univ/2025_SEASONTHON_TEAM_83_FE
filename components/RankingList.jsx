import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const RankingList = () => {
  const rankings = [
    {
      id: 1,
      rank: 1,
      username: 'User',
      points: '2,450',
      isTop3: true
    },
    {
      id: 2,
      rank: 2,
      username: 'User',
      points: '2,120',
      isTop3: true
    },
    {
      id: 3,
      rank: 3,
      username: 'User',
      points: '1,890',
      isTop3: true
    },
    {
      id: 4,
      rank: 4,
      username: 'User',
      points: '1,650',
      isTop3: false
    },
    {
      id: 5,
      rank: 5,
      username: 'User',
      points: '1,420',
      isTop3: false
    },
    {
      id: 6,
      rank: 6,
      username: 'User',
      points: '1,280',
      isTop3: false
    },
    {
      id: 7,
      rank: 7,
      username: 'User',
      points: '1,150',
      isTop3: false
    },
    {
      id: 8,
      rank: 8,
      username: 'User',
      points: '1,020',
      isTop3: false
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>현재 순위</Text>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {rankings.map((user, index) => (
          <View key={user.id} style={styles.rankingItem}>
            <View style={styles.rankContainer}>
              <Text style={[
                styles.rankText,
                user.isTop3 ? styles.top3Rank : styles.otherRank
              ]}>
                {user.rank}
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
                user.isTop3 ? styles.top3Text : styles.otherText
              ]}>
                {user.username}
              </Text>
            </View>
            
            <Text style={[
              styles.pointsText,
              user.isTop3 ? styles.top3Text : styles.otherText
            ]}>
              | 누적 포인트 {user.points}
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
    paddingHorizontal: 20,
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

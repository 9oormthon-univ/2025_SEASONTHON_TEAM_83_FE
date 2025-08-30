import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuickActions = () => {
  const router = useRouter();
  
  const actions = [
    {
      id: 1,
      icon: require('../assets/images/icon_calendar.png'),
      label: '출석체크',
      value: '11',
      onPress: () => router.push('/attendance')
    },
    {
      id: 2,
      icon: require('../assets/images/icon_badge.png'),
      label: '보유 뱃지',
      value: ''
    },
    {
      id: 3,
      icon: require('../assets/images/icon_auth.png'),
      label: '빠른 인증',
      value: ''
    },
    {
      id: 4,
      icon: require('../assets/images/icon_point.png'),
      label: '포인트',
      value: ''
    },
    {
      id: 5,
      icon: require('../assets/images/icon_reward.png'),
      label: '리워드 전환',
      value: ''
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            onPress={action.onPress || (() => {})}
          >
            <View style={styles.iconContainer}>
              <Image source={action.icon} style={styles.icon} />
              {action.value && (
                <Text style={styles.valueText}>{action.value}</Text>
              )}
            </View>
            <Text style={styles.labelText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  valueText: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#006256',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  labelText: {
    fontSize: 12,
    color: '#525252',
    textAlign: 'center',
    fontFamily: 'Pretendard Variable',
    lineHeight: 16,
  },
});

export default QuickActions;

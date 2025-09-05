// app/user-profile-test.jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import UserProfileTest from '../components/UserProfileTest';

export default function UserProfileTestScreen() {
  return (
    <View style={styles.container}>
      <UserProfileTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});


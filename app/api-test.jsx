// app/api-test.jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ApiTestComponent from '../components/ApiTestComponent';

export default function ApiTestScreen() {
  return (
    <View style={styles.container}>
      <ApiTestComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Challenge',
      route: '/challenge',
    },
    {
      name: 'Home',
      route: '/home',
    },
    {
      name: 'My page',
      route: '/my-page',
    }
  ];

  const handleTabPress = (route) => {
    router.replace(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = pathname === tab.route;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route)}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIcon]}>
              </View>
              <Text style={[styles.tabText, isActive && styles.activeText]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(249, 248, 225, 0.4)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    alignItems: 'center',
    marginHorizontal: 25,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2D2D2D',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIcon: {
    backgroundColor: '#006256',
    borderColor: '#006256',
  },

  tabText: {
    fontSize: 12,
    color: '#2D2D2D',
    fontWeight: '500',
  },
  activeText: {
    color: '#006256',
    fontWeight: '600',
  },
});

export default CustomTabBar;

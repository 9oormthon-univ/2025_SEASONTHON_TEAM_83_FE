// components/ProfileCard.jsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PROFILE_COLORS, PROFILE_SHADOW } from '../constants/ProfileConstants';

const ProfileCard = ({ 
  avatar, 
  name, 
  email, 
  badge, 
  onEditPress, 
  onPhotoEditPress,
  showEditButton = true,
  showPhotoEditButton = false 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.profileRow}>
        <View style={styles.profileLeft}>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.email} numberOfLines={1}>{email}</Text>
          </View>
        </View>
        <View style={styles.profileRight}>
          {badge && (
            <Image source={badge} style={styles.badge} resizeMode="contain" />
          )}
          {showEditButton && (
            <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
              <Text style={styles.editBtnText}>프로필 수정</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {showPhotoEditButton && (
        <TouchableOpacity style={styles.photoBtn} onPress={onPhotoEditPress}>
          <Text style={styles.photoBtnText}>프로필 이미지 수정</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PROFILE_COLORS.card,
    borderRadius: 12,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    marginTop: 5,
    ...PROFILE_SHADOW,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLeft: {
    flex: 1,
    flexDirection: 'row',
    marginTop: -50,
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 12,
    
  },
  profileRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E4F2E4',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: PROFILE_COLORS.ink,
  },
  email: {
    fontSize: 12,
    color: PROFILE_COLORS.sub,
    marginTop: 2,
  },
  badge: {
    width: 64,
    height: 80,
  },
  editBtn: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F1F6F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4E2D8',
  },
  editBtnText: {
    fontSize: 11,
    color: PROFILE_COLORS.ink,
    fontWeight: '700',
  },
  photoBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: '#F1F6F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D4E2D8',
  },
  photoBtnText: {
    fontSize: 12,
    color: PROFILE_COLORS.ink,
    fontWeight: '700',
  },
});

export default ProfileCard;

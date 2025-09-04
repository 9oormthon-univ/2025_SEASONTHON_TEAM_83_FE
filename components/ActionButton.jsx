// components/ActionButton.jsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PROFILE_COLORS, PROFILE_SHADOW } from '../constants/ProfileConstants';

const ActionButton = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.primaryButton, style];
      case 'secondary':
        return [styles.secondaryButton, style];
      case 'kakao':
        return [styles.kakaoButton, style];
      case 'cta':
        return [styles.ctaButton, style];
      default:
        return [styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.primaryText, textStyle];
      case 'secondary':
        return [styles.secondaryText, textStyle];
      case 'kakao':
        return [styles.kakaoText, textStyle];
      case 'cta':
        return [styles.ctaText, textStyle];
      default:
        return [styles.primaryText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: PROFILE_COLORS.green,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    ...PROFILE_SHADOW,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: '#F1F6F1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4E2D8',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  secondaryText: {
    color: PROFILE_COLORS.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  kakaoButton: {
    backgroundColor: PROFILE_COLORS.kakao,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  kakaoText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#191600',
  },
  ctaButton: {
    backgroundColor: PROFILE_COLORS.green,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    width: 160,
    alignSelf: 'center',
    ...PROFILE_SHADOW,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ActionButton;

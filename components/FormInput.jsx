// components/FormInput.jsx
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PROFILE_COLORS } from '../constants/ProfileConstants';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder = '내용 입력',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  onClear,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={PROFILE_COLORS.sub}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        {!!value && onClear && (
          <Pressable style={styles.clearBtn} hitSlop={10} onPress={onClear}>
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: PROFILE_COLORS.ink,
    marginBottom: 8,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    backgroundColor: PROFILE_COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: PROFILE_COLORS.ink,
    borderWidth: 1,
    borderColor: PROFILE_COLORS.line,
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 18,
    color: PROFILE_COLORS.sub,
    lineHeight: 20,
  },
});

export default FormInput;

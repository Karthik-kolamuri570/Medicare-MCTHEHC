import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { COLORS } from '../styles/theme';

export default function GlowingInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
  error,
  autoCapitalize = 'none',
  autoCorrect = false,
  autoComplete = 'off',
  returnKeyType = 'done',
  onSubmitEditing,
  editable = true,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        {icon && (
          <View style={styles.iconContainer} pointerEvents="none">
            {icon}
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.textInput}
          underlineColorAndroid="transparent"
          textAlignVertical="center"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 54,
    // CRITICAL: Do NOT use elevation here — Android elevation on focus
    // creates a new stacking context that blocks touches to sibling views.
  },
  inputFocused: {
    borderColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    // NO elevation/shadow — was the root cause of blocking all other inputs on Android
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#f1f5f9',
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // pointerEvents="none" set as prop above so icon never intercepts taps
  },
  textInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    // Use a fixed pixel height matching the wrapper — NOT '100%' (unreliable on Android)
    height: 50,
    paddingVertical: 0,
    margin: 0,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

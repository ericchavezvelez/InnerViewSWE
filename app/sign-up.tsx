import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputBackground = useThemeColor({ light: '#f2f2f2', dark: '#2c2c2e' }, 'background');
  const inputColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#8e8e93', dark: '#636366' }, 'text');

  async function handleSignUp() {
    setError('');
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}>
        <View style={styles.header}>
          <ThemedText type="title">Create account</ThemedText>
          <ThemedText style={styles.subtitle}>Sign up to get started</ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, color: inputColor }]}
            placeholder="Username"
            placeholderTextColor={placeholderColor}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, color: inputColor }]}
            placeholder="Email"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, color: inputColor }]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { backgroundColor: inputBackground, color: inputColor }]}
            placeholder="Confirm Password"
            placeholderTextColor={placeholderColor}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Create Account</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText>Already have an account? </ThemedText>
          <Link href="/sign-in">
            <ThemedText type="link">Sign In</ThemedText>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },
  header: {
    gap: 8,
  },
  subtitle: {
    opacity: 0.6,
  },
  form: {
    gap: 12,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: '#ff3b30',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

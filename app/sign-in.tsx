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

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const inputBackground = useThemeColor({ light: '#f2f2f2', dark: '#2c2c2e' }, 'background');
  const inputColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#8e8e93', dark: '#636366' }, 'text');

  async function handleSignIn() {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
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
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <ThemedText style={styles.logoText}>IV</ThemedText>
          </View>
          <ThemedText style={styles.appName}>InnerViewSWE</ThemedText>
          <ThemedText style={styles.appTagline}>SWE Interview Prep</ThemedText>
        </View>

        <View style={styles.header}>
          <ThemedText type="title">Welcome back</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to continue practicing</ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackground, color: inputColor },
              focusedField === 'email' && styles.inputFocused,
            ]}
            placeholder="Email"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBackground, color: inputColor },
              focusedField === 'password' && styles.inputFocused,
            ]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText>Don't have an account? </ThemedText>
          <Link href="/sign-up">
            <ThemedText type="link">Sign Up</ThemedText>
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
  brand: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
  },
  appTagline: {
    fontSize: 13,
    opacity: 0.4,
    fontWeight: '500',
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
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#0a7ea4',
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
    alignItems: 'center',
  },
});

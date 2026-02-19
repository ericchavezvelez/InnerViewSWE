import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Profile</ThemedText>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  signOutText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 16,
  },
});

import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const avatarBackground = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'background');

  // Counts consecutive days with at least one answer, ending today or yesterday
  function computeStreak(createdAts: string[]): number {
    if (createdAts.length === 0) return 0;
    const uniqueDays = new Set(
      createdAts.map((ts) => new Date(ts).toLocaleDateString('en-CA'))
    );
    const checkDate = new Date();
    if (!uniqueDays.has(checkDate.toLocaleDateString('en-CA'))) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    let count = 0;
    while (uniqueDays.has(checkDate.toLocaleDateString('en-CA'))) {
      count += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return count;
  }

  // Fetches user profile and stats every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) return;
        setUsername(session.user.user_metadata?.username ?? '');
        setEmail(session.user.email ?? '');

        supabase
          .from('user_answers')
          .select('is_correct, created_at')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (!data) return;
            setTotalAnswered(data.length);
            setStreak(computeStreak(data.map((r) => r.created_at)));
          });
      });
    }, [])
  );

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  }

  // Returns the first letter of the username, uppercased, for the avatar circle
  function getInitial(): string {
    return username ? username[0].toUpperCase() : '?';
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Profile</ThemedText>

        {/* Avatar + user info */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: avatarBackground }]}>
            <ThemedText style={styles.avatarText}>{getInitial()}</ThemedText>
          </View>
          <ThemedText style={styles.username}>{username}</ThemedText>
          <ThemedText style={styles.email}>{email}</ThemedText>
        </View>

        {/* Stats row */}
        <View style={[styles.statsRow, { backgroundColor: cardBackground }]}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{streak}</ThemedText>
            <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{totalAnswered}</ThemedText>
            <ThemedText style={styles.statLabel}>Answered</ThemedText>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    gap: 32,
  },
  profileSection: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 40,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    opacity: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#8e8e9333',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.5,
    fontWeight: '500',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 16,
  },
});

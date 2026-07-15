import { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';
import { computeStreak } from '@/src/lib/homeUtils';

const COMPLETED_KEY = '@innerview:completed_lessons';

type RecentAnswer = { topic: string; is_correct: boolean; created_at: string };

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const rowBackground = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const avatarBackground = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'background');

  const loadProfile = useCallback(async () => {
    const raw = await AsyncStorage.getItem(COMPLETED_KEY);
    setLessonsCompleted(raw ? JSON.parse(raw).length : 0);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    setUsername(session.user.user_metadata?.username ?? '');
    setEmail(session.user.email ?? '');

    const [{ data: responses }, { data: recent }] = await Promise.all([
      supabase.from('user_responses').select('is_correct, created_at').eq('user_id', session.user.id),
      supabase
        .from('user_responses')
        .select('is_correct, created_at, topics(name)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (responses) {
      setTotalAnswered(responses.length);
      setStreak(computeStreak(responses.map((r) => r.created_at)));
    }

    if (recent) {
      setRecentActivity(
        recent.map((r: any) => ({
          topic: r.topics?.name ?? '—',
          is_correct: r.is_correct,
          created_at: r.created_at,
        }))
      );
    }
  }, []);

  // Refetches profile and stats every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadProfile().finally(() => setLoading(false));
    }, [loadProfile])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfile().finally(() => setRefreshing(false));
  }, [loadProfile]);

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/sign-in');
        },
      },
    ]);
  }

  // Returns the first letter of the username, uppercased, for the avatar circle
  function getInitial(): string {
    return username ? username[0].toUpperCase() : '?';
  }

  // Returns a human-readable relative time string (e.g. "2h ago", "Yesterday")
  function formatRelative(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return `${Math.floor(hours / 24)}d ago`;
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator style={styles.spinner} size="large" color="#0a7ea4" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0a7ea4" />
        }>
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
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{lessonsCompleted}</ThemedText>
            <ThemedText style={styles.statLabel}>Lessons</ThemedText>
          </View>
        </View>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <View style={styles.activityList}>
              {recentActivity.map((a, i) => (
                <View key={i} style={[styles.activityRow, { backgroundColor: rowBackground }]}>
                  <View style={[styles.activityDot, { backgroundColor: a.is_correct ? '#4caf50' : '#f44336' }]} />
                  <ThemedText style={styles.activityTopic}>{a.topic}</ThemedText>
                  <ThemedText style={styles.activityTime}>{formatRelative(a.created_at)}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

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
  spinner: {
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
  section: {
    gap: 12,
  },
  activityList: {
    gap: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityTopic: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 13,
    opacity: 0.4,
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

import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

const PROGRESS_CIRCLES = ['Algorithms', 'Data Structures', 'Lessons', 'Big O'];

export default function HomeScreen() {
  const [username, setUsername] = useState('');

  const circleBorder = useThemeColor({ light: '#d1d1d6', dark: '#3a3a3c' }, 'background');
  const streakBackground = useThemeColor({ light: '#fff3e0', dark: '#2c1a00' }, 'background');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsername(session?.user?.user_metadata?.username ?? '');
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Welcome back, {username}!</ThemedText>
          <View style={[styles.streakBadge, { backgroundColor: streakBackground }]}>
            <ThemedText style={styles.streakText}>🔥 7 Day Streak</ThemedText>
          </View>
        </View>

        <View style={styles.grid}>
          {PROGRESS_CIRCLES.map((label) => (
            <View key={label} style={styles.circleItem}>
              <View style={[styles.circle, { borderColor: circleBorder }]} />
              <ThemedText style={styles.circleLabel}>{label}</ThemedText>
            </View>
          ))}
        </View>
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
    gap: 40,
  },
  header: {
    gap: 12,
  },
  streakBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  circleItem: {
    alignItems: 'center',
    gap: 10,
    width: '42%',
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
  },
  circleLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

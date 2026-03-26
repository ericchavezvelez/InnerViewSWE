import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { supabase } from '@/lib/supabase';

type SWELevel = 'SWE1' | 'SWE2' | 'SWE3';

const LEVELS: { id: SWELevel; title: string; subtitle: string; description: string; color: string; bg: string }[] = [
  {
    id: 'SWE1',
    title: 'SWE1',
    subtitle: 'Junior Engineer',
    description: 'Mastering fundamentals and landing your first role.',
    color: '#4caf50',
    bg: '#e8f5e9',
  },
  {
    id: 'SWE2',
    title: 'SWE2',
    subtitle: 'Mid-level Engineer',
    description: 'Strengthening core skills and targeting L4–L5 positions.',
    color: '#ff9500',
    bg: '#fff3e0',
  },
  {
    id: 'SWE3',
    title: 'SWE3',
    subtitle: 'Senior Engineer',
    description: 'Advanced topics and complex system design for L5+ and FAANG.',
    color: '#f44336',
    bg: '#fdecea',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLevel, setSelectedLevel] = useState<SWELevel | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const cardBackground = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');

  // Fetches username from session on mount for the welcome message
  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsername(session?.user?.user_metadata?.username ?? '');
    });
  });

  // Saves selected level + completion flag to user metadata and navigates to tabs
  async function handleFinish() {
    if (!selectedLevel) return;
    setLoading(true);
    await supabase.auth.updateUser({
      data: { swe_level: selectedLevel, onboarding_complete: true },
    });
    setLoading(false);
    router.replace('/(tabs)/home');
  }

  if (step === 1) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.stepIndicator}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>

          <View style={styles.header}>
            <ThemedText type="title">
              {username ? `Hey, ${username}!` : 'Welcome!'}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              InnerViewSWE helps you crush your next technical interview with bite-sized daily practice.
            </ThemedText>
          </View>

          <View style={styles.featureList}>
            {[
              { icon: '🎯', text: 'Multiple choice questions across key CS topics' },
              { icon: '📈', text: 'Track accuracy by topic to find your weak spots' },
              { icon: '🔥', text: 'Build a daily streak to stay consistent' },
              { icon: '✦', text: 'Get explanations for every answer' },
            ].map((f, i) => (
              <View key={i} style={[styles.featureRow, { backgroundColor: cardBackground }]}>
                <ThemedText style={styles.featureIcon}>{f.icon}</ThemedText>
                <ThemedText style={styles.featureText}>{f.text}</ThemedText>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <ThemedText style={styles.buttonText}>Next →</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.stepIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <View style={styles.header}>
          <ThemedText type="title">What level are you targeting?</ThemedText>
          <ThemedText style={styles.subtitle}>
            This sets your default difficulty. You can always change it in the Play tab.
          </ThemedText>
        </View>

        <View style={styles.levelList}>
          {LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  { backgroundColor: cardBackground },
                  isSelected && { borderColor: level.color, borderWidth: 2 },
                ]}
                onPress={() => setSelectedLevel(level.id)}>
                <View style={[styles.levelBadge, { backgroundColor: level.bg }]}>
                  <ThemedText style={[styles.levelBadgeText, { color: level.color }]}>
                    {level.title}
                  </ThemedText>
                </View>
                <View style={styles.levelInfo}>
                  <ThemedText style={styles.levelTitle}>{level.subtitle}</ThemedText>
                  <ThemedText style={styles.levelDescription}>{level.description}</ThemedText>
                </View>
                {isSelected && (
                  <ThemedText style={[styles.levelCheck, { color: level.color }]}>✓</ThemedText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.button, !selectedLevel && styles.buttonDisabled]}
          onPress={handleFinish}
          disabled={!selectedLevel || loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Let's Go</ThemedText>
          )}
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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    gap: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8e8e9344',
  },
  dotActive: {
    backgroundColor: '#0a7ea4',
  },
  header: {
    gap: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.6,
  },
  featureList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  levelList: {
    gap: 12,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  levelInfo: {
    flex: 1,
    gap: 2,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  levelDescription: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.5,
  },
  levelCheck: {
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#0a7ea4',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

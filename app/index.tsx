import { useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function Index() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/sign-in');
      } else if (!session.user.user_metadata?.onboarding_complete) {
        router.replace('/onboarding' as any);
      } else {
        router.replace('/(tabs)/home');
      }
    });
  }, []);

  return null;
}

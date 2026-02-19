import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: check auth state here and redirect to /(tabs) if already signed in
  return <Redirect href="/sign-in" />;
}

import { Stack, router, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '../components/SafeScreen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from '../store/store';
import { useAuth } from '../store/hooks/hooks';
import { useEffect } from 'react';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthWrapper />
    </Provider>
  );
}

function AuthWrapper() {
  const { user, token } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const isAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;

    if (!isSignedIn && !isAuthScreen) router.replace('/(auth)')
    else if (isSignedIn && isAuthScreen) router.replace('/(tabs)');
  }, [user, token]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='(auth)' />
        </Stack>
      </SafeScreen>
      <StatusBar style='dark' />
    </SafeAreaProvider>
  );
}

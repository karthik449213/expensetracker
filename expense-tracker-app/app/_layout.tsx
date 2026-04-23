import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import {SplashScreen} from "@/screens/SplashScreen";
import { ExpenseProvider } from '@/context/ExpenseContext';



export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// 1. Rename this to "RootLayoutNav". This is the component that USES the auth data.
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isSignedIn, isLoading } = useAuth(); // This now works!

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Your logic remains exactly the same */}
        {isLoading ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : isSignedIn ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// 2. This is your main entry point. It wraps everything in the AuthProvider.
export default function RootLayout() {
  return (
    
    <AuthProvider>
      <ExpenseProvider>
        <RootLayoutNav />
      </ExpenseProvider>
    </AuthProvider>
   

  );
}

/**
 * Main App Component
 * Entry point with all context providers and theme setup
 */

import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import {ErrorBoundary} from './components/ErrorBoundary'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Hide splash screen after app is loaded
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    // Give the app a moment to render before hiding splash
    const timer = setTimeout(hideSplash, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
              <AuthProvider>
        <ExpenseProvider>
          <></>
        </ExpenseProvider>
      </AuthProvider>
      </ErrorBoundary>
     
    </GestureHandlerRootView>
  );
}

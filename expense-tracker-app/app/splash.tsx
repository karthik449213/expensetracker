/**this file is for the splash screen componesnt */

import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export function SplashScreenComponent() {
  useEffect(() => {
    // Keep the splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();
    // Simulate a loading process (e.g., fetching data, initializing app)
    const timer = setTimeout(() => {
        SplashScreen.hideAsync();
    }, 2000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}

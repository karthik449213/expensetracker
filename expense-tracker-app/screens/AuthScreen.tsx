/**
 * Authentication Screen
 * Login/Register with terminal-style inputs and validation
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { HackerTheme } from '../theme/colors';
import { TerminalInput } from '../components/TerminalInput';
import { GlowButton } from '../components/GlowButton';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isStrongPassword } from '../utils/formatting';

interface AuthScreenProps {
  navigation: any;
}

type AuthMode = 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const { login, register, isLoading, error, clearError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const switchOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;

  // Animate form switch
  useEffect(() => {
    Animated.sequence([
      Animated.timing(formOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mode, formOpacity]);

  const validateLogin = () => {
    const errors: { [key: string]: string } = {};

    if (!email) errors.email = 'Email is required';
    else if (!isValidEmail(email)) errors.email = 'Invalid email format';

    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password too short';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors: { [key: string]: string } = {};

    if (!username) errors.username = 'Username is required';
    else if (username.length < 3) errors.username = 'Username too short';

    if (!email) errors.email = 'Email is required';
    else if (!isValidEmail(email)) errors.email = 'Invalid email format';

    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';

    if (!password) errors.password = 'Password is required';
    else if (!isStrongPassword(password))
      errors.password = 'Min 8 chars, uppercase, lowercase, number';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validateLogin()) return;

    try {
      await login(email, password);
      navigation.replace('Dashboard');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please try again');
    }
  };

  const handleRegister = async () => {
    clearError();
    if (!validateRegister()) return;

    try {
      await register(email, password, username, firstName, lastName);
      navigation.replace('Dashboard');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'login' ? 'TERMINAL ACCESS' : 'CREATE ACCOUNT'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Enter your credentials'
                : 'Register for expense tracking'}
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
              },
            ]}
          >
            {mode === 'register' && (
              <>
                <TerminalInput
                  label="Username"
                  placeholder="your_username"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (validationErrors.username)
                      setValidationErrors((prev) => ({
                        ...prev,
                        username: '',
                      }));
                  }}
                  error={validationErrors.username}
                  icon="👤"
                />
                <TerminalInput
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (validationErrors.firstName)
                      setValidationErrors((prev) => ({
                        ...prev,
                        firstName: '',
                      }));
                  }}
                  error={validationErrors.firstName}
                  icon="→"
                />
                <TerminalInput
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (validationErrors.lastName)
                      setValidationErrors((prev) => ({
                        ...prev,
                        lastName: '',
                      }));
                  }}
                  error={validationErrors.lastName}
                  icon="→"
                />
              </>
            )}

            <TerminalInput
              label="Email"
              placeholder="user@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (validationErrors.email)
                  setValidationErrors((prev) => ({
                    ...prev,
                    email: '',
                  }));
              }}
              error={validationErrors.email}
              keyboardType="email-address"
              icon="✉"
            />

            <TerminalInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (validationErrors.password)
                  setValidationErrors((prev) => ({
                    ...prev,
                    password: '',
                  }));
              }}
              error={validationErrors.password}
              secureTextEntry
              icon="🔒"
            />
          </Animated.View>

          {/* Loading State */}
          {isLoading && <Loader message="Processing..." size="sm" />}

          {/* Action Button */}
          <GlowButton
            title={mode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
            onPress={mode === 'login' ? handleLogin : handleRegister}
            isLoading={isLoading}
            disabled={isLoading}
            fullWidth
            size="lg"
          />

          {/* Toggle Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <GlowButton
              title={mode === 'login' ? 'REGISTER' : 'LOGIN'}
              onPress={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setValidationErrors({});
                clearError();
              }}
              variant="secondary"
            />
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>
            🔐 Your data is encrypted and secure
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HackerTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: HackerTheme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: HackerTheme.spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: HackerTheme.fontSize['3xl'],
    fontWeight: 'bold',
    color: HackerTheme.colors.primary,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: HackerTheme.fontSize.base,
    color: HackerTheme.colors.secondary,
    marginTop: HackerTheme.spacing.md,
    fontFamily: 'monospace',
  },
  errorBanner: {
    backgroundColor: `${HackerTheme.colors.danger}20`,
    borderWidth: 1,
    borderColor: HackerTheme.colors.danger,
    borderRadius: HackerTheme.borderRadius.md,
    padding: HackerTheme.spacing.md,
    marginBottom: HackerTheme.spacing.lg,
  },
  errorText: {
    color: HackerTheme.colors.danger,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  formContainer: {
    marginVertical: HackerTheme.spacing.lg,
  },
  toggleContainer: {
    marginTop: HackerTheme.spacing.xl,
    alignItems: 'center',
  },
  toggleText: {
    color: HackerTheme.colors.textTertiary,
    fontSize: HackerTheme.fontSize.sm,
    fontFamily: 'monospace',
    marginBottom: HackerTheme.spacing.md,
  },
  infoText: {
    color: HackerTheme.colors.success,
    fontSize: HackerTheme.fontSize.xs,
    textAlign: 'center',
    fontFamily: 'monospace',
    marginTop: HackerTheme.spacing.lg,
    letterSpacing: 0.5,
  },
});

export default AuthScreen;

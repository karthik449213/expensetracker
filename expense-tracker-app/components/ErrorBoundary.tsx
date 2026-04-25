import React, { ReactNode, ErrorInfo } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { GlowButton } from './GlowButton';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to external service (Sentry, LogRocket, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
            Oops! Something went wrong
          </Text>
          <ScrollView style={{ maxHeight: 200, marginBottom: 20 }}>
            <Text style={{ fontSize: 12, color: '#ff6b6b' }}>
              {this.state.error?.toString()}
            </Text>
          </ScrollView>
          <GlowButton title='error' onPress={this.handleReset} label="Try Again" />
        </ThemedView>
      );
    }

    return this.props.children;
  }
}
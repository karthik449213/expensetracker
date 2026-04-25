# 🛠️ Expense Tracker - Implementation Guide for Improvements
**Date:** April 25, 2026  
**Status:** Ready to Implement  

---

## 📍 CRITICAL IMPROVEMENTS (Week 1 Priority)

### 1. ✅ COMPREHENSIVE ERROR HANDLING & ERROR BOUNDARY

#### 1.1 Create Error Boundary Component
**File Location:** `expense-tracker-app/components/ErrorBoundary.tsx`

```typescript
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
          <GlowButton onPress={this.handleReset} label="Try Again" />
        </ThemedView>
      );
    }

    return this.props.children;
  }
}
```

#### 1.2 Wrap App Component
**File Location:** `expense-tracker-app/App.tsx`

```typescript
// Add import at top
import { ErrorBoundary } from './components/ErrorBoundary';

// Wrap existing JSX
export default function App() {
  return (
    <ErrorBoundary>
      {/* Existing providers and components */}
      <AuthProvider>
        <ExpenseProvider>
          {/* ... rest of app */}
        </ExpenseProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

#### 1.3 Global Error Logger Service
**File Location:** `expense-tracker-app/services/errorLogger.ts`

```typescript
/**
 * Error Logging Service
 * Centralized error logging and reporting
 */

interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 50;

  log(
    message: string,
    error?: Error,
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message,
      stack: error?.stack,
      context,
      severity,
    };

    this.logs.push(errorLog);

    // Keep only latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    console.error(`[${severity.toUpperCase()}] ${message}`, error);

    // Send to external service in production
    if (severity === 'critical' || severity === 'high') {
      this.sendToExternalService(errorLog);
    }
  }

  private sendToExternalService(errorLog: ErrorLog) {
    // Implement Sentry, LogRocket, etc.
    // Example:
    // Sentry.captureException(errorLog);
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();
```

---

### 2. 🔒 TOKEN REFRESH MECHANISM

#### 2.1 Update API Service with Token Refresh
**File Location:** `expense-tracker-app/services/api.ts`

**CHANGE: Response Interceptor Section**

```typescript
// FIND THIS:
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// REPLACE WITH:
let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (token: string) => void;
  onFailed: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.onFailed(error);
    } else {
      prom.onSuccess(token!);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((onSuccess, onFailed) => {
          failedQueue.push({ onSuccess, onFailed });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(
            `${API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );
          
          await AsyncStorage.setItem('authToken', data.token);
          if (data.refreshToken) {
            await AsyncStorage.setItem('refreshToken', data.refreshToken);
          }

          apiClient.defaults.headers['Authorization'] = `Bearer ${data.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

          processQueue(null, data.token);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);
```

#### 2.2 Update Authentication Model
**File Location:** `expense-tracker-backend/src/models/User.js`

**ADD to User Schema:**

```javascript
// Find the User schema definition and ADD these fields:

  refreshToken: {
    type: String,
    select: false, // Don't include by default in queries
  },
  tokenExpiry: {
    type: Date,
    select: false,
  },
```

#### 2.3 Add Token Refresh Endpoint
**File Location:** `expense-tracker-backend/src/routes/authRoutes.js`

**ADD this route:**

```javascript
// Add this route to your existing auth routes
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const token = generateToken(user._id, '1h'); // 1 hour
    const newRefreshToken = generateToken(user._id, '7d', process.env.JWT_REFRESH_SECRET); // 7 days

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message,
    });
  }
});
```

---

### 3. 📱 OFFLINE SUPPORT & LOCAL CACHING

#### 3.1 Create Cache Service
**File Location:** `expense-tracker-app/services/cacheService.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class CacheService {
  private prefix = '@expense_cache_';

  async set<T>(key: string, data: T, expiresInMinutes: number = 30): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: expiresInMinutes * 60 * 1000,
      };
      await AsyncStorage.setItem(
        this.prefix + key,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.prefix + key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;

      if (isExpired) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

export const cacheService = new CacheService();
```

#### 3.2 Create Sync Queue Service
**File Location:** `expense-tracker-app/services/syncQueueService.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface QueuedRequest {
  id: string;
  method: string;
  endpoint: string;
  data: any;
  timestamp: number;
  retries: number;
}

class SyncQueueService {
  private queue: QueuedRequest[] = [];
  private isSyncing = false;
  private maxRetries = 3;

  async addToQueue(method: string, endpoint: string, data: any): Promise<void> {
    const request: QueuedRequest = {
      id: `${Date.now()}_${Math.random()}`,
      method,
      endpoint,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(request);
      await this.persistQueue();

    // Try to sync if connected
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      this.sync();
    }
  }

  async sync(): Promise<void> {
    if (this.isSyncing || this.queue.length === 0) return;

    this.isSyncing = true;

    for (let i = 0; i < this.queue.length; i++) {
      const request = this.queue[i];

      try {
        // Make the request to API
        await this.executeRequest(request);
        this.queue.splice(i, 1);
        i--;
      } catch (error) {
        request.retries++;

        if (request.retries >= this.maxRetries) {
          console.error(`Failed to sync after ${this.maxRetries} retries:`, request);
          this.queue.splice(i, 1);
          i--;
        }
      }
    }

    await this.persistQueue();
    this.isSyncing = false;
  }

  private async executeRequest(request: QueuedRequest): Promise<void> {
    // Implement actual API call
    const apiClient = require('./api').default;
    await apiClient({
      method: request.method,
      url: request.endpoint,
      data: request.data,
    });
  }

  private async persistQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem('@sync_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Queue persist error:', error);
    }
  }

  async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('@sync_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Queue load error:', error);
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}

export const syncQueueService = new SyncQueueService();
```

#### 3.3 Update Expense Context with Caching
**File Location:** `expense-tracker-app/context/ExpenseContext.tsx`

**ADD imports at top:**
```typescript
import { cacheService } from '../services/cacheService';
import { syncQueueService } from '../services/syncQueueService';
```

**MODIFY fetchExpenses function:**
```typescript
// Find fetchExpenses and REPLACE:
const fetchExpenses = useCallback(async () => {
  try {
    setLoading(true);

    // Try cache first
    const cachedExpenses = await cacheService.get<Expense[]>('expenses');
    if (cachedExpenses) {
      setExpenses(cachedExpenses);
    }

    // Then fetch fresh data
    const response = await expenseAPI.getExpenses();
    setExpenses(response.data.expenses);
    
    // Cache the result
    await cacheService.set('expenses', response.data.expenses, 30);
    setError(null);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to fetch expenses');
    // Return cached data if available
    const cached = await cacheService.get<Expense[]>('expenses');
    if (cached) {
      setExpenses(cached);
    }
  } finally {
    setLoading(false);
  }
}, []);
```

---

### 4. 🛡️ INPUT VALIDATION & SANITIZATION

#### 4.1 Backend Input Validation Middleware
**File Location:** `expense-tracker-backend/src/middleware/validationMiddleware.js`

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Expense validation rules
const validateCreateExpense = [
  body('amount')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Amount must be between 0.01 and 999,999.99'),
  body('category')
    .isIn(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'])
    .withMessage('Invalid category'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
    .escape(),
  body('paymentMethod')
    .isIn(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'])
    .withMessage('Invalid payment method'),
  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be boolean'),
];

module.exports = {
  validateCreateExpense,
  handleValidationErrors,
};
```

#### 4.2 Apply Validation to Routes
**File Location:** `expense-tracker-backend/src/routes/expenseRoutes.js`

**ADD imports:**
```javascript
const {
  validateCreateExpense,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');
```

**UPDATE create expense route:**
```javascript
// Find the POST route for creating expense and UPDATE:
router.post('/', validateCreateExpense, handleValidationErrors, expenseController.createExpense);

// Also update PUT route:
router.put('/:id', validateCreateExpense, handleValidationErrors, expenseController.updateExpense);
```

#### 4.3 Input Sanitization Service
**File Location:** `expense-tracker-app/services/sanitizer.ts`

```typescript
/**
 * Input Sanitization Service
 * Prevents injection attacks
 */

export class Sanitizer {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/["']/g, '') // Remove quotes
      .trim();
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static sanitizeNumber(input: string | number): number {
    const num = parseFloat(String(input));
    return isNaN(num) ? 0 : num;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateStrongPassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  }
}
```

---

## 📋 IMPORTANT IMPROVEMENTS (Week 2-3 Priority)

### 5. 🧪 TESTING SUITE

#### 5.1 Unit Tests for Utils
**File Location:** `expense-tracker-app/utils/__tests__/formatting.test.ts`

```typescript
import { formatCurrency, formatDate } from '../formatting';

describe('Formatting Utils', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(99.5)).toBe('$99.50');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2026-04-25');
      expect(formatDate(date)).toMatch(/Apr.*25.*2026/);
    });
  });
});
```

#### 5.2 Context Tests
**File Location:** `expense-tracker-app/context/__tests__/AuthContext.test.tsx`

```typescript
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  it('should handle login correctly', async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'Password123');
    });

    await waitFor(() => {
      expect(result.current.isSignedIn).toBe(true);
    });
  });

  it('should handle logout correctly', async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isSignedIn).toBe(false);
    });
  });
});
```

#### 5.3 API Tests
**File Location:** `expense-tracker-backend/tests/api.test.js`

```javascript
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Expense API', () => {
  let authToken;

  beforeAll(async () => {
    // Register and login
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'Password123',
    });

    authToken = response.body.token;
  });

  describe('POST /api/expenses', () => {
    it('should create an expense', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          amount: 50,
          category: 'Food',
          date: new Date().toISOString(),
          note: 'Lunch',
          paymentMethod: 'Card',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/expenses', () => {
    it('should retrieve expenses', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.expenses)).toBe(true);
    });
  });
});
```

---

### 6. 📊 MONITORING & ANALYTICS

#### 6.1 Error Logging Configuration
**File Location:** `expense-tracker-app/services/errorTracking.ts`

```typescript
/**
 * Error Tracking Service (Sentry Integration)
 */
import * as Sentry from 'sentry-expo';

export const initErrorTracking = () => {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN', // Get from Sentry dashboard
    enableInExpoDevelopment: true,
    tracesSampleRate: 1.0,
    environment: __DEV__ ? 'development' : 'production',
  });
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};
```

#### 6.2 Analytics Service
**File Location:** `expense-tracker-app/services/analytics.ts`

```typescript
/**
 * Analytics Service
 * Tracks user behavior and app metrics
 */

interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  trackEvent(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: properties || {},
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    console.log(`[Analytics] ${eventName}`, properties);

    // Send to external service
    this.sendToAnalytics(event);
  }

  trackExpenseCreation(amount: number, category: string) {
    this.trackEvent('expense_created', { amount, category });
  }

  trackLogin(method: string) {
    this.trackEvent('user_login', { method });
  }

  trackScreenView(screenName: string) {
    this.trackEvent('screen_viewed', { screen: screenName });
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Implement Firebase Analytics, Mixpanel, etc.
    // Example: firebase.analytics().logEvent(event.name, event.properties);
  }
}

export const analyticsService = new AnalyticsService();
```

---

### 7. 🚀 PERFORMANCE IMPROVEMENTS

#### 7.1 Use FlatList Instead of ScrollView
**File Location:** `expense-tracker-app/screens/ExpensesScreen.tsx`

**REPLACE ScrollView with FlatList:**

```typescript
import { FlatList } from 'react-native';
import { ExpenseCard } from '../components/ExpenseCard';

export function ExpensesScreen() {
  const { expenses, isLoading } = useExpense();

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <ExpenseCard expense={item} />
  );

  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item._id}
      onEndReached={() => {
        // Load more expenses when reaching end
      }}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<EmptyState message="No expenses found" />}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    />
  );
}
```

#### 7.2 Memoize Expensive Components
**File Location:** `expense-tracker-app/components/ExpenseCard.tsx`

```typescript
import React, { memo } from 'react';
import { View, Text } from 'react-native';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
}

const ExpenseCardComponent: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  return (
    <View onTouchEnd={onPress} style={styles.card}>
      <Text style={styles.category}>{expense.category}</Text>
      <Text style={styles.amount}>${expense.amount}</Text>
      <Text style={styles.date}>{formatDate(expense.date)}</Text>
    </View>
  );
};

// Memoize to prevent unnecessary re-renders
export const ExpenseCard = memo(ExpenseCardComponent, (prevProps, nextProps) => {
  return prevProps.expense._id === nextProps.expense._id;
});
```

#### 7.3 Implement Request Debouncing
**File Location:** `expense-tracker-app/utils/debounce.ts`

```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Usage in component
const debouncedSearch = debounce((query: string) => {
  searchExpenses(query);
}, 300);
```

---

### 8. 💾 DATA CACHING STRATEGY

#### 8.1 Request Deduplication Service
**File Location:** `expense-tracker-app/services/deduplicationService.ts`

```typescript
/**
 * Request Deduplication Service
 * Prevents duplicate API requests
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class DeduplicationService {
  private pendingRequests = new Map<string, PendingRequest>();
  private cacheTimeout = 30000; // 30 seconds

  async executeRequest<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // Check if same request is pending
    const pending = this.pendingRequests.get(key);
    if (pending && Date.now() - pending.timestamp < this.cacheTimeout) {
      return pending.promise;
    }

    // Execute request and cache it
    const promise = requestFn();
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    try {
      const result = await promise;
      return result;
    } finally {
      // Clean up after timeout
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, this.cacheTimeout);
    }
  }

  clearPending(key?: string) {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }
}

export const deduplicationService = new DeduplicationService();
```

---

## 🟢 NICE-TO-HAVE IMPROVEMENTS (Future Weeks)

### 9. 📊 ADVANCED ANALYTICS WITH CHARTS

#### 9.1 Install Chart Library
**File Location:** `expense-tracker-app/package.json`

```json
{
  "dependencies": {
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "^13.x.x"
  }
}
```

#### 9.2 Dashboard Chart Component
**File Location:** `expense-tracker-app/components/ExpenseChart.tsx`

```typescript
import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface ExpenseChartProps {
  data: { category: string; amount: number }[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.amount),
        colors: [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#FFA07A',
          '#98D8C8',
        ],
      },
    ],
  };

  return (
    <View>
      <PieChart
        data={chartData}
        width={350}
        height={220}
        chartConfig={{
          color: () => '#fff',
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
      />
    </View>
  );
};
```

### 10. 🏦 BUDGET TRACKING

#### 10.1 Budget Model
**File Location:** `expense-tracker-backend/src/models/Budget.js`

```javascript
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Food',
        'Transportation',
        'Entertainment',
        'Shopping',
        'Utilities',
        'Healthcare',
        'Education',
        'Other',
      ],
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    month: {
      type: String, // Format: "2026-04"
      required: true,
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert at 80% of budget
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
```

#### 10.2 Budget Context
**File Location:** `expense-tracker-app/context/BudgetContext.tsx`

```typescript
import React, { createContext, useState, useCallback } from 'react';

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
  alertThreshold: number;
}

interface BudgetContextType {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  createBudget: (budget: Omit<Budget, '_id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
}

export const BudgetContext = createContext<BudgetContextType>({} as BudgetContextType);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      // Call API to fetch budgets
      // setBudgets(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        isLoading,
        error,
        fetchBudgets,
        createBudget: async () => {},
        updateBudget: async () => {},
        deleteBudget: async () => {},
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = React.useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};
```

---

## 📌 SUMMARY TABLE

| Priority | Improvement | File Locations | Est. Time |
|----------|-------------|------------------|-----------|
| 🔴 CRITICAL | Error Boundary | `components/ErrorBoundary.tsx`, `App.tsx` | 1-2 hrs |
| 🔴 CRITICAL | Error Logger | `services/errorLogger.ts` | 1 hr |
| 🔴 CRITICAL | Token Refresh | `services/api.ts`, `models/User.js`, `routes/authRoutes.js` | 2 hrs |
| 🔴 CRITICAL | Offline Support | `services/cacheService.ts`, `services/syncQueueService.ts`, `context/ExpenseContext.tsx` | 3 hrs |
| 🔴 CRITICAL | Input Validation | `middleware/validationMiddleware.js`, `routes/expenseRoutes.js`, `services/sanitizer.ts` | 2 hrs |
| 🟡 IMPORTANT | Testing Suite | `__tests__/` directories | 4 hrs |
| 🟡 IMPORTANT | Monitoring | `services/errorTracking.ts`, `services/analytics.ts` | 2 hrs |
| 🟡 IMPORTANT | Performance | `screens/`, `components/`, `utils/debounce.ts` | 3 hrs |
| 🟡 IMPORTANT | Caching | `services/deduplicationService.ts` | 1.5 hrs |
| 🟢 NICE-TO-HAVE | Charts | `components/ExpenseChart.tsx` | 2 hrs |
| 🟢 NICE-TO-HAVE | Budgets | `models/Budget.js`, `context/BudgetContext.tsx` | 3 hrs |

---

## 🚀 IMPLEMENTATION PRIORITY

**Week 1 (Critical):**
1. Error Boundary & Logger
2. Token Refresh Mechanism
3. Offline Support (Cache + Sync Queue)
4. Input Validation

**Week 2-3 (Important):**
5. Testing Suite
6. Monitoring & Analytics
7. Performance Improvements
8. Request Deduplication

**Week 4+ (Nice-to-Have):**
9. Charts & Graphs
10. Budget Tracking
11. Advanced Filtering
12. Social Features

---

**Generated:** April 25, 2026  
**Status:** Ready for Implementation

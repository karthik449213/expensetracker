# 🚀 Expense Tracker - Hacker Terminal Edition

A futuristic React Native mobile app with a hacker-terminal inspired UI for tracking personal expenses with real-time animations, advanced analytics, and secure authentication.

## 🎨 Features

### 🖥️ Terminal-Inspired UI
- **Neon Glow Effects**: Glowing text and borders in cyan, green, and secondary colors
- **Animated Components**: Smooth transitions, pulse effects, and typing animations
- **Monospace Typography**: Terminal-style fonts for authenticity
- **Dark Theme**: Professional hacker aesthetic with black background

### 💰 Core Features
- ✅ **User Authentication**: Secure JWT-based login and registration
- ✅ **Expense Management**: Add, edit, delete, and categorize expenses
- ✅ **Dashboard Analytics**: Real-time expense summaries and trends
- ✅ **Animated Counters**: Smooth counting animations for totals
- ✅ **Category Breakdown**: Visual breakdown of spending by category
- ✅ **Search & Filter**: Find expenses by category, date, or description
- ✅ **Pull-to-Refresh**: Real-time data synchronization
- ✅ **Form Validation**: Comprehensive input validation with error handling

### 🎬 Animations
- **Screen Transitions**: Fade and slide animations
- **Typing Effects**: Realistic text typing simulation
- **Glitch Effects**: Error state animations
- **Pulsing Glow**: Button and card glow effects
- **Loading Indicators**: Terminal-style loaders
- **Micro-interactions**: Touch feedback and visual responses

## 📁 Project Structure

```
expense-tracker-app/
├── app/                          # Expo Router configuration
├── components/                   # Reusable animated components
│   ├── TerminalInput.tsx        # Terminal-style input field
│   ├── GlowButton.tsx           # Animated glowing button
│   ├── AnimatedCounter.tsx      # Smooth counting animation
│   ├── ExpenseCard.tsx          # Expense item card
│   ├── Loader.tsx               # Loading indicator
│   ├── EmptyState.tsx           # Empty state placeholder
│   └── TypingEffect.tsx         # Typing animation component
├── screens/                      # App screens
│   ├── SplashScreen.tsx         # Boot animation
│   ├── AuthScreen.tsx           # Login/Register
│   ├── DashboardScreen.tsx      # Main dashboard
│   ├── AddExpenseScreen.tsx     # Add/Edit expense form
│   ├── ExpensesScreen.tsx       # Expenses list
│   └── ExpenseDetailScreen.tsx  # Expense details
├── navigation/                   # Navigation setup
│   └── AppNavigator.tsx         # Stack navigator
├── context/                      # State management
│   ├── AuthContext.tsx          # Authentication state
│   └── ExpenseContext.tsx       # Expenses state
├── services/                     # API integration
│   └── api.ts                   # Axios API client
├── utils/                        # Utilities
│   └── formatting.ts            # Format and validation functions
├── theme/                        # Design system
│   └── colors.ts                # Color palette and theme
└── App.tsx                       # Main app component
```

## 🛠️ Tech Stack

### Frontend
- **React Native** (v0.81.5)
- **Expo** (v54.0)
- **React Navigation** (v7)
- **React Native Reanimated** (v4)
- **React Native Gesture Handler** (v2)

### State Management
- **Context API** with React Hooks

### Styling
- **React Native StyleSheet**
- **Animated API** for smooth animations

### HTTP Client
- **Axios** (v1.15)

### Storage
- **AsyncStorage** (v2.2)

### Date Handling
- **@react-native-community/datetimepicker**

### Animations
- **Lottie** (for advanced animations)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- React Native environment setup

### Installation

1. **Install dependencies**
   ```bash
   cd expense-tracker-app
   npm install
   ```

2. **Configure API endpoint**
   - Open `services/api.ts`
   - Update `baseURL` to match your backend:
   ```typescript
   const apiClient: AxiosInstance = axios.create({
     baseURL: 'http://localhost:5000/api', // Update this
   });
   ```

3. **Start the app**
   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android

   # For Web
   npm run web

   # Or with Expo CLI
   expo start
   ```

## 📱 Screens

### 1. Splash Screen
- **Features**: Terminal boot animation, typing effects, loading bar
- **Purpose**: Initial app load sequence with visual feedback

### 2. Auth Screen
- **Features**: Login/Register toggle, form validation, error display
- **Validations**: Email format, password strength, required fields
- **Secure**: Token stored in AsyncStorage

### 3. Dashboard Screen
- **Features**: 
  - Expense summary cards with animated counters
  - Top spending categories
  - Recent transactions list
  - Pull-to-refresh for real-time sync
  - Quick add expense button

### 4. Add Expense Screen
- **Features**:
  - Amount input with validation
  - Category picker (8 categories)
  - Date picker with calendar
  - Payment method selection
  - Optional description field
  - Recurring expense toggle
  - Form validation with error messages
  - Success animation on save

### 5. Expenses List Screen
- **Features**:
  - Full expense history
  - Search by description or category
  - Filter by category
  - Swipe actions (edit/delete)
  - Sort by date (newest first)

### 6. Expense Detail Screen
- **Features**:
  - View complete expense details
  - Edit amount and description
  - Delete with confirmation
  - Metadata (created/updated dates)
  - Recurring expense indicator

## 🎨 Design System

### Colors
```typescript
{
  background: '#000000',           // Black
  primary: '#00FF9C',              // Bright cyan green
  secondary: '#00C3FF',            // Cyan blue
  accent: '#00FFFF',               // Cyan
  danger: '#FF3B3B',               // Red
  warning: '#FFB800',              // Orange
  success: '#00FF9C',              // Green
  text: '#E0FFE0',                 // Light green
}
```

### Typography
- **Font**: Monospace (terminal style)
- **Sizes**: 10px - 40px scale
- **Weight**: 400 (normal), 600 (semi-bold), 700 (bold)
- **Letter Spacing**: 0.5-3px for emphasis

### Components
- **Border Radius**: 4px - 24px
- **Spacing**: 4px - 48px scale
- **Shadows**: Glowing effects (8-32px spread)

## 🔒 Authentication Flow

1. **User Registers**
   - Validates email, password strength, name
   - Backend creates user and returns JWT token
   - Token stored in AsyncStorage

2. **User Logs In**
   - Validates credentials
   - Backend returns JWT token
   - Token attached to all subsequent API requests

3. **Token Persistence**
   - Auto-login if valid token exists
   - Automatic logout on token expiration (401)
   - Clear token on logout

## 💾 API Integration

### Authentication Endpoints
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expense Endpoints
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get dashboard summary

### Error Handling
- Network errors with retry logic
- Token expiration handling
- User-friendly error messages
- Validation error display

## 🎬 Animation Details

### Global Animations
- **Screen Transitions**: 300ms fade + slide
- **Button Press**: 100ms scale down, feedback on release
- **Glow Pulsing**: 1.5s continuous cycle

### Component-Specific
- **TerminalInput**: 300ms border glow on focus
- **GlowButton**: 1.5s pulsing shadow, 100ms press feedback
- **AnimatedCounter**: 1.2s smooth count animation
- **Loader**: Continuous loop with blinking cursor
- **TypingEffect**: 50ms per character typing
- **ExpenseCard**: 300ms swipe reveal animation

## 🧪 Testing

### Manual Testing Checklist
- [ ] Registration with valid/invalid credentials
- [ ] Login persistence across app restart
- [ ] Add expense with all categories
- [ ] Edit and delete expenses
- [ ] Search and filter functionality
- [ ] Date picker functionality
- [ ] Animations on all screens
- [ ] Error handling (network, validation)
- [ ] Pull-to-refresh
- [ ] Logout functionality

## 📦 Deployment

### Build Production Bundle
```bash
# Standalone app (EAS)
eas build --platform ios
eas build --platform android

# APK (Android)
eas build --platform android --local

# IPA (iOS)
eas build --platform ios --local
```

## 🐛 Troubleshooting

### Common Issues

**API Connection Error**
- Check backend is running on `http://localhost:5000`
- Verify `baseURL` in `services/api.ts`
- Check network permissions in app.json

**Auth Token Issues**
- Clear AsyncStorage: `react-native-storage` dev tool
- Check token expiration
- Ensure backend returns valid JWT

**Animations Not Smooth**
- Use native driver when possible
- Check device performance settings
- Reduce animation complexity for lower-end devices

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and add comments for complex logic.

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review error messages carefully
3. Enable debug logging in `services/api.ts`
4. Check network tab in developer tools

---

**Happy Expense Tracking!** 🎉💰

# React Native Expense Tracker - Project Structure & Workflow Guide

## 📱 Project Overview
This is an **Expo + React Native** application using **Expo Router** for file-based routing. It's a cross-platform app (iOS, Android, Web) built with TypeScript.

---

## 🚀 HOW THE WORKFLOW STARTS

### Entry Point Flow:

```
1. npx expo start (or npm start)
     ↓
2. package.json → "main": "expo-router/entry"
     ↓
3. App.tsx (Root component - providers setup)
     ↓
4. app/_layout.tsx (Router configuration)
     ↓
5. Conditional routing based on auth state:
   - isSignedIn = false → shows app/auth.tsx
   - isSignedIn = true → shows app/(tabs)/_layout.tsx
     ↓
6. User sees either Auth Screen or Dashboard Tabs
```

---

## 📁 FOLDER & FILE STRUCTURE

### **ROOT FILES**

#### `App.tsx` ⭐ (ENTRY POINT)
- **Purpose:** Root component that wraps entire app with providers
- **Key responsibility:** 
  - Sets up gesture handler
  - Wraps app with `AuthProvider` (manages auth state)
  - Wraps app with `ExpenseProvider` (manages expense data)
  - Handles splash screen
- **Flow:** `App.tsx` → Providers → Expo Router → Navigation

#### `app.json`
- **Purpose:** Expo configuration file
- **Contains:**
  - App name, version, slug
  - Platform-specific settings (iOS, Android, Web)
  - Splash screen config
  - Icons and permissions
  - Plugin configurations

#### `tsconfig.json`
- **Purpose:** TypeScript configuration
- **Key settings:** 
  - Strict type checking
  - Path aliases (`@` = source root)
  - ES target

#### `package.json`
- **Purpose:** NPM dependencies and scripts
- **Key scripts:**
  - `npm start` - Start development server
  - `npm run android/ios/web` - Run on specific platform

---

## 📂 `app/` DIRECTORY (EXPO ROUTER - File-based Routing)

Expo Router automatically converts file structure into routes.

```
app/
├── _layout.tsx          ← Root layout (authentication guard)
├── auth.tsx             ← Auth screen route
└── (tabs)/              ← Tab group (grouped routes)
    ├── _layout.tsx      ← Tab navigator setup
    ├── dashboard.tsx    ← /dashboard route
    ├── expenses.tsx     ← /expenses route
    ├── addexpense.tsx   ← /addexpense route
    ├── explore.tsx      ← /explore route
    └── hello.tsx        ← /hello route
```

### `app/_layout.tsx` ⭐ (ROUTER GUARD)
- **Purpose:** Root layout that manages authentication-based routing
- **Logic:**
  ```
  if (isLoading) → show (tabs)
  else if (isSignedIn) → show (tabs)
  else → show auth
  ```
- **Stack setup:** Conditionally renders different screens

### `app/auth.tsx`
- **Purpose:** Unauthenticated user route
- **Shows:** Login/Register screen
- **Imports:** `AuthScreen` from screens folder

### `app/(tabs)/` (GROUPED ROUTES)
- **Purpose:** Group related routes under tabs navigation
- **Parentheses** = folder name hidden from URL
- **Access:** `/dashboard`, `/expenses`, `/addexpense` (not `/tabs/...`)

### `app/(tabs)/_layout.tsx`
- **Purpose:** Tab navigator configuration
- **Sets up:** Tab bar with icons and navigation
- **Tabs created:** Dashboard, Expenses, Add Expense

### `app/(tabs)/dashboard.tsx`, `expenses.tsx`, etc.
- **Purpose:** Individual screen components
- **Each renders:** UI for that tab/screen

---

## 📂 `components/` (REUSABLE UI COMPONENTS)

```
components/
├── AnimatedCounter.tsx      ← Animated number display
├── EmptyState.tsx           ← Empty list placeholder
├── ExpenseCard.tsx          ← Single expense item card
├── GlowButton.tsx           ← Glowing button style
├── TerminalInput.tsx        ← Terminal-style text input
├── Loader.tsx               ← Loading spinner
├── TypingEffect.tsx         ← Text typing animation
├── themed-text.tsx          ← Theme-aware text
├── themed-view.tsx          ← Theme-aware container
├── parallax-scroll-view.tsx ← Parallax scrolling
└── ui/                      ← UI-specific components
    ├── collapsible.tsx      ← Expandable component
    ├── icon-symbol.tsx      ← Icon wrapper
    └── icon-symbol.ios.tsx  ← iOS-specific icon
```

**Purpose:** Reusable pieces used across multiple screens
**Example:** `<ExpenseCard />` used in both dashboard and expenses list

---

## 📂 `context/` (STATE MANAGEMENT)

### `AuthContext.tsx` ⭐ (AUTH STATE)
- **Purpose:** Manages global authentication state
- **Provides:**
  - `user` - current logged-in user
  - `isSignedIn` - authentication status
  - `isLoading` - loading state during auth checks
  - `login()`, `logout()`, `register()` - auth methods
  - `error` - error messages
- **Usage:** `const { user, isSignedIn } = useAuth();`
- **Persists:** Auth token in AsyncStorage (device storage)

### `ExpenseContext.tsx` (EXPENSE STATE)
- **Purpose:** Manages global expense data
- **Provides:**
  - `expenses[]` - all expenses
  - `summary` - expense summary stats
  - `fetchExpenses()` - get expenses from API
  - `createExpense()` - add new expense
  - `updateExpense()` - modify expense
  - `deleteExpense()` - remove expense
- **Usage:** `const { expenses } = useExpense();`

---

## 📂 `screens/` (FULL SCREEN COMPONENTS)

```
screens/
├── AuthScreen.tsx           ← Login/Register UI (in app/auth.tsx)
├── DashboardScreen.tsx      ← Dashboard logic (in app/(tabs)/dashboard.tsx)
├── ExpensesScreen.tsx       ← Expenses list
├── AddExpenseScreen.tsx     ← Add/Edit expense form
├── ExpenseDetailScreen.tsx  ← Single expense details
└── SplashScreen.tsx         ← Loading/splash screen
```

**Purpose:** Full-page components, complex logic, styling
**Difference from `app/` folder:** 
- `app/` = routing entry points
- `screens/` = actual component logic (imported into `app/`)

---

## 📂 `services/` (API COMMUNICATION)

### `api.ts` ⭐ (BACKEND COMMUNICATION)
- **Purpose:** Axios HTTP client for backend API calls
- **Key methods:**
  ```typescript
  authAPI.login(email, password)
  authAPI.register(userData)
  authAPI.getCurrentUser()
  
  expenseAPI.getExpenses()
  expenseAPI.createExpense(data)
  expenseAPI.updateExpense(id, data)
  expenseAPI.deleteExpense(id)
  ```
- **Base URL:** Backend server address
- **Auth:** Adds token to headers automatically
- **Error handling:** Catches and formats errors

### `index.ts`
- **Purpose:** Barrel export (re-exports all services)
- **Usage:** `import { authAPI } from '../services'`

---

## 📂 `hooks/` (CUSTOM HOOKS)

```
hooks/
├── use-color-scheme.ts      ← Get dark/light mode
├── use-color-scheme.web.ts  ← Web-specific color scheme
└── use-theme-color.ts       ← Theme color utilities
```

**Purpose:** Custom React hooks for reusable logic
**Example:** `const colorScheme = useColorScheme();`

---

## 📂 `theme/` (STYLING & COLORS)

### `colors.ts`
- **Purpose:** Centralized color definitions
- **Provides:** Color schemes for light/dark modes
- **Prevents:** Hardcoded colors scattered throughout app

---

## 📂 `constants/` (FIXED VALUES)

### `theme.ts`
- **Purpose:** Theme constants, spacing, typography
- **Usage:** Consistent sizing, margins, fonts across app

---

## 📂 `utils/` (HELPER FUNCTIONS)

### `formatting.ts`
- **Purpose:** Utility functions
- **Examples:**
  - `isValidEmail()` - validate email format
  - `isStrongPassword()` - validate password
  - `formatCurrency()` - format numbers as currency
  - `formatDate()` - date formatting

---

## 📂 `navigation/` (LEGACY)

### `AppNavigator.tsx`
- **Note:** This is the OLD navigation system
- **Status:** REPLACED by Expo Router in `app/` folder
- **Should be:** Deleted (not used anymore)

---

## 📂 `assets/` (IMAGES & MEDIA)

```
assets/
└── images/
    ├── icon.png         ← App icon
    ├── splash-icon.png  ← Splash screen
    ├── favicon.png      ← Web favicon
    └── ...other images
```

---

## 📂 `scripts/` (BUILD & SETUP)

### `reset-project.js`
- **Purpose:** Reset project to clean state
- **Usage:** `npm run reset-project`

---

## 🔄 COMPLETE WORKFLOW START-TO-END

### **1. INITIALIZATION PHASE**
```
npm start (in expense-tracker-app folder)
    ↓
Expo reads app.json configuration
    ↓
Loads expo-router/entry (from package.json)
    ↓
Renders App.tsx component
```

### **2. PROVIDER SETUP PHASE**
```
App.tsx (Root)
    ↓
<GestureHandlerRootView> ← Gesture support
    ↓
<AuthProvider> ← Auth state provider
    ↓
  → Checks AsyncStorage for saved token
  → Verifies token with backend
  → Sets user state (null if no valid token)
    ↓
<ExpenseProvider> ← Expense state provider
    ↓
Component renders
```

### **3. ROUTING PHASE**
```
app/_layout.tsx (Root Layout) checks:
    ↓
Does user have valid auth token?
    ↓
    NO → render app/auth.tsx (Auth Screen)
    YES → render app/(tabs)/_layout.tsx (Tab Navigator)
         ↓
         Shows tabs: Dashboard | Expenses | Add | Explore
```

### **4. DISPLAY PHASE**
```
User sees first screen based on auth state:

If NOT authenticated:
    ↓
Auth Screen (login/register form)
    ↓
User enters credentials
    ↓
Calls authAPI.login()
    ↓
Backend validates & returns token
    ↓
AuthContext updates isSignedIn = true
    ↓
Router automatically switches to (tabs)

If authenticated:
    ↓
Dashboard Screen loads
    ↓
ExpenseContext fetches expenses from backend
    ↓
Components render with expense data
```

---

## 🎯 KEY CONCEPTS

### **Expo Router**
- **File-based routing** like Next.js
- Files in `app/` automatically become routes
- `()` = grouped routes (hidden from URL)
- `_layout.tsx` = Layout for that directory level

### **Context API**
- Global state without Redux
- `AuthContext` = who is logged in
- `ExpenseContext` = what expenses exist
- Wrapped in providers at root level

### **Providers Pattern**
```
<AuthProvider>
  <ExpenseProvider>
    <App /> ← Can access both contexts
  </ExpenseProvider>
</AuthProvider>
```

### **AsyncStorage**
- Device local storage (persistent across app restarts)
- Used for: auth tokens, user preferences
- Similar to browser localStorage

### **TypeScript**
- Type safety for all code
- Interfaces for data structures
- Prevents bugs before runtime

---

## 🔗 DATA FLOW EXAMPLE: USER LOGS IN

```
User clicks "Login" button
    ↓
AuthScreen calls useAuth().login(email, password)
    ↓
AuthContext.login() calls authAPI.login()
    ↓
API Service sends POST to backend
    ↓
Backend validates credentials
    ↓
Backend returns token + user data
    ↓
AuthContext saves token to AsyncStorage
    ↓
AuthContext sets user state & isSignedIn = true
    ↓
app/_layout.tsx detects isSignedIn changed
    ↓
Router switches from auth to (tabs)/dashboard
    ↓
Dashboard loads and displays user's expenses
```

---

## 📝 SUMMARY TABLE

| Folder | Purpose | Example |
|--------|---------|---------|
| `app/` | File-based routing | Dashboard page |
| `components/` | Reusable UI pieces | Buttons, cards |
| `context/` | Global state | Auth, expenses |
| `screens/` | Full-screen components | Auth screen |
| `services/` | Backend API calls | Login API |
| `hooks/` | Custom logic | Get theme |
| `theme/` | Colors & styling | Color palette |
| `utils/` | Helper functions | Email validation |
| `assets/` | Images & media | App icon |

---

## 🎓 NEXT STEPS

1. **Understand the auth flow** - Read `AuthContext.tsx` + `app/_layout.tsx`
2. **Add a new screen** - Create file in `app/(tabs)/yourscreen.tsx`
3. **Call backend API** - Use methods from `services/api.ts`
4. **Add new component** - Create in `components/` and import

Good luck! 🚀

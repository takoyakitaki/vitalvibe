# 🍀 VitalVibe - System Architecture & Function Overview

> ระบบติดตามสุขภาพบน LINE OA ด้วย Vanilla HTML/JS + Firebase + Gemini AI

---

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Main Functions Overview](#main-functions-overview)
3. [PlantUML Diagrams](#plantuml-diagrams)
4. [Key Components](#key-components)
5. [Data Flow Summary](#data-flow-summary)

---

## 🏗️ System Architecture

### Tech Stack
- **Frontend**: HTML5 + Vanilla JavaScript (No Framework)
- **Backend**: Firebase (Authentication + Firestore Database)
- **APIs**: 
  - Google Gemini AI (Food Analysis)
  - LINE LIFF (Channel integration)
  - LINE Messaging API (Rich Menu)
- **Hosting**: Vercel
- **Storage**: Firestore Collections + Firebase Authentication

### Main Components
```
┌─────────────────────────────────────────────────────────┐
│           LINE Rich Menu / Deep Links                    │
├─────────────────────────────────────────────────────────┤
│  🍱 Food  │  📋 Health  │  ⏰ Reminders  │  🏆 Missions  │
│  👤 Profile  │                                           │
├─────────────────────────────────────────────────────────┤
│           Frontend (LIFF Web Apps)                        │
│     - login.html  (Authentication)                       │
│     - pages/food.html  (Food logging + Analysis)        │
│     - pages/health.html  (Weight/Sugar/Pressure)        │
│     - pages/missions.html  (Gamification)               │
│     - pages/profile.html  (Profile + Rewards)           │
│     - pages/reminders.html  (Reminders)                 │
│     - admin/index.html  (Admin Panel)                   │
├─────────────────────────────────────────────────────────┤
│           Core Libraries                                 │
│     - lib/firebase.js  (Firebase config + LIFF IDs)    │
│     - lib/auth.js  (Session management)                 │
├─────────────────────────────────────────────────────────┤
│           External Services                              │
│     ✓ Firebase Auth (Email/Password)                    │
│     ✓ Firestore Database                                │
│     ✓ Google Gemini API (/api/analyze-food)            │
│     ✓ LINE Platform                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Main Functions Overview

### 1️⃣ **Authentication (เข้าสู่ระบบ)**
**Location**: `login.html`

**Key Functions**:
- `handleLogin()` - Email/Password login
- `handleRegister()` - Create new user account
- `persistUser()` - Save user to Firestore
- `requireAuth()` - Check auth status on protected pages

**Flow**:
1. User taps LINE Rich Menu button
2. Redirects to login.html via LIFF
3. Check sessionStorage for session
4. If no session → Show login/register form
5. On success → Save session + redirect to target page

**Data Saved**:
```javascript
sessionStorage: {
  vv_uid: "user123",
  vv_name: "Name",
  vv_avatar: "emoji/url",
  vv_line_uid: "LINE_UID" // future
}
```

---

### 2️⃣ **Food Logging (บันทึกการรับประทานอาหาร)**
**Location**: `pages/food.html`

**Key Functions**:
- `openCamera()` - Open camera for photo
- `analyzeFood(image)` - Send to Gemini API
- `openManual()` - Manual entry form
- `saveLog()` - Save food record to Firestore
- `updateCalorieBar()` - Update daily calorie progress

**Two Input Methods**:
1. **Photo Upload**: 
   - Take photo → Gemini analyzes → Returns: name, calories, protein, carbs, fat
   - User can edit before saving

2. **Manual Entry**: 
   - Input: food name, calories, protein, carbs, fat
   - User specifies meal type (breakfast/lunch/dinner/snack)

**Features**:
- Daily calorie bar (progress vs goal)
- Meal sections grouped by type
- History view (daily/weekly/monthly)
- Calorie goal editor
- Visual alerts when exceeding goal

**Data Stored** (Firestore collection: `foodLogs`):
```javascript
{
  uid: "user123",
  name: "ข้าวผัด",
  calories: 450,
  protein: 12,
  carbs: 55,
  fat: 18,
  meal: "lunch",
  date: "2026-06-13",
  createdAt: timestamp
}
```

---

### 3️⃣ **Health Logging (บันทึกสุขภาพ)**
**Location**: `pages/health.html`

**Key Functions**:
- `switchType(tab)` - Switch between Weight/Sugar/Pressure
- `saveLog()` - Save health record
- `loadHistory()` - Load logs by date range
- `deleteLog()` - Remove a log entry

**Three Tracking Types**:

1. **Weight (น้ำหนัก)**
   - Input: Weight in kg
   - Tracks: Trend over time

2. **Blood Sugar (น้ำตาล)**
   - Input: Sugar level (mg/dL), timing (before/after meal)
   - For diabetes monitoring

3. **Blood Pressure (ความดัน)**
   - Input: Systolic & Diastolic values
   - For hypertension monitoring

**Features**:
- Latest value card (shows most recent entry)
- Log form with dynamic fields
- History filter (daily/monthly/yearly/all)
- Delete option for each log

**Data Stored** (Firestore collection: `healthLogs`):
```javascript
{
  uid: "user123",
  type: "weight" | "sugar" | "pressure",
  weight: 75.5,        // if type === weight
  sugar: 150,          // if type === sugar
  mealTiming: "before",
  systolic: 120,       // if type === pressure
  diastolic: 80,
  date: "2026-06-13",
  createdAt: timestamp
}
```

---

### 4️⃣ **Missions & Gamification (ภารกิจและแต้ม)**
**Location**: `pages/missions.html`

**Key Functions**:
- `loadMissions()` - Fetch all missions
- `completeMission(missionId)` - Record mission completion
- `updatePoints()` - Add points to user
- `loadLeaderboard()` - Fetch weekly rankings
- `getWeekKey()` - Get ISO week number

**Features**:
- Mission list with point rewards
- Complete missions to earn points
- Weekly leaderboard ranking
- Point display (current week total)
- Visual feedback on completion

**Mission Types**:
- **Auto-tracked**: System detects when conditions met
- **Manual**: User confirms completion

**Gamification Mechanics**:
- **Points**: Earn from missions
- **Wallet**: Points can be spent on rewards
- **Weekly Leaderboard**: Reset every Monday
- **Rankings**: Top 10-20 users displayed

**Data Stored** (Firestore collections):

`missions` collection:
```javascript
{
  id: "mission-001",
  title: "บันทึกอาหาร 3 มื้อ",
  description: "บันทึกการรับประทานอาหาร...",
  icon: "🍱",
  points: 50,
  type: "manual" | "auto",
  target: 3,
  isActive: true
}
```

`missionCompletions` collection:
```javascript
{
  uid: "user123",
  missionId: "mission-001",
  points: 50,
  date: "2026-06-13",
  createdAt: timestamp
}
```

`leaderboard` collection:
```javascript
{
  id: "2026-w24-user123",
  week: "2026-w24",
  uid: "user123",
  displayName: "Username",
  avatar: "emoji",
  points: 250,
  rank: 5,
  lastUpdated: timestamp
}
```

---

### 5️⃣ **Profile & Rewards (โปรไฟล์และรางวัล)**
**Location**: `pages/profile.html`

**Key Functions**:
- `saveProfile()` - Update profile info
- `onAvatarSelected()` - Handle avatar upload
- `compressImage()` - Compress image before saving
- `redeemReward(rewardId)` - Exchange points for reward
- `updateWallet()` - Deduct points from wallet

**Profile Features**:
- Edit display name
- Change avatar (emoji or image upload)
- Set daily calorie goal
- View lifetime points (⭐ total)
- View spendable wallet (🪙 points)

**Rewards System**:
- Browse available rewards
- Exchange points for rewards
- Pending redemptions await admin confirmation
- View redemption history & status

**Data Stored** (Firestore collections):

`rewards` collection:
```javascript
{
  id: "reward-001",
  title: "Starbucks Gift Card",
  description: "ใช้ที่ Starbucks ทั่วประเทศ",
  image: "☕",
  pointsCost: 500,
  isActive: true,
  createdAt: timestamp
}
```

`redemptions` collection:
```javascript
{
  id: "redemption-001",
  uid: "user123",
  rewardId: "reward-001",
  rewardTitle: "Starbucks Gift Card",
  pointsCost: 500,
  status: "pending" | "completed" | "cancelled",
  createdAt: timestamp,
  completedAt: timestamp
}
```

---

### 6️⃣ **Reminders (เตือนเวลา)**
**Location**: `pages/reminders.html`

**Key Functions**:
- `addReminder()` - Create new reminder
- `deleteReminder()` - Remove reminder
- `toggleReminder()` - Enable/disable
- `sendNotification()` - Trigger reminder alert

**Features**:
- Set reminders for meals, health checks, etc.
- One-time or recurring reminders
- Visual notification when triggered

**Data Stored** (Firestore collection: `reminders`):
```javascript
{
  uid: "user123",
  title: "บันทึกน้ำหนัก",
  time: "19:30",
  frequency: "daily" | "weekly" | "once",
  daysOfWeek: [0, 2, 4],  // if weekly
  isActive: true,
  createdAt: timestamp
}
```

---

### 7️⃣ **Admin Panel (แผงควบคุมผู้ดูแล)**
**Location**: `admin/index.html`

**Admin Functions**:
- View all users & their data
- View all food/health logs
- Create/edit missions
- Create/edit rewards
- Manage redemptions status
- View leaderboard

**Admin Capabilities**:
- Browse all collections
- Add new missions (Set points, title, description)
- Add new rewards (Set cost, title, description)
- Update redemption status (pending → completed)
- View usage statistics

**Required**: User must be in `ADMIN_UIDS` array

---

## 📊 PlantUML Diagrams

Created PlantUML diagrams showing system flows:

### 1. **ARCHITECTURE_DIAGRAM.puml**
Overall system architecture showing:
- Frontend pages
- Core libraries
- Firebase backend
- External services
- Connections between components

### 2. **FLOW_01_AUTHENTICATION.puml**
Authentication flow:
- Login form
- Register form
- Session management
- Firebase Auth interactions
- Redirect flow

### 3. **FLOW_02_FOOD_LOGGING.puml**
Food logging workflow:
- Photo upload → Gemini analysis
- Manual entry
- Save to Firestore
- Calorie calculation
- History tracking

### 4. **FLOW_03_HEALTH_LOGGING.puml**
Health logging workflow:
- Weight tracking
- Blood sugar tracking
- Blood pressure tracking
- History filtering
- Latest value display

### 5. **FLOW_04_MISSIONS_GAMIFICATION.puml**
Missions & gamification flow:
- Mission display & completion
- Points earning
- Leaderboard update
- Admin mission creation
- Weekly reset

### 6. **FLOW_05_PROFILE_REWARDS.puml**
Profile & rewards workflow:
- Profile editing
- Avatar management
- Reward browsing & redemption
- Admin reward management
- Redemption status tracking

### 7. **DATABASE_SCHEMA.puml**
Firestore database structure:
- All collections
- Document fields
- Relationships between collections
- Primary keys

---

## 🔧 Key Components

### Authentication Flow
```
LIFF Link → Login Page → Check Session → 
Protected Page (food/health/missions/profile)
     ↓
  NO SESSION
     ↓
  Login/Register Form → Firebase Auth → 
  Save to Firestore → sessionStorage → Redirect
```

### Data Flow Pattern
```
User Action → Page JavaScript → Firebase SDK → 
Firestore/Auth → JavaScript Query → Update UI
```

### Firestore Security
- Users can only read/write their own data
- Missions & Rewards readable by all, writable by admin
- MissionCompletions writable by user, readable by all
- Leaderboard writable by all, readable by all

---

## 📈 Data Flow Summary

### Session Flow
1. User logs in → Firebase Auth validates
2. User data saved to Firestore (`users/{uid}`)
3. Session saved to `sessionStorage`
4. When user returns → `requireAuth()` checks `sessionStorage`
5. If valid → Show page, if invalid → Redirect to login

### Food Logging Flow
1. User selects photo or manual entry
2. Photo → Gemini API for analysis
3. Save to Firestore `foodLogs` collection
4. Real-time update of daily calorie total
5. Grouped display by meal type

### Points System Flow
1. User completes mission → Add `missionCompletions` record
2. Trigger: Increment user's `points` field
3. Weekly: System recalculates leaderboard
4. User can redeem points → Deduct from `wallet`

### Reward Redemption Flow
1. User selects reward
2. Create `redemptions` record (status: pending)
3. Deduct points from wallet
4. Admin reviews in Admin Panel
5. Admin updates status to "completed"
6. User sees confirmation

---

## 🚀 Future Enhancements

- [ ] LINE Login integration
- [ ] Push notifications
- [ ] PDF health report export
- [ ] Health dashboard with charts
- [ ] Automatic streak tracking
- [ ] Direct redemption status management

---

## 📝 Notes

- **Session Storage**: Data stored in `sessionStorage` is cleared when browser tab closes
- **Firestore Database**: Can be queried in real-time using `onSnapshot()`
- **Gemini API**: Called via Vercel API `/api/analyze-food` to keep API key secure
- **LIFF**: Each page has its own LIFF ID for deep linking
- **Admin Access**: Based on `ADMIN_UIDS` array in `lib/firebase.js`


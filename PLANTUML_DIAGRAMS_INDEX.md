# 🍀 VitalVibe PlantUML Diagrams Index

## 📁 ไฟล์ PlantUML ที่สร้าง

สำเร็จ! ได้สร้างเอกสาร PlantUML จำนวน 8 ไฟล์ เพื่ออธิบายการทำงานของระบบ VitalVibe ทั้งหมด

---

## 📊 Diagrams ที่สร้าง

### 1. **SYSTEM_OVERVIEW.puml** ⭐ เริ่มต้นที่นี่
**ภาพรวมระบบทั้งหมด**
- แสดง Layers ต่างๆ (Frontend, Admin, Libraries, Backend)
- การเชื่อมต่อระหว่างแต่ละ Component
- External APIs & Services

**ใช้สำหรับ**: ความเข้าใจภาพรวม

---

### 2. **ARCHITECTURE_DIAGRAM.puml**
**สถาปัตยกรรมระบบ**
- Frontend LIFF Apps ทั้ง 6 หน้า
- Core Libraries (auth.js, firebase.js)
- Firebase Backend (Auth + Firestore)
- External Services (Gemini, LINE API)

**ใช้สำหรับ**: เข้าใจว่า component ไหน ต่อไปกับไหน

---

### 3. **FLOW_01_AUTHENTICATION.puml**
**ขั้นตอนการเข้าสู่ระบบ**
```
User → Login Page → Email/Password → Firebase Auth 
→ Save to Firestore → sessionStorage → Redirect to page
```

**ฟังชั่นหลัก**:
- `handleLogin()` - ล็อกอิน
- `handleRegister()` - สมัครสมาชิก
- `persistUser()` - บันทึก user ลงฐานข้อมูล
- `requireAuth()` - ตรวจสอบสิทธิ์

---

### 4. **FLOW_02_FOOD_LOGGING.puml**
**ขั้นตอนบันทึกการรับประทานอาหาร**
```
User → Photo/Manual → Gemini Analysis (Photo) 
→ Save to Firestore → Update Calorie Bar
```

**ฟังชั่นหลัก**:
- `openCamera()` - เปิดกล้อง
- `analyzeFood()` - ส่งไป Gemini วิเคราะห์
- `openManual()` - แบบ Manual entry
- `saveLog()` - บันทึกลง Firestore
- `updateCalorieBar()` - อัปเดต Progress Bar

**ข้อมูลที่บันทึก**:
```javascript
{
  uid, name, calories, protein, carbs, fat,
  meal (breakfast/lunch/dinner/snack),
  date, createdAt
}
```

---

### 5. **FLOW_03_HEALTH_LOGGING.puml**
**ขั้นตอนบันทึกข้อมูลสุขภาพ**
```
User → Choose Type (Weight/Sugar/Pressure)
→ Enter Data → Save to Firestore
→ Display History (by date range)
```

**ฟังชั่นหลัก**:
- `switchType()` - เปลี่ยนประเภท
- `saveLog()` - บันทึกข้อมูล
- `loadHistory()` - ดึงประวัติ
- `deleteLog()` - ลบบันทึก

**ประเภทที่ติดตาม**:
1. **Weight (น้ำหนัก)** - kg
2. **Sugar (น้ำตาล)** - mg/dL + timing
3. **Pressure (ความดัน)** - Systolic/Diastolic

---

### 6. **FLOW_04_MISSIONS_GAMIFICATION.puml**
**ขั้นตอนการทำภารกิจและระบบแต้ม**
```
User → View Missions → Complete Mission
→ Earn Points → Update Leaderboard
```

**ฟังชั่นหลัก**:
- `loadMissions()` - ดึงรายการ
- `completeMission()` - เสร็จสิ้น
- `updatePoints()` - เพิ่มแต้ม
- `loadLeaderboard()` - ดึง Ranking

**ระบบแต้ม**:
- **Missions**: ทำภารกิจ → ได้แต้ม
- **Points**: เก็บแต้มไว้
- **Wallet**: ใช้จ่ายเพื่อแลกรางวัล
- **Weekly Leaderboard**: Ranking รายสัปดาห์

---

### 7. **FLOW_05_PROFILE_REWARDS.puml**
**ขั้นตอนจัดการโปรไฟล์และรางวัล**
```
User → Edit Profile/Avatar
→ Browse Rewards → Redeem Points
→ Awaiting Admin Confirmation
```

**ฟังชั่นหลัก**:
- `saveProfile()` - บันทึกโปรไฟล์
- `onAvatarSelected()` - เปลี่ยน Avatar
- `compressImage()` - ย่ออ
- `redeemReward()` - แลกรางวัล
- `updateWallet()` - ตัดแต้ม

**ส่วนประกอบ**:
1. **Profile Card**: แสดงข้อมูล + แต้ม
2. **Edit Profile**: เปลี่ยนชื่อ, Goal Calories
3. **Rewards Grid**: แสดงรางวัลที่มี
4. **Redemption History**: สถานะการแลก

---

### 8. **DATABASE_SCHEMA.puml**
**โครงสร้างฐานข้อมูล Firestore**
```
Collections:
├── users/{uid}
├── foodLogs/
├── healthLogs/
├── missions/
├── missionCompletions/
├── leaderboard/
├── rewards/
├── redemptions/
├── reminders/
└── notifications/
```

**ความสัมพันธ์**:
- 1 User ↔ Many FoodLogs, HealthLogs, MissionCompletions
- 1 Mission ↔ Many MissionCompletions
- 1 Reward ↔ Many Redemptions

---

## 📖 SYSTEM_ARCHITECTURE_SUMMARY.md

ไฟล์ Markdown ที่รวมข้อมูลทั้งหมด:
- Overview ของแต่ละ Function
- Data Structures
- Flow Diagrams
- Key Components

---

## 🎯 วิธีการใช้งาน

### 1. **อ่านภาพรวมก่อน**
   ⭐ เริ่มจาก: `SYSTEM_OVERVIEW.puml`

### 2. **เข้าใจสถาปัตยกรรม**
   📋 ต่อไปที่: `ARCHITECTURE_DIAGRAM.puml`

### 3. **ศึกษาแต่ละฟังชั่น**
   🔄 อ่านจาก `FLOW_*.puml` ตามลำดับ:
   - 01 Authentication
   - 02 Food Logging
   - 03 Health Logging
   - 04 Missions
   - 05 Profile & Rewards

### 4. **เข้าใจฐานข้อมูล**
   💾 สุดท้าย: `DATABASE_SCHEMA.puml`

### 5. **อ่านรายละเอียดเต็ม**
   📝 ดูท้าย: `SYSTEM_ARCHITECTURE_SUMMARY.md`

---

## 🔍 วิธีดู PlantUML

### Option 1: VS Code
1. ติดตั้ง Extension: **PlantUML**
2. Click ขวา → Select PlantUML → Preview

### Option 2: Online
1. ไปที่ https://www.plantuml.com/plantuml/uml/
2. Copy-paste เนื้อหาจากไฟล์ .puml

### Option 3: Command Line
```bash
# ต้องติดตั้ง PlantUML + Graphviz ก่อน
plantuml SYSTEM_OVERVIEW.puml
```

---

## 📊 Functions Summary

### ✅ 7 Main Features

| ฟังชั่น | ไฟล์ | Diagram |
|--------|------|---------|
| 🔑 Authentication | login.html | FLOW_01 |
| 🍱 Food Logging | pages/food.html | FLOW_02 |
| 📋 Health Logging | pages/health.html | FLOW_03 |
| 🏆 Missions | pages/missions.html | FLOW_04 |
| 👤 Profile & Rewards | pages/profile.html | FLOW_05 |
| ⏰ Reminders | pages/reminders.html | (in SUMMARY) |
| 🛠️ Admin Panel | admin/index.html | DATABASE_SCHEMA |

---

## 🗂️ ไฟล์ที่สร้าง

```
vitalvibe/
├── SYSTEM_OVERVIEW.puml ⭐ START HERE
├── ARCHITECTURE_DIAGRAM.puml
├── FLOW_01_AUTHENTICATION.puml
├── FLOW_02_FOOD_LOGGING.puml
├── FLOW_03_HEALTH_LOGGING.puml
├── FLOW_04_MISSIONS_GAMIFICATION.puml
├── FLOW_05_PROFILE_REWARDS.puml
├── DATABASE_SCHEMA.puml
├── SYSTEM_ARCHITECTURE_SUMMARY.md
└── (existing project files...)
```

---

## 💡 Key Points

1. **Frontend**: HTML5 + Vanilla JS (No Framework)
2. **Backend**: Firebase (Auth + Firestore)
3. **APIs**: Gemini (Food Analysis) + LINE (Deep Links)
4. **Hosting**: Vercel
5. **Authentication**: Email/Password (future: LINE UID)
6. **Gamification**: Points + Weekly Leaderboard
7. **Real-time**: Firestore listeners for live updates

---

## 🚀 Next Steps

- [ ] Review SYSTEM_OVERVIEW.puml
- [ ] Study ARCHITECTURE_DIAGRAM.puml
- [ ] Read all FLOW_*.puml files
- [ ] Check DATABASE_SCHEMA.puml
- [ ] Read SYSTEM_ARCHITECTURE_SUMMARY.md
- [ ] Explore actual code in /pages, /lib, /admin

---

สร้างโดย: Copilot  
วันที่: 2026-06-13  
สัญญาระบบ: VitalVibe - Health Tracking System for LINE OA


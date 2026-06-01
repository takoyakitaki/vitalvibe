# VitalVibe 💚

ระบบติดตามสุขภาพบน LINE OA สร้างด้วย Vanilla HTML/JS + Firebase + Gemini AI  
Hosted บน **Vercel** · Auth ด้วย Firebase Email/Password (รองรับ LINE UID ในอนาคต)

---

## 📁 โครงสร้างไฟล์

```
vitalvibe/
├── login.html              # หน้า Login / Register (ทุก LIFF redirect มาที่นี่ก่อน)
├── vercel.json             # Vercel routing config
├── lib/
│   ├── firebase.js         # 🔧 Firebase config + API keys (ต้องแก้ไข)
│   └── auth.js             # Session helper (sessionStorage)
├── pages/
│   ├── food.html           # 🍱 บันทึกอาหาร + Gemini วิเคราะห์
│   ├── health.html         # 📋 น้ำหนัก / น้ำตาล / ความดัน
│   ├── missions.html       # 🏆 ภารกิจ + Leaderboard รายสัปดาห์
│   └── profile.html        # 👤 โปรไฟล์ + Wallet + แลกรางวัล
├── admin/
│   └── index.html          # 🛠️ Admin Panel (แสดงข้อมูลทั้งหมด)
└── components/
    └── nav.html            # Bottom nav reference snippet
```

---

## 🔧 การ Setup (ทำตามลำดับ)

### 1. สร้าง Firebase Project ใหม่

1. ไปที่ [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Create project** → ตั้งชื่อ (เช่น `vitalvibe-prod`)
3. เปิด **npm install firebase
4. เปิด **Firestore Database** → Create database → เลือก mode: **Production**
5. ไปที่ Project Settings → Your apps → เพิ่ม Web App → Copy config

### 2. ใส่ Firebase Config

เปิด `lib/firebase.js` แล้วแก้ค่า:

```js
export const firebaseConfig = {
  apiKey:            "AIzaSy...",       // จาก Firebase Console
  authDomain:        "myproject.firebaseapp.com",
  projectId:         "myproject",
  storageBucket:     "myproject.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...:web:abc...",
};

// Set GEMINI_API_KEY in Vercel Environment Variables, not in client JS.

export const ADMIN_UIDS = ["uid-ของ-admin"];  // Firebase UID ของ Admin (ดูได้ใน Auth Console)
```

### 3. ตั้ง Firestore Security Rules

ไปที่ Firestore → Rules → วางโค้ดนี้:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: อ่าน/เขียนได้เฉพาะตัวเอง
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Food / Health logs: เจ้าของเท่านั้น
    match /foodLogs/{id} {
      allow read, write, delete: if request.auth != null
        && (resource == null || resource.data.uid == request.auth.uid)
        && (request.resource == null || request.resource.data.uid == request.auth.uid);
    }
    match /healthLogs/{id} {
      allow read, write, delete: if request.auth != null
        && (resource == null || resource.data.uid == request.auth.uid)
        && (request.resource == null || request.resource.data.uid == request.auth.uid);
    }

    // Missions / Rewards: ทุกคนอ่านได้, Admin เท่านั้นเขียนได้
    match /missions/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid in ['ADMIN_UID_HERE'];
    }
    match /rewards/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid in ['ADMIN_UID_HERE'];
    }

    // Mission completions + Leaderboard: เจ้าของเขียน, ทุกคนอ่าน
    match /missionCompletions/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
    }
    match /leaderboard/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Redemptions: เจ้าของเขียน/อ่าน
    match /redemptions/{id} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.uid == request.auth.uid)
        && (request.resource == null || request.resource.data.uid == request.auth.uid);
    }
  }
}
```

> แทนที่ `ADMIN_UID_HERE` ด้วย UID จริงของ Admin

### 4. Deploy บน Vercel

```bash
# ติดตั้ง Vercel CLI (ถ้ายังไม่มี)
npm i -g vercel

# Deploy
cd vitalvibe
vercel

# ตอบคำถาม Vercel:
# - Set up and deploy? Y
# - Which scope? (เลือก account)
# - Link to existing project? N
# - Project name: vitalvibe (หรือชื่ออื่น)
# - In which directory is your code? ./
# - Want to override settings? N
```

ได้ URL เช่น `https://vitalvibe.vercel.app`

### 5. ตั้งค่า LINE LIFF

1. ไปที่ [LINE Developers Console](https://developers.line.biz)
2. เลือก Provider → เลือก Channel (LINE Login)
3. เพิ่ม LIFF App ทั้ง 5 อัน:

| ชื่อ LIFF       | Endpoint URL                                    | Size   |
|----------------|------------------------------------------------|--------|
| vv-food        | `https://your-app.vercel.app/pages/food.html`   | Full   |
| vv-health      | `https://your-app.vercel.app/pages/health.html` | Full   |
| vv-missions    | `https://your-app.vercel.app/pages/missions.html`| Full  |
| vv-profile     | `https://your-app.vercel.app/pages/profile.html`| Full   |
| vv-login       | `https://your-app.vercel.app/login.html`        | Full   |

4. Copy LIFF ID แต่ละตัวมาใส่ใน `lib/firebase.js`:

```js
export const LIFF_IDS = {
  food:     "1234567890-xxxxxxxx",
  health:   "1234567890-yyyyyyyy",
  // ...
};
```

### 6. ตั้ง Rich Menu บน LINE OA

เชื่อม Rich Menu 4 ปุ่มกับ URL ดังนี้:

| ปุ่ม         | URL ที่ชี้ไป                                                              |
|-------------|-------------------------------------------------------------------------|
| 🍱 อาหาร    | `https://liff.line.me/{LIFF_ID_FOOD}`                                   |
| 📋 สุขภาพ   | `https://liff.line.me/{LIFF_ID_HEALTH}`                                 |
| 🏆 ภารกิจ  | `https://liff.line.me/{LIFF_ID_MISSIONS}`                               |
| 👤 โปรไฟล์ | `https://liff.line.me/{LIFF_ID_PROFILE}`                                |

---

## 🗄️ โครงสร้าง Firestore Collections

| Collection            | ข้อมูล                                      |
|----------------------|---------------------------------------------|
| `users/{uid}`        | displayName, email, avatar, points, wallet   |
| `foodLogs/{id}`      | uid, name, calories, protein, meal, date     |
| `healthLogs/{id}`    | uid, type, weight/sugar/pressure, createdAt  |
| `missions/{id}`      | title, desc, icon, points, type, target      |
| `missionCompletions/{id}` | uid, missionId, points, date           |
| `leaderboard/{week_uid}`  | uid, week, points, displayName, avatar |
| `rewards/{id}`       | title, description, image, points            |
| `redemptions/{id}`   | uid, rewardId, title, cost, status           |

---

## 🔐 Auth Flow

```
User กดปุ่ม Rich Menu
        ↓
LIFF URL → pages/food.html (หรือ health/missions/profile)
        ↓
requireAuth() ตรวจ sessionStorage
    ├── มี session → โหลดหน้าปกติ ✅
    └── ไม่มี session → redirect ไป login.html?redirect=/pages/food.html
              ↓
        Login / Register
              ↓
        saveSession() → sessionStorage
              ↓
        redirect กลับไปหน้าที่ตั้งใจ ✅
```

> **Session** เก็บใน `sessionStorage` (หาย เมื่อปิด browser/tab)  
> ถ้าอยากให้อยู่นานขึ้น ให้เปลี่ยนเป็น `localStorage` ใน `lib/auth.js`

---

## 👨‍💼 Admin Panel

เข้าถึงได้ที่ `https://your-app.vercel.app/admin`

- ต้อง Login ก่อน และต้องเป็น UID ที่อยู่ใน `ADMIN_UIDS`
- ดูข้อมูลได้ทุก collection
- เพิ่ม/ลบ Rewards และ Missions ได้
- อัปเดตสถานะ Redemptions ทำผ่าน Firestore Console

---

## 🚀 อนาคต (Roadmap)

- [ ] เพิ่ม LINE Login (ใช้ LINE UID เป็น user ID)
- [ ] Push Notification ผ่าน LINE Messaging API
- [ ] Export รายงานสุขภาพ PDF
- [ ] Dashboard กราฟสุขภาพย้อนหลัง
- [ ] Streak tracking อัตโนมัติ
- [ ] Admin: จัดการสถานะ Redemption โดยตรง

---

## 🐛 Troubleshooting

**หน้าขาว / ไม่โหลด**  
→ เปิด DevTools Console ดู error · ตรวจ Firebase config ใน `lib/firebase.js`

**Login แล้ว redirect ไม่ถูก**  
→ ตรวจ `?redirect=` parameter ใน URL · ตรวจ path ว่าตรงกับ Vercel deploy

**Gemini ไม่วิเคราะห์**  
→ ตรวจ `GEMINI_API_KEY` ใน Vercel Environment Variables · ต้องเปิดใช้ Gemini API ใน Google Cloud Console

**Admin เข้าไม่ได้**  
→ ตรวจ `ADMIN_UIDS` ว่าใส่ UID ถูก (ดูได้จาก Firebase Auth → Users)

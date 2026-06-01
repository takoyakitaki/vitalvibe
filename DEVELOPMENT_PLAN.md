# VitalVibe Development Summary & Plan

อัปเดตล่าสุด: 2026-06-01

## ภาพรวมโปรเจกต์

VitalVibe เป็นเว็บแอปสำหรับ LINE OA/มือถือ สร้างด้วย Vanilla HTML/JS, Firebase Auth, Firestore, Vercel และ Gemini API โดยตอนนี้มีแกนหลักของ MVP แล้ว ได้แก่ login/register, บันทึกอาหาร, AI วิเคราะห์แคลอรี่จากรูป, บันทึกสุขภาพ, ภารกิจ, leaderboard, profile, wallet/reward และ admin panel

LINE LIFF ยังเก็บไว้เป็น placeholder/ค่า config สำหรับอนาคต แต่ยังไม่ใช่ priority ปัจจุบัน

## สถานะฟีเจอร์ปัจจุบัน

### 1. Authentication

สถานะ: ใช้งานได้ระดับ MVP

มีแล้ว:
- Firebase Email/Password login/register
- สร้าง/อัปเดตเอกสาร `users/{uid}` ตอน login/register
- session helper ผ่าน `sessionStorage`
- redirect กลับหน้าที่ตั้งใจเข้า

ยังควรพัฒนา:
- ใช้ Firebase `onAuthStateChanged` เป็น source of truth แทนการเชื่อ `sessionStorage` อย่างเดียว
- เพิ่ม forgot password
- เพิ่ม loading/error state ที่เป็นภาษาไทยอ่านง่าย
- ปรับข้อความ UI ที่บางไฟล์ยังมี encoding เพี้ยน

### 2. Food Tracking + AI Calories

สถานะ: เป็น priority ปัจจุบัน และใกล้ใช้งานจริง

มีแล้ว:
- บันทึกอาหารแบบ manual
- อัปโหลด/ถ่ายรูปอาหาร
- ย่อรูปก่อนส่ง API
- เรียก `/api/analyze-food`
- API route เรียก Gemini ผ่าน `GEMINI_API_KEY` ใน Vercel Environment Variables
- แสดงชื่ออาหาร, calories, protein, note ให้ผู้ใช้แก้ก่อนบันทึก
- สรุป calories วันนี้และแยกตามมื้อ

ยังควรพัฒนา:
- ทดสอบบน Vercel จริงหลังตั้ง `GEMINI_API_KEY`
- เพิ่ม fallback เมื่อ Gemini ตอบ JSON ไม่สมบูรณ์
- เพิ่ม validation: calories/protein ห้ามติดลบ, จำกัดค่าสูงผิดปกติ
- ใช้ `calorieGoal` จาก profile แทนค่าคงที่ `2000`
- เพิ่มสถานะ loading ที่กันการกดซ้ำระหว่าง analyze/save
- เพิ่ม field เช่น `source: "ai" | "manual"` เพื่อให้ mission ตรวจได้ว่าเป็นการถ่ายรูปจริง

### 3. Health Logs

สถานะ: ใช้งานได้ระดับ MVP

มีแล้ว:
- บันทึกน้ำหนัก
- บันทึกน้ำตาล
- บันทึกความดัน
- แสดงค่าสุดท้ายและประวัติล่าสุด
- ลบรายการได้

ยังควรพัฒนา:
- เพิ่มกราฟย้อนหลัง
- เพิ่มช่วงเวลา filter เช่น 7 วัน, 30 วัน, 90 วัน
- เพิ่ม validation ตามชนิดข้อมูล เช่น ความดัน/น้ำตาล/น้ำหนักต้องอยู่ในช่วงสมเหตุสมผล
- เพิ่ม notes ต่อรายการ
- Export รายงานสุขภาพ PDF/CSV ในอนาคต

### 4. Missions

สถานะ: ยังเป็นต้นแบบ ต้องพัฒนาต่อหลัง AI calories

มีแล้ว:
- แสดงรายการภารกิจ default หรือจาก Firestore
- ป้องกันรับภารกิจซ้ำในวันเดียวแบบ client-side
- เพิ่ม points/wallet และ leaderboard เมื่อกดรับแต้ม
- leaderboard รายสัปดาห์

ปัญหาปัจจุบัน:
- ภารกิจยังไม่ตรวจจากข้อมูลจริง ผู้ใช้ยังกดรับแต้มเอง
- Mission type บางตัวมี UI แต่ logic ยังไม่มีจริง เช่น water, streak
- การเพิ่มแต้มยังทำจาก client โดยตรง จึงยังต้องรอ Security Rules/Cloud Function เพื่อ production

ต้องพัฒนาต่อ:
- สร้าง mission engine สำหรับตรวจเงื่อนไขจากข้อมูลจริง
- คำนวณ progress ต่อ mission เช่น 1/3, 2/5
- แยกสถานะ `available`, `claimable`, `completed`
- ทำให้การ claim เป็น atomic และกันการโกง
- เชื่อม mission กับ food/health logs จริง

Mission rules ที่ควรทำ:
- `food`: นับจำนวนมื้ออาหารของวันนี้
- `photo`: นับ food log ที่มาจาก AI/source photo
- `weight`: มี health log type `weight` วันนี้
- `health`: จำนวน health logs วันนี้
- `streak`: มี activity ต่อเนื่องตามจำนวนวัน
- `water`: ยังไม่มีระบบบันทึกน้ำ ต้องเพิ่มก่อนหรือปิด mission นี้ชั่วคราว

### 5. Profile + Wallet + Rewards

สถานะ: ใช้งานได้ระดับ MVP

มีแล้ว:
- แสดง profile, email, points, wallet
- แก้ display name และ calorie goal
- เปลี่ยน avatar แบบ base64
- แสดง rewards จาก Firestore
- redeem reward ด้วย transaction
- ดูประวัติ redemption
- logout

ยังควรพัฒนา:
- ใช้ `calorieGoal` จริงในหน้า Food
- ย้าย avatar ไป Firebase Storage แทน base64 ใน Firestore
- เพิ่มสถานะ redemption ใน UI ให้ชัดขึ้น
- เพิ่ม transaction/server validation ฝั่ง backend สำหรับ redemption ใน production

### 6. Admin Panel

สถานะ: ใช้งานได้ระดับดูข้อมูล/จัดการเบื้องต้น

มีแล้ว:
- ตรวจ UID จาก `ADMIN_UIDS`
- ดู collection หลัก
- เพิ่ม/ลบ rewards
- เพิ่ม/ลบ missions
- ลบ row ใน collection

ยังควรพัฒนา:
- Login guard ให้ admin ชัดเจนกว่านี้
- จัดการ redemption โดยตรง: approve, reject, delivered
- ปรับ form missions ให้ครบ field: type, target, active, createdAt
- เพิ่ม edit แทน delete/add อย่างเดียว
- เพิ่ม search/filter/table pagination
- ระวัง XSS จากข้อมูลที่ render เข้า `innerHTML`
- ต้องพึ่ง Firestore Security Rules จริง ไม่ใช่เช็ก admin เฉพาะฝั่ง client

### 7. Firebase Security Rules

สถานะ: ยังต้องทำก่อน production แต่ผู้ใช้กำหนดให้ทำหลัง AI calories และ mission engine

ต้องทำ:
- จำกัด `users/{uid}` ไม่ให้ user แก้ points/wallet เอง
- จำกัด `missionCompletions`, `leaderboard`, `redemptions` ให้เขียนผ่าน trusted flow
- จำกัด admin write ตาม UID
- ทดสอบ rules ด้วย Firebase emulator หรือ manual test

ข้อควรพิจารณา:
- ถ้ายังใช้ client SDK ล้วน การกันโกงคะแนนทำได้จำกัด
- ฟีเจอร์คะแนน/ภารกิจ/reward ควรย้าย logic สำคัญไป serverless function หรือ Cloud Function

### 8. LINE LIFF

สถานะ: เก็บ placeholder ไว้ ยังไม่ทำต่อ

มีแล้ว:
- `LIFF_IDS` ใน `lib/firebase.js`
- README มี flow และ URL สำหรับ LIFF

ยังไม่ทำ:
- import LIFF SDK
- `liff.init`
- `liff.getProfile`
- ผูก LINE UID กับ Firebase user
- LINE Login

ตามแผนปัจจุบัน: ยังไม่ต้องทำ จนกว่าลูกค้าจะต้องการเปลี่ยน flow

## ลำดับแผนพัฒนาแนะนำ

### Phase 1: ทำ AI คำนวณแคลให้ใช้งานจริง

เป้าหมาย: ผู้ใช้ถ่าย/อัปโหลดรูปอาหาร แล้วได้ค่า calories/protein ที่บันทึกได้จริง

งาน:
1. ตั้ง `GEMINI_API_KEY` ใน Vercel Environment Variables
2. Deploy และทดสอบ `/api/analyze-food` บน Vercel จริง
3. ทดสอบด้วยรูปอาหารหลายแบบ: จานเดียว, หลายเมนู, เครื่องดื่ม, ภาพไม่ใช่อาหาร
4. เพิ่ม fallback/error message ที่เข้าใจง่าย
5. บันทึก field เพิ่มใน `foodLogs`: `source`, `analyzedBy`, `note`
6. ใช้ `calorieGoal` จาก profile ในหน้า Food
7. เพิ่ม validation input ก่อน save

Definition of Done:
- รูปอาหารทั่วไปวิเคราะห์สำเร็จ
- ผู้ใช้แก้ค่าก่อนบันทึกได้
- บันทึกลง Firestore แล้ว summary วันนี้อัปเดต
- API key ไม่อยู่ใน client
- error จาก API แสดงใน UI แบบเข้าใจได้

### Phase 2: Mission Engine ตรวจจากข้อมูลจริง

เป้าหมาย: ภารกิจไม่ได้กดรับแต้มฟรี แต่ตรวจ progress จาก food/health logs จริง

งาน:
1. ออกแบบ schema mission ให้ชัด: `type`, `target`, `points`, `active`
2. เพิ่ม progress calculation ในหน้า missions
3. ทำภารกิจพื้นฐานก่อน:
   - บันทึกอาหารครบ 3 มื้อ
   - ถ่ายรูปอาหาร 1 มื้อ
   - ชั่งน้ำหนักวันนี้
   - บันทึกสุขภาพ 5 ครั้ง
4. แสดง progress เช่น `2/3`
5. ปุ่ม claim แสดงเฉพาะเมื่อทำครบ
6. กัน claim ซ้ำด้วย transaction/batch
7. ปิดหรือซ่อน mission ที่ยังไม่มี data source เช่น water/streak จนกว่าจะพร้อม

Definition of Done:
- ภารกิจคำนวณจากข้อมูลจริง
- รับแต้มได้เฉพาะ mission ที่สำเร็จ
- รับซ้ำวันเดียวกันไม่ได้
- leaderboard อัปเดตหลัง claim

### Phase 3: Security Rules + Server-Side Critical Logic

เป้าหมาย: ลดช่องโกงคะแนน/แก้ wallet/แก้ leaderboard จาก client

งาน:
1. เขียน Firestore Rules ใหม่
2. จำกัด user profile update เฉพาะ field ที่อนุญาต
3. ป้องกัน user แก้ `points`, `wallet`, `role`
4. ย้าย mission claim และ reward redemption logic ไป API route หรือ Cloud Function ถ้าต้อง production จริง
5. ทดสอบ rules ทุก collection

Definition of Done:
- user แก้คะแนน/wallet เองไม่ได้
- mission completion เขียนมั่วไม่ได้
- admin write ถูกจำกัดด้วย UID
- reward redemption ไม่ทำให้ wallet ติดลบ

### Phase 4: Admin Workflow ให้จบ

เป้าหมาย: admin จัดการ reward/redemption ได้ครบในหน้าเว็บ

งาน:
1. เพิ่มปุ่ม approve/reject/delivered ใน redemptions
2. เพิ่ม edit reward/mission
3. เพิ่ม filter ตาม status
4. เพิ่ม search users/redemptions
5. ปรับ table ให้ใช้งานง่ายบน desktop

Definition of Done:
- admin จัดการ redemption ได้โดยไม่ต้องเข้า Firestore Console
- reward/mission แก้ไขได้
- มีสถานะและประวัติชัดเจน

### Phase 5: UX, Dashboard, Reports

เป้าหมาย: ทำให้แอปดูเป็น product มากขึ้น

งาน:
1. Dashboard กราฟสุขภาพย้อนหลัง
2. Export PDF/CSV
3. ปรับข้อความ UI ที่ encoding เพี้ยน
4. ทำ loading/empty/error states ให้ครบ
5. ปรับ shared nav ให้ไม่ต้อง copy ซ้ำทุกหน้า
6. รองรับ mobile safe area และ responsive edge cases

## Backlog เพิ่มเติม

- Forgot password
- LINE LIFF + LINE UID binding
- Push notification ผ่าน LINE Messaging API
- Water tracking
- Streak tracking
- Firebase Storage สำหรับ avatar/reward image
- Unit/integration tests สำหรับ API route และ mission calculation
- Monitoring/logging สำหรับ Gemini API errors

## Priority ปัจจุบัน

ลำดับที่ควรทำตอนนี้:
1. AI calories production test บน Vercel
2. ผูก `calorieGoal` เข้าหน้า Food
3. เพิ่ม `source` ให้ food logs เพื่อใช้กับ mission
4. Mission engine ตรวจจากข้อมูลจริง
5. Firestore Security Rules
6. Admin redemption workflow
7. ฟีเจอร์ใหม่ตาม requirement ถัดไป


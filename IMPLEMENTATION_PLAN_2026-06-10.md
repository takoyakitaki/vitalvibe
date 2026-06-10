# VitalVibe Improvement Plan - 2026-06-10

## สรุปภาพรวมที่พบจากโค้ดปัจจุบัน

- โปรเจกต์เป็น Vanilla HTML/JS ใช้ Firebase Auth, Firestore และ Vercel API route
- หน้าอาหารมี calorie bar, บันทึกอาหาร manual/AI และใช้ `users/{uid}.calorieGoal` แล้ว แต่ยังเก็บ nutrition แค่ `calories` และ `protein`
- API `api/analyze-food.js` เรียก Gemini แล้ว แต่ prompt/schema ยังคืนเฉพาะ calories/protein
- หน้าสุขภาพมี weight/sugar/pressure และ history ล่าสุด แต่ยังไม่มีส่วนสูง, BMI popup, health interpretation, filter รายวัน/เดือน/ปี หรือแก้ไขย้อนหลัง
- หน้า reminders เก็บแจ้งเตือนยา/หมอนัดใน Firestore แต่ยังไม่มี backend สำหรับ LINE message เมื่อถึงเวลา
- หน้า missions ยังให้กดรับแต้มได้โดยไม่ตรวจข้อมูลจริง, ยังมี quest น้ำและ leaderboard
- ระบบแต้มปัจจุบันกันรับซ้ำด้วย `missionCompletions` ตาม `date` อยู่แล้ว จึงถือว่า reset วันใหม่เมื่อ date เปลี่ยน
- ระบบ LINE ยังเป็น placeholder/LIFF config ยังไม่มี LINE UID binding ที่มั่นคง

## หลักการออกแบบรอบนี้

1. เก็บความลับ LINE/Gemini ไว้ฝั่ง server เท่านั้น
2. เพิ่ม field ใหม่แบบ backward compatible เพื่อไม่ทำให้ข้อมูลเดิมพัง
3. ให้ mission ตรวจจากข้อมูลจริงก่อนเปิดปุ่มรับแต้ม
4. ตัด leaderboard และ water quest ออกตาม requirement
5. ทำ UI แบบ mobile-first ตามโครงเดิม ไม่รื้อ layout ใหญ่

## Phase 1: Food, Nutrition, Calorie Bar

งานที่จะทำ:
- เพิ่ม nutrition fields ใน food logs:
  - `calories`
  - `carbs`
  - `protein`
  - `fat`
  - `fiber`
  - `sodium`
- ปรับ Gemini prompt/API ให้คืน JSON ครบทุก field
- ปรับ AI result form ให้ผู้ใช้แก้ค่าทุก field ก่อนบันทึก
- ปรับ manual form ให้ผู้ใช้เลือกกรอก nutrition ได้ โดย calories/protein ยังใช้ง่ายเหมือนเดิม
- เพิ่ม calorie goal editor เล็ก ๆ ที่ calorie UI เพื่อกำหนดเป้าหมายรายวันได้จากหน้าอาหาร
- เพิ่มปุ่มประวัติด้านบนขวาของ calorie bar
- เพิ่ม daily calorie history modal:
  - ดูยอดรวมแคลอรี่รายวันย้อนหลัง
  - เลือกวันเพื่อดูรายการ
  - แก้ไขรายการย้อนหลังได้
- เพิ่มสถานะเมื่อแคลอรี่วันนี้ถึง/เกินเป้า
- เพิ่ม hook เรียก LINE notification เมื่อวันนี้ถึงเป้าเป็นครั้งแรก โดยเก็บ marker ใน `calorieNotifications/{uid_date}`

ข้อจำกัด:
- LINE message จะส่งได้จริงเมื่อมี `LINE_CHANNEL_ACCESS_TOKEN` และ user มี `lineUserId`/`lineUid` ที่ส่ง push ได้
- ถ้ายังไม่มี LINE UID จะบันทึก marker/แสดง UI ได้ แต่ push LINE จะไม่สำเร็จ

## Phase 2: Health Logs

งานที่จะทำ:
- เพิ่ม field ส่วนสูงในหมวดน้ำหนัก เพื่อคำนวณ BMI
- เพิ่ม interpretation popup หลังบันทึก:
  - weight + height: BMI ต่ำ/ปกติ/เกิน/อ้วน
  - pressure: ความดันปกติ/เริ่มสูง/สูง
  - sugar: แปลผลตาม context แบบ conservative
- บันทึก `interpretation` ลง `healthLogs`
- เพิ่ม filter ประวัติสุขภาพแบบรายวัน/เดือน/ปี
- แสดงวันเวลาเต็มของแต่ละ log
- เพิ่มแก้ไขย้อนหลังสำหรับ health log

## Phase 3: Reminders + LINE Message

งานที่จะทำ:
- เพิ่ม API route สำหรับส่ง LINE push message
- เพิ่ม API route/cron handler สำหรับตรวจ reminders ที่ถึงเวลาแล้ว
- เพิ่ม `vercel.json` cron schedule เพื่อเรียกตรวจเป็นรอบ ๆ
- เมื่อถึงเวลากินยาและยัง active:
  - ส่ง LINE message
  - mark `notifiedAt`
  - ไม่ส่งซ้ำถ้ามี `notifiedAt` แล้ว

ข้อจำกัด:
- ต้องมี Firebase Admin credentials หรือ service account env สำหรับ server-side query/update Firestore
- ถ้ายังไม่มี จะเตรียม route และ fail ด้วย error ที่อ่านง่าย

## Phase 4: Missions

งานที่จะทำ:
- ตัด quest น้ำออก
- ตัด leaderboard UI และ Firestore write ที่เกี่ยวข้องออก
- ออกแบบ default missions ที่ตรวจง่าย:
  - บันทึกอาหาร 3 มื้อ: ตรวจ unique meal วันนี้จาก `foodLogs`
  - ใช้ Gemini วิเคราะห์อาหาร 1 ครั้ง: ตรวจ `source === "ai"` และ `analyzedBy === "gemini"`
  - บันทึกน้ำหนักวันนี้: ตรวจ `healthLogs.type === "weight"`
  - บันทึกสุขภาพ 3 ครั้ง: ตรวจจำนวน health logs วันนี้
  - บันทึกอาหารไม่เกินเป้าหมาย: ตรวจ total calories <= goal และมี food log อย่างน้อย 1 รายการ
- เพิ่ม progress เช่น `2/3`
- ปุ่มรับแต้มกดได้เฉพาะเมื่อครบเงื่อนไข
- claim ยังใช้ `missionCompletions` date เดิมเพื่อ reset รายวัน

## Phase 5: Verification

ตรวจสอบ:
- syntax HTML/JS แบบ lightweight
- run local static/server ถ้าจำเป็น
- ทดสอบ flow หลักบน browser ถ้าเปิด local target ได้
- สรุป env vars ที่ต้องตั้งบน Vercel:
  - `GEMINI_API_KEY`
  - `LINE_CHANNEL_ACCESS_TOKEN`
  - Firebase Admin/service account vars สำหรับ cron/reminder/calorie notification


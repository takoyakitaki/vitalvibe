# VitalVibe - Notion Task List

Copy this into Notion AI and ask it to convert the list into a project database with these columns:

- Module/Page
- Feature
- Status
- Priority
- Next Action
- Client Note

## Task List

| Module/Page | Feature | Status | Priority | Next Action | Client Note |
| --- | --- | --- | --- | --- | --- |
| Login / Register | สมัครสมาชิกและเข้าสู่ระบบด้วย Firebase Email/Password | เสร็จแล้ว | Medium | เพิ่ม forgot password และปรับ session ให้เชื่อ Firebase Auth เป็นหลัก | ระบบล็อกอินพื้นฐานพร้อมใช้งานแล้ว |
| Food Page | บันทึกอาหารเอง, ถ่าย/อัปโหลดรูปอาหาร, วิเคราะห์แคลอรี่ด้วย Gemini, บันทึกลง Firebase | เสร็จแล้ว | High | ปรับ Gemini model, เพิ่ม loading/error state, เพิ่ม validation ข้อมูลอาหาร | ฟีเจอร์บันทึกอาหารและ AI วิเคราะห์อาหารใช้งานได้แล้ว |
| Health Page | บันทึกน้ำหนัก, น้ำตาล, ความดัน, แสดงข้อมูลล่าสุดและประวัติย้อนหลัง | เสร็จแล้ว | Medium | เพิ่มกราฟย้อนหลัง 7/30/90 วัน และเพิ่ม note ต่อรายการ | ระบบบันทึกสุขภาพพื้นฐานพร้อมใช้งานแล้ว |
| Reminders Page | ตั้งแจ้งเตือนกินยาและหมอนัด พร้อมวันที่ เวลา หมายเหตุ และสถานะเสร็จแล้ว | เสร็จแล้วระดับ MVP | High | เพิ่ม push notification/LINE notification เมื่อถึงเวลา แม้ผู้ใช้ไม่ได้เปิดหน้าเว็บ | ผู้ใช้ตั้งกำหนดเวลากินยาและหมอนัดได้แล้ว |
| Profile Page | แสดงโปรไฟล์, wallet, total points, แก้ชื่อ, แก้เป้าหมายแคลอรี่, เปลี่ยน avatar | เสร็จแล้ว | Medium | ย้ายรูป avatar ไป Firebase Storage แทนการเก็บ base64 | ผู้ใช้จัดการข้อมูลโปรไฟล์และเป้าหมายส่วนตัวได้แล้ว |
| Rewards / Redeem | แสดงรายการรางวัล, แลกของรางวัลด้วย wallet, บันทึกประวัติ redemption | ต้องพัฒนาต่อ | High | เพิ่ม workflow ฝั่ง admin สำหรับ approve, reject, delivered | ผู้ใช้แลกรางวัลได้แล้ว แต่ฝั่งจัดการสถานะรางวัลยังต้องพัฒนาต่อ |
| Missions Page | แสดงภารกิจ, รับแต้ม, leaderboard รายสัปดาห์ | ต้องพัฒนาต่อ | High | ทำ mission engine ให้ตรวจจากข้อมูลจริง เช่น บันทึกอาหารครบ 3 มื้อ, ถ่ายรูปอาหาร, ชั่งน้ำหนัก | หน้าภารกิจมี UI แล้ว แต่เงื่อนไขภารกิจยังต้องเชื่อมกับข้อมูลจริง |
| Leaderboard | แสดงอันดับคะแนนรายสัปดาห์ | ต้องพัฒนาต่อ | Medium | ปรับการคิดคะแนนให้มาจากภารกิจที่ยืนยันแล้วเท่านั้น | ระบบอันดับมีแล้ว แต่ควรผูกกับระบบภารกิจที่ปลอดภัยขึ้น |
| Admin Panel | ดูข้อมูล users, food logs, health logs, missions, rewards, redemptions, leaderboard | ต้องพัฒนาต่อ | High | เพิ่มจัดการ reminders, redemption status, edit, search, filter, pagination | Admin ดูข้อมูลและจัดการเบื้องต้นได้แล้ว |
| Firebase Security | จำกัดสิทธิ์อ่าน/เขียนข้อมูลของแต่ละ user | ต้องปรับปรุงความปลอดภัย | High | เพิ่ม rules สำหรับ reminders และทดสอบ rules ทุก collection | ต้องทำก่อนเปิดใช้งานกับผู้ใช้จริงจำนวนมาก |
| Points / Wallet Security | ระบบแต้มและ wallet | ต้องปรับปรุงความปลอดภัย | High | ย้ายการให้แต้ม/แลกรางวัลไป API route หรือ Cloud Function | ระบบแต้มใช้งานได้ระดับ MVP แต่ควรเพิ่มความปลอดภัยก่อน production |
| LINE LIFF Integration | LINE Login, LIFF init, get LINE profile, bind LINE UID กับ Firebase user | ยังไม่เริ่ม | Medium | เชื่อม LIFF SDK และออกแบบ flow ผูกบัญชี LINE | มีการเตรียม config แล้ว แต่ยังไม่ได้เชื่อม LINE จริง |
| Water Tracking | บันทึกการดื่มน้ำ | ยังไม่เริ่ม | Low | เพิ่มฟอร์มบันทึกน้ำและเชื่อมกับ mission ดื่มน้ำ | เป็นฟีเจอร์เสริมสำหรับ gamification |
| Streak Tracking | นับจำนวนวันที่ผู้ใช้บันทึกข้อมูลต่อเนื่อง | ยังไม่เริ่ม | Medium | คำนวณ streak จาก activity logs | ช่วยเพิ่ม engagement ให้ผู้ใช้กลับมาใช้งานทุกวัน |
| Dashboard / Charts | กราฟแคลอรี่, น้ำหนัก, น้ำตาล, ความดันย้อนหลัง | ยังไม่เริ่ม | Medium | เพิ่ม dashboard ราย 7 วัน / 30 วัน / 90 วัน | ช่วยให้ลูกค้าเห็นภาพรวมสุขภาพย้อนหลัง |
| Export Report | Export PDF/CSV รายงานสุขภาพ | ยังไม่เริ่ม | Low | ออกแบบรูปแบบรายงานสำหรับผู้ใช้หรือผู้ดูแล | เป็นฟีเจอร์เสริมสำหรับการนำข้อมูลไปใช้นอกระบบ |
| Testing / Monitoring | ทดสอบ API, rules, mission, logging error | ยังไม่เริ่ม | Medium | เพิ่ม test checklist และระบบ log สำหรับ production | ช่วยลดความเสี่ยงก่อนเปิดใช้งานจริง |

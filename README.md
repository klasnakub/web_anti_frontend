# Steam Guard Dashboard - JWT Authentication System

## ระบบ Authentication ที่ปรับปรุงใหม่

ระบบนี้ได้รับการปรับปรุงให้มีการตรวจสอบ JWT token ที่สมบูรณ์แบบ โดยจะตรวจสอบวันหมดอายุของ token และจัดการการเข้าถึงหน้า Dashboard อย่างปลอดภัย

## ฟีเจอร์ใหม่

### 1. การตรวจสอบ JWT Token
- ตรวจสอบวันหมดอายุของ token ทุกครั้งที่เข้าหน้า Dashboard
- ถ้า token หมดอายุ จะ redirect ไปหน้า Login โดยอัตโนมัติ
- แสดงสถานะ token ในหน้า Dashboard แบบ real-time

### 2. ฟังก์ชัน Authentication
- `validateAuth()` - ตรวจสอบการ login และ token
- `isTokenExpired()` - ตรวจสอบวันหมดอายุของ token
- `makeAuthenticatedRequest()` - เรียก API พร้อม token
- `displayTokenInfo()` - แสดงข้อมูล token ในหน้า Dashboard

### 3. การจัดการ Token
- ตรวจสอบ token ทุก 5 นาที
- อัพเดทสถานะ token ทุก 1 นาที
- แสดงคำเตือนเมื่อ token จะหมดอายุใน 10 นาที

## การใช้งาน

### 1. การ Login
```javascript
// ระบบจะเก็บ token ใน localStorage หลังจาก login สำเร็จ
localStorage.setItem('access_token', 'your-jwt-token');
```

### 2. การเรียก API
```javascript
// ใช้ฟังก์ชัน makeAuthenticatedRequest สำหรับเรียก API
const response = await makeAuthenticatedRequest('https://api.example.com/data', {
  method: 'GET'
});
```

### 3. การตรวจสอบ Token
```javascript
// ตรวจสอบว่า token ยังใช้งานได้หรือไม่
if (validateAuth()) {
  // Token ยังใช้งานได้
} else {
  // Token หมดอายุหรือไม่มี token
}
```

## ไฟล์ที่เกี่ยวข้อง

### `auth.js`
ไฟล์ utility สำหรับจัดการ authentication ทั้งหมด

### `index.html`
หน้า Dashboard ที่มีการตรวจสอบ token ก่อนแสดงผล

### `login.js`
หน้า Login ที่เก็บ token หลังจาก login สำเร็จ

## การตั้งค่า

### 1. Backend API
หากต้องการเชื่อมต่อกับ backend API จริง ให้แก้ไข URL ในฟังก์ชัน `makeAuthenticatedRequest`:

```javascript
const response = await makeAuthenticatedRequest('https://your-backend-api.com/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### 2. Token Expiration
สามารถปรับแต่งการตรวจสอบ token ได้ใน `auth.js`:

```javascript
// ตรวจสอบ token ทุก 5 นาที
setInterval(() => {
  if (!validateAuth()) {
    console.log('Token validation failed');
  }
}, 5 * 60 * 1000);
```

## การ Debug

### 1. ดูข้อมูล Token
เปิด Developer Console (F12) เพื่อดูข้อมูล token:
- Username
- เวลาที่สร้าง token
- เวลาที่ token จะหมดอายุ
- เวลาที่เหลือ

### 2. สถานะ Token ในหน้า Dashboard
- ✅ สีเขียว: Token ยังใช้งานได้
- ⚠️ สีเหลือง: Token จะหมดอายุใน 10 นาที
- ❌ สีแดง: Token หมดอายุแล้ว

## ความปลอดภัย

1. **Token Validation**: ตรวจสอบ token ทุกครั้งที่เข้าหน้า Dashboard
2. **Automatic Logout**: ออกจากระบบอัตโนมัติเมื่อ token หมดอายุ
3. **Secure API Calls**: ใช้ token ในการเรียก API ทุกครั้ง
4. **Token Cleanup**: ลบ token ที่หมดอายุออกจาก localStorage

## การแก้ไขปัญหา

### Token หมดอายุบ่อย
- ตรวจสอบการตั้งค่า expiration time ใน backend
- ปรับแต่งการ refresh token หากจำเป็น

### ไม่สามารถเข้าหน้า Dashboard ได้
- ตรวจสอบว่า login สำเร็จหรือไม่
- ตรวจสอบ token ใน localStorage
- ดู error ใน Developer Console

### API calls ไม่ทำงาน
- ตรวจสอบว่า token ยังใช้งานได้หรือไม่
- ตรวจสอบ URL ของ API
- ดู response status code

## หมายเหตุ

- ระบบนี้ใช้ client-side validation สำหรับ JWT token
- สำหรับ production ควรมีการ server-side validation เพิ่มเติม
- ควรใช้ HTTPS ใน production environment 
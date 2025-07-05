# การแก้ไขปัญหา API 403 Forbidden

## ปัญหาที่พบ
- API calls ได้รับ response 403 Forbidden
- ไม่สามารถเรียก API ได้หลังจากเพิ่มการตรวจสอบ JWT Token

## วิธีการแก้ไขปัญหา

### 1. ตรวจสอบ Token ใน Browser Console

เปิด Developer Console (F12) และดูข้อมูล token:

```javascript
// เรียกฟังก์ชัน debug ใน console
debugToken()
```

ข้อมูลที่ควรตรวจสอบ:
- Token มีอยู่จริงหรือไม่
- Token หมดอายุหรือไม่
- Token format ถูกต้องหรือไม่

### 2. ทดสอบ API Connection

คลิกปุ่ม "Test API" ในหน้า Dashboard หรือเรียกฟังก์ชันใน console:

```javascript
// ทดสอบการเชื่อมต่อ API
testAPIConnection()
```

ฟังก์ชันนี้จะ:
- ทดสอบ API โดยไม่ใช้ authentication
- ทดสอบ API โดยใช้ authentication
- แสดงผลลัพธ์ใน console

### 3. ตรวจสอบ Request Headers

ในฟังก์ชัน `makeAuthenticatedRequest` จะแสดง:
- URL ที่เรียก
- Headers ที่ส่งไป
- Response status

### 4. สาเหตุที่เป็นไปได้ของ 403 Forbidden

#### A. Token ไม่ถูกต้อง
- Token หมดอายุ
- Token format ไม่ถูกต้อง
- Token ไม่ตรงกับที่ server ต้องการ

#### B. Server-side Issues
- Server ไม่ยอมรับ Bearer token
- Server ต้องการ header อื่นเพิ่มเติม
- CORS issues

#### C. Permission Issues
- User ไม่มีสิทธิ์เข้าถึง API endpoint
- Role-based access control

### 5. วิธีการแก้ไข

#### ขั้นตอนที่ 1: ตรวจสอบ Token
```javascript
// ตรวจสอบ token ใน localStorage
console.log('Token:', localStorage.getItem('access_token'))
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'))
```

#### ขั้นตอนที่ 2: Login ใหม่
หาก token มีปัญหา ให้ login ใหม่:
1. ไปที่หน้า login
2. Login ใหม่
3. ตรวจสอบ token ใหม่

#### ขั้นตอนที่ 3: ตรวจสอบ API Endpoint
ตรวจสอบว่า API endpoint ถูกต้อง:
- URL: `https://web-anti-backend-8286388439.asia-southeast1.run.app/leagues`
- Method: GET, POST, PUT, DELETE
- Headers: `Authorization: Bearer <token>`

#### ขั้นตอนที่ 4: ทดสอบด้วย Postman/curl
ทดสอบ API ด้วยเครื่องมืออื่น:

```bash
# ทดสอบโดยไม่ใช้ authentication
curl -X GET "https://web-anti-backend-8286388439.asia-southeast1.run.app/leagues" \
  -H "accept: application/json"

# ทดสอบโดยใช้ authentication
curl -X GET "https://web-anti-backend-8286388439.asia-southeast1.run.app/leagues" \
  -H "accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. การ Debug เพิ่มเติม

#### ตรวจสอบ Network Tab
1. เปิด Developer Tools
2. ไปที่ Network tab
3. เรียก API
4. ตรวจสอบ request/response

#### ตรวจสอบ Console Logs
ดู console logs สำหรับ:
- Request details
- Response status
- Error messages

### 7. การแก้ไขชั่วคราว

หากยังไม่สามารถแก้ไขได้ สามารถใช้การเรียก API แบบเดิม:

```javascript
// แทนที่ makeAuthenticatedRequest ด้วย fetch ปกติ
const response = await fetch('https://web-anti-backend-8286388439.asia-southeast1.run.app/leagues', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

### 8. ติดต่อ Support

หากยังไม่สามารถแก้ไขได้ กรุณาเตรียมข้อมูลต่อไปนี้:
- Console logs
- Network tab screenshots
- Token debug information
- API response details

## หมายเหตุ

- ฟังก์ชัน debug จะแสดงข้อมูลใน console เท่านั้น
- ข้อมูล token ไม่ควรแชร์กับผู้อื่น
- หาก token หมดอายุ ให้ login ใหม่ 
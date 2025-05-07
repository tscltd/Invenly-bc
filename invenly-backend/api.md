## 1. USER



✅ JSON Mẫu: Tạo người dùng mới (POST /api/users)
```json
{
  "username": "admin01",
  "fullname": "Nguyễn Văn Quản Trị",
  "password": "admin123",
  "roles": ["ADMIN"]
}
```
✅ JSON Mẫu: Cập nhật người dùng (PUT /api/users/:id)
Nếu không đổi mật khẩu, có thể bỏ password.

```json
{
  "fullname": "Nguyễn Văn A (đã đổi tên)",
  "password": "newpassword123",
  "roles": ["KIEMKE", "MODERATOR"]
}```

✅ JSON Mẫu: Phản hồi khi gọi GET /api/users
```json
[
  {
    "_id": "66505a32ab12345c1a2b3c4d",
    "username": "admin01",
    "fullname": "Nguyễn Văn Quản Trị",
    "roles": ["ADMIN"],
    "createDate": "2024-05-06T12:00:00.000Z",
    "__v": 0
  },
  {
    "_id": "66505a9fab12345c1a2b3c4e",
    "username": "thu_kho01",
    "fullname": "Trần Thị Kho",
    "roles": ["KIEMKE"],
    "createDate": "2024-05-06T12:10:00.000Z",
    "__v": 0
  }
]
```
✅ JSON Mẫu: Phản hồi GET /api/users/:id

```json
{
  "_id": "66505a9fab12345c1a2b3c4e",
  "username": "thu_kho01",
  "fullname": "Trần Thị Kho",
  "roles": ["KIEMKE"],
  "createDate": "2024-05-06T12:10:00.000Z",
  "__v": 0
}
```
✅ JSON Mẫu: Phản hồi khi tạo user thành công

```json
{
  "message": "Tạo user thành công"
}
`

✅ JSON Mẫu: Phản hồi khi cập nhật user
```json
{
  "message": "Cập nhật thành công",
  "user": {
    "_id": "66505a9fab12345c1a2b3c4e",
    "username": "thu_kho01",
    "fullname": "Trần Thị Kho (mới)",
    "roles": ["MODERATOR"],
    "createDate": "2024-05-06T12:10:00.000Z",
    "__v": 0
  }
}
```

## 2. Auth

```json
POST /api/auth/signin
---
{
  "username": "admin01",
  "password": "admin123"
}
```

```json
{
  "message": "Login successful",
  "user": {
    "id": "66505a9fab12345c1a2b3c4e",
    "fullname": "Nguyễn Văn Quản Trị",
    "username": "admin01",
    "roles": ["ADMIN"],
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

```json
// Trường hợp sai tài khoản
{
  "message": "User not found. Please contact administrator."
}
```

```json
// Trường hợp sai mật khẩu
{
  "message": "Invalid username or password."
}
```

---

```json

POST /api/auth/signout
---
{
  "message": "You have been signed out!"
}
```

## Sản phẩm

```bash
POST /api/items
```

```json
{
  "name": "Mũ bảo hộ ABC",
  "code": "SP001",
  "category": "vat_pham",
  "description": "Mũ bảo hộ tiêu chuẩn cho công nhân",
  "totalQuantity": 100,
  "remainingQuantity": 100,
  "minThreshold": 10,
  "imageUrl": "https://firebase.storage/image1.jpg",
  "manager": "Nguyễn Văn A",
  "source": "Công ty Bảo Hộ XYZ"
}
```

```json
{
  "message": "Tạo vật phẩm thành công",
  "item": {
    "_id": "665061c9c2a45d7f89e08aa3",
    "name": "Mũ bảo hộ ABC",
    "code": "SP001",
    "category": "vat_pham",
    ...
  }
}
```

---

```bash
GET /api/items
```

```json
[
  {
    "_id": "665061c9c2a45d7f89e08aa3",
    "name": "Mũ bảo hộ ABC",
    "code": "SP001",
    "category": "vat_pham",
    ...
  }
]
```

---

```bash
GET /api/items/:id
```

```json
{
  "_id": "665061c9c2a45d7f89e08aa3",
  "name": "Mũ bảo hộ ABC",
  "code": "SP001",
  "category": "vat_pham",
  ...
}
```

---

```bash
PUT /api/items/:id
```

```json
{
  "name": "Mũ bảo hộ DEF (đã cập nhật)",
  "totalQuantity": 120,
  "remainingQuantity": 100,
  "description": "Loại mũ mới thay thế"
}
```

```json
{
  "message": "Cập nhật thành công",
  "item": {
    "_id": "665061c9c2a45d7f89e08aa3",
    "name": "Mũ bảo hộ DEF (đã cập nhật)",
    ...
  }
}
```

---

```bash
DELETE /api/items/:id
```

```json
{
  "message": "Đã xoá vật phẩm"
}
```



##
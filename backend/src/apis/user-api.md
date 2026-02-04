# User APIs

Base URL: `/api/v1/users`

All API endpoints return responses in the following format:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Authentication

Most endpoints require authentication via JWT token in cookies or Authorization header.

---

## 1. User Registration

**Endpoint:** `POST /register`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `username` (string, required): Unique username
- `email` (string, required): Valid email address
- `fullname` (string, required): Full name
- `password` (string, required): Password (min length not specified)
- `avatar` (file, required): User avatar image file

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -F "username=john_doe" \
  -F "email=john@example.com" \
  -F "fullname=John Doe" \
  -F "password=mypassword123" \
  -F "avatar=@/path/to/avatar.jpg"
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "64f1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "avatar": "https://cloudinary.com/avatar_url.jpg",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "User registered successfully",
  "success": true
}
```

**Error Responses:**
- `400`: All fields are required / User already exists / Avatar is required
- `500`: Something went wrong while uploading file on cloudinary / Something went wrong while creating user in DB

---

## 2. User Login

**Endpoint:** `POST /login`

**Authentication:** Not required

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "mypassword123"
  }'
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "avatar": "https://cloudinary.com/avatar_url.jpg",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "User logged in successfully",
  "success": true
}
```

**Error Responses:**
- `400`: All fields are required / Password incorrect
- `401`: User does not exist

**Note:** Sets `accessToken` and `refreshToken` cookies on successful login.

---

## 3. User Logout

**Endpoint:** `GET /logout`

**Authentication:** Required (JWT token)

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/v1/users/logout \
  -H "Cookie: accessToken=your_jwt_token_here"
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully",
  "success": true
}
```

**Note:** Clears `accessToken` and `refreshToken` cookies.

---

## 4. Refresh Access Token

**Endpoint:** `GET /refresh-token`

**Authentication:** Not required (uses refresh token from cookie or body)

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/v1/users/refresh-token \
  -H "Cookie: refreshToken=your_refresh_token_here"
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "accessToken": "new_access_token_here",
    "refreshToken": "new_refresh_token_here"
  },
  "message": "Refreshed access token successfully",
  "success": true
}
```

**Error Responses:**
- `401`: Unauthorized Request / Invalid Refresh Token / Refresh token expired or used
- `505`: Something went wrong refreshing access token

---

## 5. Reset Password

**Endpoint:** `PATCH /reset-password`

**Authentication:** Required (JWT token)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "newPassword": "string"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/users/reset-password \
  -H "Cookie: accessToken=your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "newpassword123"
  }'
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": "Password reset successful",
  "message": "Password reset successful",
  "success": true
}
```

**Error Responses:**
- `401`: New password is required

---

## 6. Get Current User Profile

**Endpoint:** `GET /`

**Authentication:** Required (JWT token)

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/v1/users/ \
  -H "Cookie: accessToken=your_jwt_token_here"
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "avatar": "https://cloudinary.com/avatar_url.jpg",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "User data fetched successfully",
  "success": true
}
```

**Error Responses:**
- `401`: Token expired or used

---

## 7. Update User Avatar

**Endpoint:** `PATCH /update/avatar`

**Authentication:** Required (JWT token)

**Content-Type:** `multipart/form-data`

**Request Body:**
- `avatar` (file, required): New avatar image file

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/users/update/avatar \
  -H "Cookie: accessToken=your_jwt_token_here" \
  -F "avatar=@/path/to/new_avatar.jpg"
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "avatar": "https://cloudinary.com/new_avatar_url.jpg"
  },
  "message": "Avatar updated successfully",
  "success": true
}
```

**Error Responses:**
- `401`: New avatar is required
- `505`: Something went wrong while uploading file on cloudinary

---

## 8. Update User Details

**Endpoint:** `PATCH /update/detail`

**Authentication:** Required (JWT token)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "fullname": "string"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/users/update/detail \
  -H "Cookie: accessToken=your_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Updated Full Name"
  }'
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "64f1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "Updated Full Name",
    "avatar": "https://cloudinary.com/avatar_url.jpg",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:32:00.000Z"
  },
  "message": "User detail updated successfully",
  "success": true
}
```

**Error Responses:**
- `400`: New fullname is required
- `401`: User not found

# Admin User APIs

Base URL: `/api/v1/admin/users`

All API endpoints require admin authentication via JWT token and return responses in the following format:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Authentication

All endpoints require admin authentication via JWT token in cookies or Authorization header. The user must have `role: "admin"` to access these endpoints.

---

## 1. Change User Role

**Endpoint:** `PATCH /change-role`

**Authentication:** Required (Admin JWT token)

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "userId": "string",
  "role": "user" | "admin"
}
```

**Example Request:**
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/users/change-role \
  -H "Cookie: accessToken=your_admin_jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "64f1234567890abcdef12345",
    "role": "admin"
  }'
```

**Success Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "64f1234567890abcdef12345",
    "username": "john_doe",
    "email": "john@example.com",
    "fullname": "John Doe",
    "avatar": "https://cloudinary.com/avatar_url.jpg",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "message": "User role changed successfully",
  "success": true
}
```

**Error Responses:**
- `400`: All fields are required / User already has this role
- `404`: User not found

---

## 2. Get Users Dashboard

**Endpoint:** `GET /dashboard`

**Authentication:** Required (Admin JWT token)

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of users per page (default: 10)
- `name` (string, optional): Filter users by fullname (case-insensitive regex search)
- `role` (string, optional): Filter users by role ("user" or "admin")

**Example Requests:**

Get all users (default pagination):
```bash
curl -X GET http://localhost:3000/api/v1/admin/users/dashboard \
  -H "Cookie: accessToken=your_admin_jwt_token_here"
```

Get users with custom pagination:
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users/dashboard?page=2&limit=5" \
  -H "Cookie: accessToken=your_admin_jwt_token_here"
```

Search users by name:
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users/dashboard?name=john" \
  -H "Cookie: accessToken=your_admin_jwt_token_here"
```

Filter by role:
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users/dashboard?role=admin" \
  -H "Cookie: accessToken=your_admin_jwt_token_here"
```

Combine filters:
```bash
curl -X GET "http://localhost:3000/api/v1/admin/users/dashboard?page=1&limit=10&name=john&role=user" \
  -H "Cookie: accessToken=your_admin_jwt_token_here"
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "users": [
      {
        "_id": "64f1234567890abcdef12345",
        "username": "john_doe",
        "email": "john@example.com",
        "fullname": "John Doe",
        "avatar": "https://cloudinary.com/avatar_url.jpg",
        "role": "user",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "64f1234567890abcdef12346",
        "username": "jane_doe",
        "email": "jane@example.com",
        "fullname": "Jane Doe",
        "avatar": "https://cloudinary.com/avatar2_url.jpg",
        "role": "admin",
        "createdAt": "2024-01-15T10:25:00.000Z",
        "updatedAt": "2024-01-15T10:25:00.000Z"
      }
    ],
    "totalDocs": 25,
    "limit": 10,
    "page": 1,
    "totalPages": 3,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  },
  "message": "Users fetched successfully",
  "success": true
}
```

**Response Data Structure:**
- `users`: Array of user objects (password and refreshToken fields excluded)
- `totalDocs`: Total number of users matching the filters
- `limit`: Number of users per page
- `page`: Current page number
- `totalPages`: Total number of pages
- `pagingCounter`: Starting document number for current page
- `hasPrevPage`: Boolean indicating if there's a previous page
- `hasNextPage`: Boolean indicating if there's a next page
- `prevPage`: Previous page number (null if no previous page)
- `nextPage`: Next page number (null if no next page)

**Notes:**
- Password and refreshToken fields are automatically excluded from user data
- Name search is case-insensitive and uses regex matching
- Role filter accepts exact matches: "user" or "admin"
- Pagination uses mongoose-aggregate-paginate-v2 plugin
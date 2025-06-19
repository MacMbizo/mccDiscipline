
# API Documentation - MCC Discipline Tracker

## 🔗 API Overview

The MCC Discipline Tracker API provides RESTful endpoints for managing student behavior data, user authentication, and system analytics. All API calls require authentication via JWT tokens provided by Supabase Auth.

### Base URL
```
https://ajxzehsgroxpgfqnzlvz.supabase.co/rest/v1/
```

### Authentication
All API requests require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Response Format
All API responses follow a consistent format:
```json
{
  "data": {},
  "error": null,
  "count": null
}
```

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "teacher"
  }
}
```

### Logout
```http
POST /auth/v1/logout
Authorization: Bearer <jwt_token>
```

### Refresh Token
```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

## 👤 User Management

### Get User Profile
```http
GET /profiles?id=eq.{user_id}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "role": "teacher",
      "profile_image": "url",
      "last_login": "2024-01-15T10:30:00Z",
      "is_active": true,
      "notification_preferences": {
        "email_incidents": true,
        "sms_incidents": false,
        "push_incidents": true
      }
    }
  ]
}
```

### Update User Profile
```http
PATCH /profiles?id=eq.{user_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Smith",
  "notification_preferences": {
    "email_incidents": false,
    "sms_incidents": true
  }
}
```

### List Users (Admin Only)
```http
GET /profiles?select=id,name,role,is_active&order=name.asc
Authorization: Bearer <jwt_token>
```

## 👨‍🎓 Student Management

### Get Students
```http
GET /students?select=*&order=name.asc
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `grade=eq.Grade 10` - Filter by grade
- `needs_counseling=eq.true` - Filter students needing counseling
- `limit=50` - Limit results (default: 100)
- `offset=0` - Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "student_id": "ST001",
      "name": "Jane Smith",
      "grade": "Grade 10",
      "gender": "female",
      "boarding_status": "boarder",
      "behavior_score": 6.2,
      "needs_counseling": false,
      "parent_contacts": {
        "mother": {
          "name": "Mary Smith",
          "phone": "+1234567890",
          "email": "mary@example.com"
        }
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 150
}
```

### Get Student Details
```http
GET /students?id=eq.{student_id}&select=*
Authorization: Bearer <jwt_token>
```

### Create Student (Admin Only)
```http
POST /students
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "student_id": "ST002",
  "name": "New Student",
  "grade": "Grade 9",
  "gender": "male",
  "boarding_status": "day_scholar",
  "parent_contacts": {
    "father": {
      "name": "Parent Name",
      "phone": "+1234567890",
      "email": "parent@example.com"
    }
  }
}
```

### Update Student
```http
PATCH /students?id=eq.{student_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "grade": "Grade 11",
  "boarding_status": "boarder"
}
```

## 📝 Behavior Records

### Get Behavior Records
```http
GET /behavior_records?select=*,students(name,student_id)&order=created_at.desc
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `student_id=eq.{uuid}` - Filter by student
- `type=eq.incident` - Filter by type (incident/merit)
- `created_at=gte.2024-01-01` - Date range filter
- `status=eq.open` - Filter by status

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "type": "incident",
      "timestamp": "2024-01-15T14:30:00Z",
      "location": "Main School",
      "misdemeanor_id": "uuid",
      "offense_number": 1,
      "sanction": "1 hour manual labour",
      "description": "Disruption of lessons",
      "status": "open",
      "reported_by": "uuid",
      "students": {
        "name": "Jane Smith",
        "student_id": "ST001"
      }
    }
  ]
}
```

### Create Incident Record
```http
POST /behavior_records
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "student_id": "uuid",
  "type": "incident",
  "location": "Main School",
  "misdemeanor_id": "uuid",
  "description": "Student was disrupting the class",
  "sanction": "1 hour manual labour",
  "reported_by": "uuid"
}
```

### Create Merit Record
```http
POST /behavior_records
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "student_id": "uuid",
  "type": "merit",
  "merit_tier": "gold",
  "points": 3,
  "description": "Excellent project presentation",
  "reported_by": "uuid"
}
```

### Update Behavior Record
```http
PATCH /behavior_records?id=eq.{record_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "closed",
  "resolved_at": "2024-01-16T10:00:00Z"
}
```

## ⚖️ Misdemeanors and Sanctions

### Get Misdemeanors
```http
GET /misdemeanors?select=*&status=eq.active&order=location,name
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "location": "Main School",
      "name": "Dropping Litter",
      "sanctions": {
        "1st": "Picking up litter (15 minutes)"
      },
      "severity_level": 1,
      "category": "Minor Offense",
      "status": "active"
    }
  ]
}
```

### Get Misdemeanor by Location
```http
GET /misdemeanors?location=eq.Main School&status=eq.active
Authorization: Bearer <jwt_token>
```

### Create Misdemeanor (Admin Only)
```http
POST /misdemeanors
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "location": "Main School",
  "name": "New Offense Type",
  "sanctions": {
    "1st": "Warning",
    "2nd": "30 minutes manual labour",
    "3rd": "1 hour manual labour"
  },
  "severity_level": 2,
  "category": "Behavioral"
}
```

## 🔔 Notifications

### Get User Notifications
```http
GET /notifications?user_id=eq.{user_id}&order=created_at.desc
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `is_read=eq.false` - Filter unread notifications
- `type=eq.incident` - Filter by notification type
- `limit=20` - Limit results

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "incident",
      "message": "New incident reported for John Smith",
      "reference_id": "uuid",
      "reference_type": "behavior_record",
      "is_read": false,
      "created_at": "2024-01-15T14:30:00Z"
    }
  ]
}
```

### Mark Notification as Read
```http
PATCH /notifications?id=eq.{notification_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "is_read": true
}
```

### Create Notification
```http
POST /notifications
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "user_id": "uuid",
  "type": "merit",
  "message": "Merit points awarded to your child",
  "reference_id": "uuid",
  "reference_type": "behavior_record"
}
```

## 🏥 Counseling System

### Get Counseling Alerts
```http
GET /counseling_alerts?select=*,students(name,student_id)&is_resolved=eq.false
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "alert_type": "heat_score_threshold",
      "severity_level": "high",
      "description": "Student flagged for counseling due to behavioral concerns",
      "is_resolved": false,
      "created_at": "2024-01-15T14:30:00Z",
      "students": {
        "name": "Jane Smith",
        "student_id": "ST001"
      }
    }
  ]
}
```

### Resolve Counseling Alert
```http
PATCH /counseling_alerts?id=eq.{alert_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "is_resolved": true,
  "resolved_by": "uuid",
  "resolved_at": "2024-01-16T10:00:00Z"
}
```

## 👥 Shadow Parent System

### Get Shadow Parent Assignments
```http
GET /shadow_parent_assignments?select=*,students(name,student_id),profiles(name)&is_active=eq.true
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "student_id": "uuid",
      "shadow_parent_id": "uuid",
      "is_active": true,
      "assigned_at": "2024-01-01T00:00:00Z",
      "students": {
        "name": "Jane Smith",
        "student_id": "ST001"
      },
      "profiles": {
        "name": "Shadow Parent Name"
      }
    }
  ]
}
```

### Create Shadow Parent Assignment
```http
POST /shadow_parent_assignments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "student_id": "uuid",
  "shadow_parent_id": "uuid",
  "is_active": true
}
```

### Get Shadow Parent Dashboard Data
```http
GET /shadow_parent_dashboard?shadow_parent_id=eq.{user_id}
Authorization: Bearer <jwt_token>
```

## 📊 Analytics and Reporting

### Get System Analytics
```http
GET /rpc/get_system_analytics
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "total_incidents": 1250,
    "total_merits": 890,
    "average_heat_score": 6.2,
    "students_at_risk": 45,
    "monthly_change": {
      "incidents": 12,
      "merits": -5,
      "heat_score": -0.3,
      "at_risk": -3
    }
  }
}
```

### Get Student Analytics
```http
GET /rpc/get_student_analytics?student_id={uuid}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "current_heat_score": 7.5,
    "previous_heat_score": 8.1,
    "total_incidents": 5,
    "total_merits": 3,
    "monthly_trends": [
      {
        "month": "2024-01",
        "incidents": 2,
        "merits": 1,
        "heat_score": 6.8
      }
    ]
  }
}
```

### Calculate Heat Score
```http
GET /rpc/calculate_heat_score?student_uuid={uuid}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": 6.2
}
```

## 🔍 Search and Filtering

### Global Search
```http
GET /rpc/global_search?search_term=john
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "students": [
      {
        "id": "uuid",
        "name": "John Smith",
        "student_id": "ST001",
        "grade": "Grade 10"
      }
    ],
    "behavior_records": [
      {
        "id": "uuid",
        "description": "John was late to class",
        "student_name": "John Smith"
      }
    ]
  }
}
```

### Advanced Filtering
Multiple filters can be combined using query parameters:
```http
GET /behavior_records?student_id=eq.{uuid}&type=eq.incident&created_at=gte.2024-01-01&created_at=lte.2024-01-31
```

## 📄 Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error context"
    }
  }
}
```

### Common Error Codes
- `PGRST301`: JWT token expired or invalid
- `PGRST116`: Row not found
- `PGRST204`: Permission denied
- `PGRST000`: Generic database error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🔒 Rate Limiting

API requests are limited to:
- **Authenticated users**: 100 requests per minute
- **Anonymous users**: 10 requests per minute
- **Admin users**: 200 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

## 📝 Data Validation

### Required Fields
Each endpoint specifies required fields. Missing required fields will result in a 400 error.

### Data Types
- **UUID**: Standard UUID v4 format
- **Timestamp**: ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- **Email**: Valid email format
- **Phone**: International format recommended

### Field Constraints
- **Names**: 1-100 characters
- **Descriptions**: 1-1000 characters
- **Student ID**: Unique, alphanumeric
- **Heat Score**: 0.0-10.0 range

## 🔄 Real-time Subscriptions

### Behavior Records Subscription
```javascript
const subscription = supabase
  .channel('behavior-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'behavior_records'
  }, (payload) => {
    console.log('Behavior record updated:', payload);
  })
  .subscribe();
```

### Notifications Subscription
```javascript
const subscription = supabase
  .channel('user-notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('New notification:', payload);
  })
  .subscribe();
```

## 📊 Pagination

### Standard Pagination
```http
GET /students?limit=20&offset=40
```

### Count Estimation
Include total count in response:
```http
GET /students?limit=20&offset=40
Prefer: count=estimated
```

### Response with Count
```json
{
  "data": [...],
  "count": 150
}
```

## 🔍 Performance Optimization

### Selecting Specific Fields
```http
GET /students?select=id,name,grade,behavior_score
```

### Embedded Resources
```http
GET /behavior_records?select=*,students(name,student_id),profiles(name)
```

### Ordering and Indexing
Use indexed fields for better performance:
```http
GET /behavior_records?order=created_at.desc
GET /students?order=name.asc
```

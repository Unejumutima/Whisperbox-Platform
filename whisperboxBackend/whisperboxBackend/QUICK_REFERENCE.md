# Whisperbox Authentication - Quick Reference Card

## 🚀 Quick Start (3 Steps)

### 1. Configure Google OAuth2
```properties
# In application.properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_SECRET
app.allowed.domain=@yourschool.edu
```

### 2. Start Backend
```bash
.\mvnw.cmd spring-boot:run
```

### 3. Test Login
Open browser: `http://localhost:8080/oauth2/authorization/google`

---

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| **Initiate Login** | `http://localhost:8080/oauth2/authorization/google` |
| **Get Current User** | `http://localhost:8080/api/auth/me` |
| **Check Status** | `http://localhost:8080/api/auth/status` |
| **Google Console** | https://console.cloud.google.com/ |

---

## 💻 Frontend Integration

### Login Button
```html
<a href="http://localhost:8080/oauth2/authorization/google">
  Login with Google
</a>
```

### Handle Callback
```javascript
// Extract token from redirect URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
localStorage.setItem('jwt_token', token);
```

### API Request
```javascript
fetch('http://localhost:8080/api/whispers', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
  }
});
```

---

## 🧪 Testing with cURL

### Get Current User
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/auth/me
```

### Expected Response
```json
{
  "id": 1,
  "email": "student@yourschool.edu",
  "anonymousName": "Silent Panda",
  "role": "STUDENT"
}
```

---

## 📦 Components Overview

| Component | Purpose |
|-----------|---------|
| **SecurityConfig** | Main security setup, CORS, endpoints |
| **JwtUtil** | Generate & validate JWT tokens |
| **JwtAuthenticationFilter** | Validate JWT on each request |
| **OAuth2LoginSuccessHandler** | Generate JWT after Google login |
| **CustomOAuth2UserService** | Create/update user, validate domain |
| **AnonymousNameGenerator** | Generate random anonymous names |

---

## 🗄️ Database Check

```sql
-- View all users
SELECT id, email, anonymous_name, role FROM users;

-- Check recent logins
SELECT email, last_login_at FROM users ORDER BY last_login_at DESC;
```

---

## 🔐 How It Works

1. User clicks "Login with Google"
2. Google authenticates user
3. Backend validates email domain
4. Backend creates/updates user with anonymous name
5. Backend generates JWT token
6. Frontend receives token
7. Frontend includes token in all API requests
8. Backend validates token and allows access

---

## 🎯 Key Security Features

- ✅ Only school domain emails allowed
- ✅ Real identity stored securely
- ✅ Anonymous names for public display
- ✅ JWT tokens expire after 24 hours
- ✅ Stateless authentication
- ✅ CORS protection

---

## ⚙️ Configuration Properties

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=...
spring.security.oauth2.client.registration.google.client-secret=...

# Domain Restriction
app.allowed.domain=@yourschool.edu

# JWT Settings
jwt.secret=your-secret-key-change-in-production
jwt.expiration=86400000  # 24 hours in milliseconds

# Frontend
app.frontend.url=http://localhost:3000
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **redirect_uri_mismatch** | Add `http://localhost:8080/login/oauth2/code/google` to Google Console |
| **Invalid domain** | Check `app.allowed.domain` matches your email |
| **Token not working** | Check format: `Bearer <token>` |
| **CORS error** | Add frontend URL to `SecurityConfig` |
| **401 Unauthorized** | Token expired? Login again |

---

## 📚 Documentation Files

1. **AUTHENTICATION_SETUP.md** - Complete setup guide
2. **TESTING_GUIDE.md** - Comprehensive testing
3. **IMPLEMENTATION_SUMMARY.md** - Technical details
4. **QUICK_REFERENCE.md** - This file

---

## 🎓 For Presentation

### Demo Flow
1. Show login button
2. Click → redirects to Google
3. Authorize with school email
4. Redirected back with token
5. Make API call with token
6. Show anonymous name in response
7. Check database - real identity stored

### Key Points
- OAuth2 = Industry standard
- JWT = Stateless & scalable
- Anonymous = Privacy protection
- Domain restriction = School only

---

## ✅ Quick Checklist

Before starting:
- [ ] Google OAuth2 credentials obtained
- [ ] application.properties updated
- [ ] PostgreSQL running (port 5433)
- [ ] Database created (whisperboxplatform)

After implementation:
- [ ] Can login with Google
- [ ] Token generated successfully
- [ ] Token works for /api/auth/me
- [ ] Anonymous name displayed
- [ ] Real identity in database
- [ ] Domain restriction working

---

**Need help?** Check full documentation in other .md files!

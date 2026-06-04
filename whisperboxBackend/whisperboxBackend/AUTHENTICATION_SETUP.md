# Whisperbox Authentication Setup Guide

## Overview
Simple Google OAuth2 authentication with JWT for school anonymous messaging platform.

## Architecture Flow

```
1. User clicks "Login with Google"
2. User redirected to Google OAuth2 consent screen
3. User authorizes with school email (@yourschool.edu)
4. Google redirects back with authorization code
5. Backend validates email domain
6. Backend creates/updates user with anonymous name
7. Backend generates JWT token
8. User redirected to frontend with JWT token
9. Frontend stores JWT and uses it for API calls
```

## Setup Steps

### 1. Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
7. Copy **Client ID** and **Client Secret**

### 2. Update application.properties

Replace in `src/main/resources/application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_CLIENT_SECRET
app.allowed.domain=@yourschool.edu
```

### 3. Database Setup

The User entity will auto-create table with these fields:
- `id` (auto-generated)
- `email` (real student email - stored internally)
- `full_name` (from Google)
- `google_id` (Google's unique ID)
- `role` (STUDENT or ADMIN)
- `anonymous_name` (random generated name for public display)
- `registered_at`
- `last_login_at`

### 4. Start the Application

```bash
mvn spring-boot:run
```

### 5. Test Authentication Flow

#### Frontend Login Button:
```html
<a href="http://localhost:8080/oauth2/authorization/google">
  Login with Google
</a>
```

#### After Login:
User will be redirected to: `http://localhost:3000/auth/callback?token=<JWT_TOKEN>`

Frontend should:
1. Extract token from URL
2. Store in localStorage or cookie
3. Include in all API requests: `Authorization: Bearer <JWT_TOKEN>`

#### Get Current User:
```
GET http://localhost:8080/api/auth/me
Headers: Authorization: Bearer <your-jwt-token>

Response:
{
  "id": 1,
  "email": "student@yourschool.edu",
  "anonymousName": "Silent Panda",
  "role": "STUDENT"
}
```

## API Endpoints

### Public Endpoints (No authentication required)
- `GET /` - Home
- `GET /oauth2/authorization/google` - Initiate Google login

### Protected Endpoints (Requires JWT token)
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/status` - Check authentication status
- `GET /api/whispers/**` - All whisper endpoints

## JWT Token Structure

```json
{
  "sub": "student@yourschool.edu",
  "role": "STUDENT",
  "userId": 1,
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Security Features

1. **Domain Restriction**: Only emails ending with configured domain can access
2. **Anonymous Identity**: Real names stored internally, only anonymous names shown publicly
3. **JWT Expiration**: Tokens expire after 24 hours (configurable)
4. **Stateless**: No server-side sessions, JWT contains all needed info
5. **CORS Enabled**: Frontend can make requests from different port

## Frontend Integration Example

### React Example:

```javascript
// Login Button
<a href="http://localhost:8080/oauth2/authorization/google">
  Login with Google
</a>

// Callback Page (/auth/callback)
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    localStorage.setItem('jwt_token', token);
    navigate('/dashboard');
  }
}, []);

// API Call with JWT
const fetchWhispers = async () => {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch('http://localhost:8080/api/whispers', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## How Anonymous Names Work

When a user first logs in:
1. System generates random anonymous name (e.g., "Silent Panda")
2. This name is stored in user record
3. All whispers created by this user show this anonymous name
4. Real identity (email, full name) is stored internally but never exposed in public APIs

## Testing

### Test with Real Google Account:
1. Use your school email (@yourschool.edu)
2. Click login button
3. Authorize with Google
4. You'll be redirected with JWT token

### Test JWT:
```bash
# Get your token after login, then:
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/auth/me
```

## Common Issues

### "Invalid domain" error:
- Make sure `app.allowed.domain` matches your email domain
- Example: If email is `john@school.edu`, domain should be `@school.edu`

### CORS errors:
- Check frontend URL is in `corsConfigurationSource()` in SecurityConfig
- Default allowed: localhost:3000, localhost:5173, localhost:4200

### Token not working:
- Check token hasn't expired (24 hours default)
- Verify Authorization header format: `Bearer <token>`
- Check jwt.secret is same as when token was generated

## Production Considerations

1. **JWT Secret**: Change to strong random secret, store in environment variable
2. **HTTPS Only**: Use HTTPS in production
3. **Frontend URL**: Update `app.frontend.url` to production domain
4. **Google OAuth**: Add production redirect URI to Google Console
5. **Domain Validation**: Update `app.allowed.domain` to actual school domain

## For Academic Presentation

Key Points to Explain:
1. **Why OAuth2?** - Standard, secure, no password management
2. **Why JWT?** - Stateless, scalable, works with mobile apps
3. **Why Anonymous Names?** - Privacy for sensitive messages
4. **Domain Restriction** - School-only access control
5. **Simple Architecture** - Easy to understand and maintain

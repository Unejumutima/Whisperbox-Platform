# Whisperbox Authentication Testing Guide

## Quick Start Testing

### Step 1: Configure Google OAuth2

1. Go to https://console.cloud.google.com/
2. Create project or select existing
3. Enable **Google+ API** or **Google Identity API**
4. Navigate to **APIs & Services** → **Credentials**
5. Create **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:8080/login/oauth2/code/google`
6. Copy **Client ID** and **Client Secret**

### Step 2: Update Configuration

Edit `src/main/resources/application.properties`:

```properties
# Replace with your actual Google credentials
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID_HERE
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET_HERE

# Update to your school email domain
app.allowed.domain=@yourschool.edu
```

### Step 3: Start the Application

```bash
.\mvnw.cmd spring-boot:run
```

Wait for: `Started WhisperboxBackendApplication in X.XX seconds`

### Step 4: Test Google Login (Browser)

Open your browser and navigate to:
```
http://localhost:8080/oauth2/authorization/google
```

You'll be:
1. Redirected to Google sign-in
2. Asked to choose/login with Google account
3. Asked to authorize the application
4. Redirected back with JWT token

**Expected redirect:**
```
http://localhost:3000/auth/callback?token=eyJhbGciOiJIUzI1NiJ9...
```

### Step 5: Test JWT Token

Copy the token from the URL and test:

```bash
# Replace YOUR_TOKEN with actual token from redirect
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/auth/me
```

**Expected Response:**
```json
{
  "id": 1,
  "email": "student@yourschool.edu",
  "anonymousName": "Silent Panda",
  "role": "STUDENT"
}
```

## Testing Without Frontend

### Create Simple HTML Test Page

Create `test-login.html` anywhere:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Whisperbox Login Test</title>
</head>
<body>
    <h1>Whisperbox Authentication Test</h1>
    
    <div id="login-section">
        <h2>Step 1: Login</h2>
        <a href="http://localhost:8080/oauth2/authorization/google">
            <button>Login with Google</button>
        </a>
    </div>

    <div id="token-section" style="margin-top: 20px;">
        <h2>Step 2: Test Token</h2>
        <input type="text" id="token-input" placeholder="Paste token here" style="width: 500px;">
        <button onclick="testToken()">Test Token</button>
        <pre id="result"></pre>
    </div>

    <script>
        // Auto-extract token from URL if present
        window.onload = function() {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            if (token) {
                document.getElementById('token-input').value = token;
                localStorage.setItem('jwt_token', token);
                alert('Token received! Click "Test Token" to verify.');
            }
        };

        async function testToken() {
            const token = document.getElementById('token-input').value;
            
            try {
                const response = await fetch('http://localhost:8080/api/auth/me', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                
                const data = await response.json();
                document.getElementById('result').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
```

**Usage:**
1. Open `test-login.html` in browser
2. Click "Login with Google"
3. After redirect, token will be auto-filled
4. Click "Test Token" to verify

## Testing with Postman

### 1. Get JWT Token (Manual Login)

1. Open browser: `http://localhost:8080/oauth2/authorization/google`
2. Complete Google login
3. Copy token from redirect URL

### 2. Test Protected Endpoints

#### Get Current User
```
GET http://localhost:8080/api/auth/me
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Whispers (if you have any)
```
GET http://localhost:8080/api/whispers
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Whisper
```
POST http://localhost:8080/api/whispers
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
Body:
{
  "title": "Test Whisper",
  "content": "This is a test message"
}
```

## Testing Domain Restriction

### Test with Allowed Domain
Use email: `student@yourschool.edu`
**Expected:** Login successful, token generated

### Test with Disallowed Domain
Use email: `student@gmail.com`
**Expected:** Error page with message "Only students from @yourschool.edu can access this platform"

## Verify Database

Check if user was created in PostgreSQL:

```sql
-- Connect to database
psql -U postgres -d whisperboxplatform -p 5433

-- View all users
SELECT id, email, full_name, anonymous_name, role, registered_at 
FROM users;

-- Expected output:
-- id | email                    | full_name  | anonymous_name | role    | registered_at
-- 1  | student@yourschool.edu   | John Doe   | Silent Panda   | STUDENT | 2026-06-04 ...
```

## Common Test Scenarios

### Scenario 1: First Time User
1. User logs in with Google
2. ✅ New user created in database
3. ✅ Anonymous name generated
4. ✅ JWT token returned
5. ✅ User can access protected endpoints

### Scenario 2: Returning User
1. User logs in again
2. ✅ Existing user found
3. ✅ Last login time updated
4. ✅ Same anonymous name kept
5. ✅ New JWT token generated

### Scenario 3: Token Expiration
1. Wait 24 hours (or change jwt.expiration to 60000 for 1 minute)
2. Try to access protected endpoint
3. ✅ Should get 401 Unauthorized
4. ✅ User must login again

### Scenario 4: Invalid Token
```bash
curl -H "Authorization: Bearer invalid_token_here" \
  http://localhost:8080/api/auth/me
```
**Expected:** 401 Unauthorized

### Scenario 5: No Token
```bash
curl http://localhost:8080/api/auth/me
```
**Expected:** 401 Unauthorized

## Testing Anonymous Names

Check multiple users have different anonymous names:

```sql
SELECT id, email, anonymous_name FROM users;

-- Expected: Each user has unique anonymous name
-- id | email                  | anonymous_name
-- 1  | alice@yourschool.edu   | Silent Panda
-- 2  | bob@yourschool.edu     | Brave Tiger
-- 3  | charlie@yourschool.edu | Curious Eagle
```

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:** Add `http://localhost:8080/login/oauth2/code/google` to Google Console authorized redirect URIs

### Error: "invalid_client"
**Solution:** Check client-id and client-secret are correctly copied to application.properties

### Error: "Invalid domain"
**Solution:** 
- Check email domain matches app.allowed.domain
- Ensure domain includes @ symbol (e.g., @yourschool.edu)

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Solution:** Add your frontend URL to SecurityConfig corsConfigurationSource()

### Token not working
**Solutions:**
- Token expired? Login again
- Check Authorization header format: `Bearer <token>`
- Verify jwt.secret hasn't changed

### Database connection failed
**Solution:** 
- Ensure PostgreSQL is running on port 5433
- Check database credentials in application.properties
- Create database: `CREATE DATABASE whisperboxplatform;`

## Production Testing Checklist

Before deploying to production:

- [ ] Strong JWT secret (not the default)
- [ ] JWT secret in environment variable
- [ ] Correct school domain configured
- [ ] HTTPS enabled
- [ ] Production frontend URL configured
- [ ] Google OAuth redirect URI includes production URL
- [ ] CORS allows production frontend domain
- [ ] Database properly secured
- [ ] Token expiration appropriate (24 hours?)
- [ ] Test with multiple users
- [ ] Test anonymous names display correctly
- [ ] Test domain restriction works

## Performance Testing

### Load Test Login Flow
```bash
# Simple load test with curl
for i in {1..10}; do
  curl -H "Authorization: Bearer YOUR_TOKEN" \
    http://localhost:8080/api/auth/me &
done
wait
```

### Monitor Database
```sql
-- Check user count
SELECT COUNT(*) FROM users;

-- Check recent logins
SELECT email, last_login_at 
FROM users 
ORDER BY last_login_at DESC 
LIMIT 10;
```

## Demo Presentation Tips

1. **Prepare test account:** Use school email you control
2. **Clear browser cache:** Show fresh login experience
3. **Open DevTools Network tab:** Show OAuth2 flow and JWT
4. **Have token ready:** Pre-login to avoid waiting during demo
5. **Show database:** Display real identity vs anonymous name
6. **Explain security:** Why domain restriction matters
7. **Show JWT contents:** Use jwt.io to decode (for education only)

## Next Steps

After authentication works:
1. Update WhisperController to use authenticated user
2. Display anonymous names in whisper listings
3. Add admin role checking for moderation
4. Implement frontend login flow
5. Add logout functionality (clear JWT from frontend)
6. Add token refresh mechanism (optional)

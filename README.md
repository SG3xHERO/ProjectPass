# ProjectPass

## Overview

ProjectPass is a secure, customizable web-based password generator with email domain integration.

## Project Structure

- `frontend/`: Static frontend files
- `backend/`: Node.js Express API server

## Prerequisites

- Node.js (v14 or later)
- Web server (Nginx, Apache, etc.) for frontend deployment
- Backend server for API

## Local Development

### Clone the Repository

```bash
git clone https://github.com/SG3xHERO/ProjectPass.git
cd ProjectPass
```

### Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration

5. Start the backend server
```bash
npm run start
# Or for development
npm run dev
```

### Frontend Deployment

#### Local Testing
For local testing, you can use simple static file servers:

```bash
# Using Python
python -m http.server 8080

# Using PHP
php -S localhost:8080

# Using Node.js
npx serve frontend/public
```

#### Web Server Deployment

##### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/ProjectPass/frontend/public;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: API Proxy
    location /api/ {
        proxy_pass http://backend-server:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

##### Apache (.htaccess) Configuration
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

#### Deployment Steps
1. Copy frontend files to web server directory
2. Configure your web server to serve static files
3. Set the API base URL in `index.html`
4. Ensure proper CORS configuration on the backend

## Environment Configuration

1. In `index.html`, set the API base URL:
```html
    <!-- Set API Base URL -->
    <script>
        // Configure the API base URL 
        // Replace with your actual API endpoint
        window.API_BASE_URL = 'https://api.yourdomain.com';
    </script>
```

## Security Considerations

- Use HTTPS for both frontend and backend
- Implement proper CORS settings
- Use environment variables for configuration
- Keep dependencies updated

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## Deployment Platforms

### Frontend Hosting Options
- Nginx
- Apache
- Caddy
- Cloudflare Pages
- Netlify
- GitHub Pages

### Backend Hosting 
- Node

## Contact

- GitHub: [@SG3xHERO](https://github.com/SG3xHERO)
- Project: [ProjectPass](https://github.com/SG3xHERO/ProjectPass)

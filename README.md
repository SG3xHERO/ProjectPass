# ProjectPass

## Overview

ProjectPass is a secure, customizable web-based password generator with email domain integration.

## Features

- Generate multiple passwords simultaneously
- Customize password count
- Optional email domain selection
- Copy to clipboard functionality
- One-time secret sharing

## Project Structure

- `frontend/`: Client-side application
- `backend/`: Node.js Express API server

## Prerequisites

- Node.js (v14 or later)
- npm

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

### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Configure API endpoint in `.env`

5. Start the frontend
```bash
npm run start
```

## Deployment

### Backend Deployment
- Supports deployment on Heroku, DigitalOcean, AWS, Render
- Ensure all environment variables are set
- Use `npm start` as the run command

### Frontend Deployment
- Can be deployed on Netlify, Vercel, Cloudflare Pages
- Ensure `REACT_APP_API_BASE_URL` is set to your backend endpoint

## Security

- Passwords are generated client-side
- Optional email domain integration
- Rate limiting on API endpoints
- Configurable password generation

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

[Specify your license, e.g., MIT]

## Acknowledgments

- Inspiration for secure password generation
- Open-source community

## Contact

- GitHub: [@SG3xHERO](https://github.com/SG3xHERO)

# Contributing to ProjectPass

## Welcome!

We love your input! We want to make contributing to ProjectPass as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

### Prerequisites
- Node.js (v14 or later)
- npm

### Local Development Setup

1. Fork the repository
2. Clone your forked repository
```bash
git clone https://github.com/SG3xHERO/ProjectPass.git
cd ProjectPass
```

3. Set up Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. Set up Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

## Contribution Workflow

1. Create a branch for your changes
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
   - Follow existing code style
   - Add tests if applicable
   - Ensure all tests pass

3. Lint your code
```bash
npm run lint
npm run lint:fix
```

4. Commit your changes
```bash
git add .
git commit -m "Description of your changes"
```

5. Push to your fork
```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request to the main ProjectPass repository

## Reporting Bugs

- Use GitHub Issues
- Describe the bug in detail
- Provide steps to reproduce
- Include expected vs. actual behavior
- If possible, include a code snippet or reproduction

## Feature Requests

- Use GitHub Issues
- Clearly describe the feature
- Explain the motivation
- Provide potential implementation details if possible

## Code of Conduct

- Be respectful
- Collaborate constructively
- Help maintain an inclusive community

## Questions?

Open an issue with the "question" label or discuss in our community channels.

## Contact

- Project Maintainer: [@SG3xHERO](https://github.com/SG3xHERO)
- Project Repository: [ProjectPass on GitHub](https://github.com/SG3xHERO/ProjectPass)

## Thank You!

Your contributions make open source amazing. 🌟

# Project Pass

## Overview
Project Pass is self hostable password generator that allows users to create multiple passwords with optional email domain integration and mass send them securely over one time secret 
The Algorithm to generate these passwords takes a lot of insipration from dinopass

## Features
- Generate multiple passwords at once
- Optional email domain selection
- One-time secret sharing

## Prerequisites
- Node.js
- npm

## Installation

1. Clone the repository
```bash
git clone https://github.com/sg3xhero/ProjectPass.git
cd password-generator
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the project root with the following template:
```
API_KEY=your_secure_api_key
OTS_USERNAME=your_onetimesecret_username
OTS_API_KEY=your_onetimesecret_api_key
```

4. Start the server
```bash
node server.js
```

## Configuration
- Modify `server.js` to add or change domain codes
- Update the lists of adjectives and nouns in `server.js` for password generation

## Security Notes
- Replace all hardcoded API keys and sensitive information
- Use environment variables for configuration
- Implement proper authentication in a production environment


## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

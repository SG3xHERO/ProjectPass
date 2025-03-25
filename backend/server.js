require("dotenv").config();
const express = require("express");
const https = require("https");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const querystring = require("querystring");

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || ['http://localhost:80', 'https://yourdomain.com'],
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "OPTIONS"]
};
app.use(cors(corsOptions));

app.use(express.json());

// Trust proxy for correct IP rate limiting
app.set("trust proxy", true);

// Environment Variables
const API_KEY = process.env.API_KEY;
const OTS_USERNAME = process.env.OTS_USERNAME;
const OTS_API_KEY = process.env.OTS_API_KEY;

// Rate limit configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Allow 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true,
});
app.use(limiter);

// Password Generation Resources
const adjectives = [
    "happy", "cool", "kind", "fast", "warm", "calm", "brave", "smart", "funny", "bright",
    "silly", "tiny", "big", "soft", "strong", "quick", "lucky", "quiet", "sweet", "sunny",
    "simple", "gentle", "wild", "bold", "lazy", "cozy", "fresh", "lively", "super", "bouncy",
    "friendly", "shiny", "merry", "witty", "cheerful", "jolly", "clever", "curious", "dizzy", "snappy",
    "neat", "chill", "playful", "glad", "sneaky", "peppy", "graceful", "peppy", "soft", "tidy"
];

const nouns = [
    "apple", "banana", "dog", "cat", "mouse", "pencil", "star", "moon", "cloud", "sun",
    "chair", "table", "book", "lamp", "shirt", "hat", "sock", "spoon", "fork", "plate",
    "phone", "clock", "bottle", "train", "car", "bus", "boat", "tree", "leaf", "river",
    "house", "door", "window", "garden", "flower", "grass", "rock", "shell", "cloud", "sky",
    "smile", "hug", "song", "dance", "gift", "toy", "kite", "nest", "candle", "mirror"
];

const symbolMap = { 
    'a': '@', 
    's': '$', 
    'i': '!', 
    'e': '£', 
    'o': '%' 
};

function generatePassword() {
    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];
    let number = Math.floor(Math.random() * 100);

    noun = noun.charAt(0).toUpperCase() + noun.slice(1);
    let password = adjective + noun + number;

    const availableLetters = Object.keys(symbolMap).filter(letter => password.toLowerCase().includes(letter));
    if (availableLetters.length > 0) {
        let chosenLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        password = password.replace(new RegExp(chosenLetter, 'i'), symbolMap[chosenLetter]);
    }

    return password;
}

// API Endpoint: Generate Passwords
app.post("/generate-password", (req, res) => {
    try {
        const count = parseInt(req.body.count) || 1;
        if (isNaN(count) || count < 1 || count > 20) {
            return res.status(400).json({ error: "Please request between 1 and 20 passwords." });
        }

        const passwords = Array.from({ length: count }, generatePassword);
        res.json({ passwords });
    } catch (error) {
        console.error("Error in /generate-password:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// API Endpoint: Create a OneTimeSecret
app.post("/create-secret", (req, res) => {
    const secret = req.body.secret;
    if (!secret) {
        return res.status(400).json({ error: "No secret data provided." });
    }

    const postData = querystring.stringify({ secret: secret, ttl: "3600" });

    const options = {
        hostname: "onetimesecret.com", // Use a public service or your own
        path: "/api/v1/share",
        method: "POST",
        auth: `${OTS_USERNAME}:${OTS_API_KEY}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(postData)
        }
    };

    const apiRequest = https.request(options, (apiResponse) => {
        let data = "";

        apiResponse.on("data", (chunk) => {
            data += chunk;
        });

        apiResponse.on("end", () => {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.secret_key) {
                    res.json({ link: `https://onetimesecret.com/secret/${parsedData.secret_key}` });
                } else {
                    console.error("OneTimeSecret API Error:", parsedData);
                    res.status(500).json({ error: "OneTimeSecret API failed.", response: parsedData });
                }
            } catch (error) {
                console.error("JSON Parse Error:", error);
                res.status(500).json({ error: "Invalid response from OneTimeSecret." });
            }
        });
    });

    apiRequest.on("error", (error) => {
        console.error("Error creating OneTimeSecret:", error);
        res.status(500).json({ error: "Internal server error." });
    });

    apiRequest.write(postData);
    apiRequest.end();
});

// Example domain codes (replace with your own)
const domainCodes = {
    "test": [
        "@example.com"
    ]
};

// API Endpoint: Fetch Domains Based on Code
app.post("/get-domains", (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: "No domain code provided." });
    }

    const lowercaseCode = code.trim().toLowerCase();
    const domains = domainCodes[lowercaseCode] || [];

    res.json({ domains });
});

// Start the server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Password generator backend running on ${HOST}:${PORT}`);
});

// Optional: Add a health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString() 
    });
});

const express = require('express');
const session = require('express-session');
const app = express();

const cors = require('cors');
const conn = require('./config/db');

const defaultAllowedOrigins = [
    'http://localhost:8080',
    'http://127.0.0.1:8080'
];

const envOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envOrigins])];

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));

app.get('/', (req, res) => res.send('API Running'));

// Connect to database
conn.connectDB();

// Init Middleware for parsing JSON
app.use(express.json());

app.get('/test_api', async function(req, res) {
    await conn.query('SELECT * from users', async function(error, results) {
        if (error) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.send(error.code);
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(results));
        }
    });
});

// Define Routes
app.use('/api', require('./routes/UserRoute'));
app.use('/exercise', require('./routes/ExerciseRoute'));
app.use('/email', require('./routes/EmailRoute'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;

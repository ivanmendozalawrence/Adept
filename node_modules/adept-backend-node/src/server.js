import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';
import { initAuth } from './auth.js';
import { initMailer } from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend-node/.env even if started from repo root
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();

const SQLiteStore = SQLiteStoreFactory(session);

const {
  PORT = 4000,
  SESSION_SECRET = 'dev_secret',
  FRONTEND_ORIGIN = 'http://localhost:3000'
} = process.env;

// Support comma-separated list of allowed frontend origins (e.g. http://localhost:3000,http://localhost:3001)
const allowedOrigins = FRONTEND_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // mobile apps / curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('[CORS] Blocked origin', origin, 'allowed:', allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: path.resolve(__dirname, '../../backend') }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}));

initAuth(app);
initMailer();

app.use(router);

app.use((err, req, res, next) => { // eslint-disable-line
  console.error(err); // eslint-disable-line no-console
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Node backend listening on http://localhost:${PORT}`); // eslint-disable-line no-console
});

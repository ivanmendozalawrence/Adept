import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

sqlite3.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.SQLITE_PATH ? path.resolve(__dirname, process.env.SQLITE_PATH) : path.resolve(__dirname, '../../backend/db.sqlite3');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL');
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    picture TEXT,
    password_hash TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS partner_health (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    last_update TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(partner_id) REFERENCES partners(id)
  )`);

  // Average collaboration health trend per month (simple prototype)
  db.run(`CREATE TABLE IF NOT EXISTS health_trend (
    month_index INTEGER PRIMARY KEY, -- 0=Jan, 11=Dec
    avg_score INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    partner_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
  token TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Lightweight migration: ensure the 'token' column exists (older DBs created before token feature)
  db.all("PRAGMA table_info(invitations)", (err, columns) => {
    if (err) {
      console.error('[DB] Could not inspect invitations schema', err);
      return;
    }
    const hasToken = columns.some(c => c.name === 'token');
    if (!hasToken) {
      console.log('[DB] Adding missing token column to invitations table');
      // First add without UNIQUE (SQLite cannot add a UNIQUE constraint directly via ALTER)
      db.run('ALTER TABLE invitations ADD COLUMN token TEXT', alterErr => {
        if (alterErr) {
          console.error('[DB] Failed to add token column (non-unique)', alterErr);
          return;
        }
        // Create a unique index if not exists to enforce uniqueness semantically
        db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token)', idxErr => {
          if (idxErr) {
            console.error('[DB] Failed to create unique index on token', idxErr);
          } else {
            console.log('[DB] token column and unique index created successfully');
          }
        });
      });
    }
  });

  // Seed placeholder partner health data if none
  db.get('SELECT COUNT(*) as cnt FROM partners', (err, row) => {
    if (err) return console.error('[DB] Seed count error', err);
    if (row && row.cnt === 0) {
      console.log('[DB] Seeding placeholder partner data');
      const seedPartners = [
        { name: 'Secure Fintech Inc.', status: 'monitoring' },
        { name: 'Global Payments Co.', status: 'inconsistent' },
        { name: 'Manila Microfinance', status: 'consistent' },
        { name: 'Metro Trade Logistics', status: 'pending' }
      ];
      seedPartners.forEach(p => {
        db.run('INSERT OR IGNORE INTO partners (name) VALUES (?)', [p.name], function(e){
          if (e) return console.error('[DB] insert partner error', e);
          const pid = this.lastID;
          db.get('SELECT id FROM partners WHERE name=?', [p.name], (e2, prow) => {
            if (e2) return console.error('[DB] fetch partner id error', e2);
            db.run('INSERT INTO partner_health (partner_id, status) VALUES (?, ?)', [prow.id, p.status]);
          });
        });
      });
    }
  });

  // Seed trend data if empty (12 months)
  db.get('SELECT COUNT(*) as cnt FROM health_trend', (err, row) => {
    if (err) return console.error('[DB] health_trend count error', err);
    if (row && row.cnt === 0) {
      console.log('[DB] Seeding health_trend data');
      for (let m = 0; m < 12; m++) {
        // Generate a pseudo-trend: start 55-70 then fluctuate upward
        const base = 55 + m * 2 + Math.floor(Math.random() * 10); // rough upward progression
        const score = Math.min(95, base);
        db.run('INSERT INTO health_trend (month_index, avg_score) VALUES (?, ?)', [m, score]);
      }
    }
  });
});
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function run(sql, params = {}) {
  return new Promise((resolve, reject) => {
    const values = Array.isArray(params) ? params : Object.values(params);
    db.run(sql, values, function(err) {
      if (err) {
        console.error('[DB] run error for SQL:', sql, 'params:', values, 'err:', err);
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
export async function findUserByGoogleId(googleId) {
  return get('SELECT * FROM users WHERE google_id = ?', [googleId]);
}
export async function findUserByEmail(email) {
  return get('SELECT * FROM users WHERE email = ?', [email]);
}
export async function findUserById(id) {
  return get('SELECT * FROM users WHERE id = ?', [id]);
}
export async function createUser({ google_id, email, name, picture }) {
  const insert = await run('INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)', [google_id, email, name, picture]);
  return findUserById(insert.lastID);
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function listPartnerHealth() {
  return all(`SELECT p.id, p.name, h.status, h.last_update
              FROM partners p
              JOIN partner_health h ON h.partner_id = p.id
              ORDER BY p.name`);
}

export async function listInvitations() {
  return all('SELECT * FROM invitations ORDER BY created_at DESC');
}

export async function createInvitation(partner_name, contact_email, token) {
  return run('INSERT INTO invitations (partner_name, contact_email, token) VALUES (?, ?, ?)', [partner_name, contact_email, token]);
}

export async function findInvitationByToken(token) {
  return get('SELECT * FROM invitations WHERE token = ?', [token]);
}

export async function getHealthTrend() {
  const rows = await all('SELECT month_index, avg_score FROM health_trend ORDER BY month_index');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return rows.map(r => ({ month: monthNames[r.month_index], value: r.avg_score }));
}

export async function getStatusDistribution() {
  // Derive current status counts from latest partner_health entries (one per partner in seed)
  const rows = await all('SELECT status, COUNT(*) as c FROM partner_health GROUP BY status');
  const dist = { consistent: 0, monitoring: 0, inconsistent: 0, pending: 0 };
  rows.forEach(r => { if (dist[r.status] !== undefined) dist[r.status] = r.c; });
  return dist;
}

export async function getPartnerAlerts() {
  // Simple heuristic: choose partners with inconsistent or monitoring status
  const rows = await all(`SELECT p.name, h.status, h.last_update
                          FROM partners p JOIN partner_health h ON h.partner_id = p.id
                          WHERE h.status IN ('inconsistent','monitoring')
                          ORDER BY h.status`);
  return rows.map(r => ({
    partnerName: r.name,
    status: r.status,
    message: r.status === 'inconsistent' ? 'Inconsistent collaboration metrics detected.' : 'Monitoring early signals of drift.'
  }));
}

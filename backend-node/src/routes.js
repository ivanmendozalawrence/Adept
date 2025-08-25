import express from 'express';
import passport from 'passport';
import { ensureAuthenticated } from './auth.js';
import { listPartnerHealth, listInvitations, createInvitation, findInvitationByToken, getHealthTrend, getStatusDistribution, getPartnerAlerts } from './db.js';
import { sendInvitationEmail, mailerStatus } from './mailer.js';

const router = express.Router();

router.get('/health', (req, res) => {
  console.log('[Route] /health');
  res.json({ status: 'ok' });
});

router.get('/auth/google', (req, res, next) => {
  console.log('[Route] /auth/google start mode param:', req.query.mode);
  const strategy = passport._strategy && passport._strategy('google');
  if (!strategy) {
    console.warn('[Route] /auth/google NO STRATEGY configured');
    return res.status(503).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID/SECRET and restart.' });
  }
  const mode = req.query.mode === 'popup' ? 'popup' : 'redirect';
  console.log('[Route] /auth/google using mode:', mode);
  const authenticator = passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    state: mode
  });
  authenticator(req, res, next);
});

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/failure' }), (req, res) => {
  console.log('[Route] /auth/google/callback state:', req.query.state, 'user id:', req.user && req.user.id);
  const { state } = req.query;
  if (state === 'popup') {
    // Determine which allowed origin to target (if multiple)
    const allowed = (process.env.FRONTEND_ORIGIN || '').split(',').map(o=>o.trim()).filter(Boolean);
    // Try to pick the one that matches the request's "origin" header or referer
    const requestOrigin = req.headers.origin || '';
    const referer = req.headers.referer || '';
    let target = allowed[0];
    for (const cand of allowed) {
      if (requestOrigin.startsWith(cand) || referer.startsWith(cand)) { target = cand; break; }
    }
    console.log('[Route] /auth/google/callback sending popup postMessage to origin', target, 'allowed list:', allowed, 'requestOrigin:', requestOrigin, 'referer:', referer);
    return res.send(`<!DOCTYPE html><html><head><title>Authenticated</title></head><body><script>
      (function(){
        var origin='${target}';
        console.log('[Popup] OAuth success. Posting message to opener', origin);
        try { if(window.opener) { window.opener.postMessage({ type: 'oauth-success' }, origin); } else { console.warn('[Popup] No opener window'); } } catch(e) { console.error('[Popup] postMessage error', e); }
        setTimeout(function(){ window.close(); }, 150);
      })();
      </script><p>Authentication complete. You can close this window.</p></body></html>`);
  }
  const primaryOrigin = (process.env.FRONTEND_ORIGIN || '').split(',')[0];
  return res.redirect(primaryOrigin + '/dashboard');
});

router.get('/auth/failure', (req, res) => {
  console.warn('[Route] /auth/failure');
  res.status(401).json({ error: 'Google authentication failed' });
});

router.post('/auth/logout', (req, res, next) => {
  console.log('[Route] /auth/logout start user id:', req.user && req.user.id);
  req.logout(err => {
    if (err) { console.error('[Route] /auth/logout error on logout()', err); return next(err); }
    req.session.destroy(() => {
      console.log('[Route] /auth/logout session destroyed');
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
});

router.get('/auth/session', (req, res) => {
  const authed = req.isAuthenticated && req.isAuthenticated();
  console.log('[Route] /auth/session ->', authed ? 'authenticated user id ' + (req.user && req.user.id) : 'not authenticated');
  if (authed) {
    const { id, email, name, picture } = req.user;
    return res.json({ authenticated: true, user: { id, email, name, picture } });
  }
  return res.json({ authenticated: false });
});

// Protected sample route
router.get('/api/secure-data', ensureAuthenticated, (req, res) => {
  console.log('[Route] /api/secure-data user id:', req.user && req.user.id);
  res.json({ secret: 'This is protected data', user: req.user });
});

// Partner health data
router.get('/api/partners/health', ensureAuthenticated, async (req, res) => {
  try {
    const rows = await listPartnerHealth();
    res.json({ partners: rows });
  } catch (e) {
    console.error('[Route] /api/partners/health error', e);
    res.status(500).json({ error: 'Failed to load partner health' });
  }
});

// Dashboard insights data
router.get('/api/insights/trend', ensureAuthenticated, async (req, res) => {
  try {
    const trend = await getHealthTrend();
    res.json({ trend });
  } catch (e) {
    console.error('[Route] /api/insights/trend error', e);
    res.status(500).json({ error: 'Failed to load trend' });
  }
});

router.get('/api/insights/status-distribution', ensureAuthenticated, async (req, res) => {
  try {
    const distribution = await getStatusDistribution();
    res.json({ distribution });
  } catch (e) {
    console.error('[Route] /api/insights/status-distribution error', e);
    res.status(500).json({ error: 'Failed to load distribution' });
  }
});

router.get('/api/insights/alerts', ensureAuthenticated, async (req, res) => {
  try {
    const alerts = await getPartnerAlerts();
    res.json({ alerts });
  } catch (e) {
    console.error('[Route] /api/insights/alerts error', e);
    res.status(500).json({ error: 'Failed to load alerts' });
  }
});

// Invitations
router.get('/api/invitations', ensureAuthenticated, async (req, res) => {
  try {
    const rows = await listInvitations();
    res.json({ invitations: rows });
  } catch (e) {
    console.error('[Route] /api/invitations error', e);
    res.status(500).json({ error: 'Failed to load invitations' });
  }
});

router.post('/api/invitations', ensureAuthenticated, async (req, res) => {
  const { partnerName, contactEmail } = req.body || {};
  if (!partnerName || !contactEmail) return res.status(400).json({ error: 'partnerName and contactEmail required' });
  try {
    const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    await createInvitation(partnerName, contactEmail, token);
    const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000').split(',');
    const base = frontendOrigins[0];
    const link = `${base}/partner?token=${token}`;
    sendInvitationEmail({ to: contactEmail, partnerName, link }).catch(e=>console.error('[Mail] invitation send error', e));
    res.json({ ok: true, token });
  } catch (e) {
    console.error('[Route] POST /api/invitations error', e);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

// Public endpoint to validate invitation token
router.get('/api/invitations/validate/:token', async (req, res) => {
  try {
    const inv = await findInvitationByToken(req.params.token);
    if (!inv) return res.status(404).json({ valid: false });
    res.json({ valid: true, partnerName: inv.partner_name, status: inv.status });
  } catch (e) {
    console.error('[Route] /api/invitations/validate error', e);
    res.status(500).json({ error: 'Validation failed' });
  }
});

// Mailer status (protected) to confirm configuration without exposing secrets
router.get('/api/mailer/status', ensureAuthenticated, (req, res) => {
  res.json(mailerStatus());
});

export default router;

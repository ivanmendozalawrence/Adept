import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByGoogleId, findUserByEmail, createUser, findUserById } from './db.js';

passport.serializeUser((user, done) => {
  console.log('[Auth] serializeUser -> id:', user && user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('[Auth] deserializeUser request for id:', id);
  findUserById(id)
    .then(user => {
      if (user) console.log('[Auth] deserializeUser success for id:', id);
      else console.warn('[Auth] deserializeUser no user for id:', id);
      done(null, user || null);
    })
    .catch(err => {
      console.error('[Auth] deserializeUser error for id:', id, err);
      done(err);
    });
});

export function configureGoogleStrategy() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('[Auth] Google credentials missing; Google OAuth disabled');
    return;
  }
  console.log('[Auth] Google OAuth enabled. Client ID prefix:', GOOGLE_CLIENT_ID.slice(0, 10));
  const callbackURL = GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback';
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL,
    passReqToCallback: false
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('[Auth] GoogleStrategy callback start for profile id:', profile && profile.id);
    try {
      let user = await findUserByGoogleId(profile.id);
      console.log('[Auth] findUserByGoogleId result:', !!user);
      if (!user) {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;
        console.log('[Auth] Creating new user with email:', email);
        user = await createUser({ google_id: profile.id, email, name, picture });
      }
      console.log('[Auth] Strategy success user id:', user.id);
      return done(null, user);
    } catch (e) {
      console.error('[Auth] Strategy error:', e);
      return done(e);
    }
  }));
}

export function initAuth(app) {
  configureGoogleStrategy();
  app.use(passport.initialize());
  app.use(passport.session());
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  console.warn('[Auth] Unauthorized access attempt to', req.originalUrl);
  return res.status(401).json({ error: 'Unauthorized' });
}

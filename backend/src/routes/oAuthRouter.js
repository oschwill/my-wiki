import express from 'express';
import passport from 'passport';
import { createAuth } from '../utils/authHelper.js';

export const router = express.Router();

// Routen für Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false,
  }),
  (req, res) => {
    const { hasToken } = createAuth(req.user, res, '1');

    if (!hasToken) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=auth_failed`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

// Routen für GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/failure',
    session: false,
  }),
  (req, res) => {
    const { hasToken } = createAuth(req.user, res, '1');

    if (!hasToken) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=auth_failed`);
    }

    return res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

// Fehlerseite für Authentifizierung
router.get('/failure', (req, res) => {
  res.status(400).send('Authentication failed');
});

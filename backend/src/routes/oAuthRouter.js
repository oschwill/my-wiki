import express from 'express';
import passport from 'passport';

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
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
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
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  }
);

// Fehlerseite für Authentifizierung
router.get('/failure', (req, res) => {
  res.status(400).send('Authentication failed');
});

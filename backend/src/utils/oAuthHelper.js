import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import { generateRandomPassword } from './helperFunctions.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      let user = await userModel.findOne({
        externalId: profile.id,
        provider: 'google',
      });

      if (!user) {
        user = new userModel({
          externalId: profile.id,
          firstName: profile.displayName,
          lastName: profile.name.givenName,
          username: profile.name.givenName,
          provider: 'google',
          password: generateRandomPassword(12),
          email: profile.emails[0]?.value || 'google@goolge.de',
          active: true,
        });

        await user.save();
      }
      return done(null, user);
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await userModel.findOne({
          externalId: profile.id,
          provider: 'github',
        });

        if (!user) {
          const response = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
            },
          });

          const emails = await response.json();
          const primaryEmail =
            emails.find((email) => email.primary && email.verified)?.email ?? null;
          const email = primaryEmail ?? `github-${profile.id}@users.mywiki.local`;

          user = new userModel({
            externalId: profile.id,
            firstName: profile.displayName,
            lastName: profile.username,
            username: profile.username,
            provider: 'github',
            password: generateRandomPassword(12),
            email,
            active: true,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// Serialisierung des Benutzers
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialisierung des Benutzers
passport.deserializeUser((user, done) => {
  done(null, user);
});

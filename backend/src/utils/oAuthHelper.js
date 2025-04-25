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
      let user = await userModel.findOne({ _id: profile.id }); //
      console.log(profile);
      if (!user) {
        user = new userModel({
          _id: profile.id,
          firstName: profile.displayName,
          lastName: profile.name.givenName,
          username: profile.name.givenName,
          password: generateRandomPassword(12),
          email: profile.emails[0]?.value || 'google@goolge.de',
          active: true,
        });

        await user.save();
      }
      return done(null, user);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      let user = await userModel.findOne({ _id: profile.id }); //

      if (!user) {
        user = new userModel({
          _id: profile.id,
          firstName: profile.displayName,
          lastName: profile.username,
          username: profile.username,
          password: generateRandomPassword(12),
          email: 'github@github.de',
          active: true,
        });

        await user.save();
      }
      return done(null, user);
    }
  )
);

// Serialisierung des Benutzers
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialisierung des Benutzers
passport.deserializeUser((user, done) => {
  done(null, user);
});

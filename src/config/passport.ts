import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as FacebookProfile } from 'passport-facebook';
import { Profile as GitHubProfile } from 'passport-github2';
import { AuthService } from '../services/auth.service';
import dotenv from 'dotenv';

dotenv.config();

const authService = new AuthService();

interface DoneFunction {
  (error: any, user?: any, info?: any): void;
}

interface VerifyCallback {
  (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile | FacebookProfile | GitHubProfile,
    done: DoneFunction
  ): void;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: DoneFunction
    ) => {
      // Just pass the profile to the controller
      try {
        return done(null, profile);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: '/auth/github/callback',
      scope: ['profile', 'email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: DoneFunction
    ) => {
      // Just pass the profile to the controller
      try {
        return done(null, profile);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'picture.type(large)'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, profile);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await authService.findUserById(id as string);
  done(null, user);
});

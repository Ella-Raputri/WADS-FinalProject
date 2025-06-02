import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';

const url = (process.env.NODE_ENV === 'development')? process.env.SERVER_DEVELOPMENT_URL : process.env.SERVER_PRODUCTION_URL;

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: url + "/api/auth/google/callback",
  },
  // Callback function after Google authenticates the user
  async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value; //extract user email from Google

        // see if the user already exists with that email
        const existingUser = await userModel.findOne({ Email: email });

        if (existingUser) {
            // admin cannot login with Google OAuth
            if (existingUser.Role === 'admin') {
                return done(new Error('Admins cannot login with Google OAuth'), null);
            }
            else{
                // link Google account to that email
                if (!existingUser.GoogleId) {
                    existingUser.GoogleId = profile.id;
                    existingUser.IsAccountVerified = true; 
                    await existingUser.save();
                }
            }
            return done(null, existingUser);
        }

        // if not registered yet, create a new user
        const newUser = await userModel.create({
            FullName: profile.displayName,
            Email: profile.emails[0].value,
            GoogleId: profile.id,
            Role: "participant", 
            IsAccountVerified: true,
        });

        return done(null, newUser);
    } catch (err) {
        return done(err, null); 
    }
}
)
);

// Serialize user instance to the session (store user ID)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session using the stored ID
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

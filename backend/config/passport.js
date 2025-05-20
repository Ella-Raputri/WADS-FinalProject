// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;

        const existingUser = await userModel.findOne({ Email: email });

        if (existingUser) {
            if (existingUser.Role === 'admin') {
                return done(new Error('Admins cannot login with Google OAuth'), null);
            }
            else{
                if (!existingUser.GoogleId) {
                    existingUser.GoogleId = profile.id;
                    existingUser.IsAccountVerified = true; // You can mark as verified
                    await existingUser.save();
                }
            }
            return done(null, existingUser);
        }

        const newUser = await userModel.create({
            FullName: profile.displayName,
            Email: profile.emails[0].value,
            GoogleId: profile.id,
            Role: "Participant", // or "Guest"
            IsAccountVerified: true,
        });

        return done(null, newUser);
    } catch (err) {
        return done(err, null); // Catch unexpected errors
    }
}
)
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  done(null, user);
});

const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');

const GITHUB_CLIENT_ID = "d1ec37c447c66bd03a0c";
const GITHUB_CLIENT_SECRET = "d122e6d80ea999cabbbbfb706bcd5910dd35ee09";

const User = require('../models/User.model')
const Profile = require('../models/Profile.model')


passport.serializeUser((user, done) => {
    console.log("1 :", user.id);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("2 :", user.id);
    done(null, user);
});


passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:1000/github/callback"
}, function (accessToken, refreshToken, profile, done) {

    process.nextTick(async () => {
        try {
            const { name, email } = profile._json;

            let user = await User.findOne({ email });

            if (user === null) {
                const user = new User({
                    name: name,
                    email: email,
                    type: 'dev',
                })
                user = await user.save()
            }

            let profile_data = await Profile.findOne({ user });

            if (profile_data === null) {
                profile_data = new Profile({
                    user: user._id,
                    github_info: profile._json
                })
                await profile_data.save()
            }

            done(null, profile)
        } catch (error) {
            console.log(error);
        }
    });
}));



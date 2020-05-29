const GitHubStrategy = require('passport-github2').Strategy;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require("config");

const User = require('../models/User.model')
const Profile = require('../models/Profile.model')


passport.serializeUser((token, done) => {
    done(null, token);
});

passport.deserializeUser((token, done) => {
    done(null, token);
});


passport.use(new GitHubStrategy({
    clientID: config.get("GITHUB_CLIENT_ID"),
    clientSecret: config.get("GITHUB_CLIENT_SECRET"),
    callbackURL: "http://localhost:1000/github/callback"
}, function (accessToken, refreshToken, profile, done) {

    process.nextTick(async () => {
        try {
            const { name, email, login, node_id, avatar_url, html_url, company, blog, location, hireable, bio } = profile._json;

            const data_profile = {
                name,
                email,
                username: login,
                avatar: avatar_url,
                git_id: node_id,
                git_url: html_url,
                company,
                website: blog,
                location,
                bio,
                hireable
            }

            let user = await User.findOne({ email });

            if (user === null) {
                user = new User({
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
                    github_info: data_profile
                })
                await profile_data.save()
            }

            //JWT
            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    done(null, token)
                }
            );

        } catch (error) {
            console.log(error);
        }
    });
}));



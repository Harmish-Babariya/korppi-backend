
const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const nodemailer = require('nodemailer');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true,
    accessType: 'offline',
    prompt: 'consent'
},
    function (req, accessToken, refreshToken, profile, done) {
        let email = profile.emails[0].value;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: email,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: refreshToken,
                accessToken: accessToken
            },
        });

        const mailOptions = {
            from: email,
            to: "darshanmalaviya163@gmail.com",
            subject: "test mail",
            text: "test body",
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error.toString());
            } else {
                console.log('Emails sent successfully ' + info);
            }
        });
        return done(null, profile);
    }
));
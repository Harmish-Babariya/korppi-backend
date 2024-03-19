const bodyParser = require("body-parser");
const express = require("express");
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const cookieSession = require('cookie-session');
const cors = require('cors');
require('../src/services/passport');

module.exports = function (app) {
    app.use(express.json());
    app.use(cors({ origin: true }));
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(cookieSession({
        name: 'google-auth-session',
        keys: ['key1', 'key2']
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new OIDCStrategy({
        identityMetadata: process.env.MICROSOFT_IDENTITY_METADATA,
        clientID: process.env.MICROSOFT_CLIENT_ID,
        responseType: 'code',
        responseMode: 'form_post',
        redirectUrl: process.env.MICROSOFT_CALL_BACK_URL,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        validateIssuer: false,
        passReqToCallback: false,
        scope: ['openid', 'profile', 'offline_access']
    },
    (iss, sub, profile, accessToken, refreshToken, done) => {
        return done(null, profile);
    }
));
    // Middleware used in protected routes to check if the user has been authenticated
    const isLoggedIn = (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    }
    app.get('/microsoft', passport.authenticate('azuread-openidconnect'));
    app.post('/auth/microsoft/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/microsoft' }),
    (req, res) => { 
        console.log(res)
        res.redirect('/');
    });

    app.get('/microsoft/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });


    app.get('/google',
        passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
        ));

    app.get('/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/failed',
        }),
        function (req, res) {
            res.redirect('/success')

        }
    );

    // failed route if the authentication fails
    app.get("/failed", (req, res) => {
        console.log('User is not authenticated');
        res.send("Failed")
    })

    // Success route if the authentication is successful
    app.get("/success", isLoggedIn, (req, res) => {
        console.log('You are logged in');
        res.send(`Welcome ${req.user.displayName}`)
    })

    // Route that logs out the authenticated user  
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect('/')
    });


}
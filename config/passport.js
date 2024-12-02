const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('./database'); 
const { compareSync } = require('bcrypt');


passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await userModel.findOne({ username });

            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }

            if (!compareSync(password, user.password)) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;

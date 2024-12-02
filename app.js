const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const userModel = require('./config/database');

const app = express();


app.set('view engine', 'ejs');
app.set('views', './views1');


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
    session({
        secret: 'IdatenJump', 
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/host2',
        }),
        cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, 
    })
);


app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('Welcome to the app! <a href="/login">Login</a>');
});

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = require('bcrypt').hashSync(req.body.password, 10);
        const user = new userModel({ username: req.body.username, password: hashedPassword });

        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).render('register', { error: 'Registration failed. Try again!' });
    }
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureMessage: true, 
    }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Hello, ${req.user.username}! Welcome to your dashboard. <a href="/logout">Logout</a>`);
});


app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.clearCookie('connect.sid'); 
        res.redirect('/');
    });
});


app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

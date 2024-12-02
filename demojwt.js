const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const secretKey = 'kekwwww'; 


app.get('/', (req, res) => {
    res.json({
        message: 'A simple API',
    });
});


app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: 'Isagi Yoichi',
        email: 'isagi.yoichi@example.com',
    };

    
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    res.json({
        message: 'Login successful',
        token,
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Forbidden: Token not provided' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
        req.user = user;
        next();
    });
}


app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user,
    });
});

app.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'User profile retrieved successfully',
        profile: req.user, 
    });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

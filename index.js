const express = require("express");
const session = require('express-session');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const uuid = require('uuid');

require('dotenv').config()

const JWT_SECRET = 'BHtTBsFQfmQihTtZ6WeksihWQ9sRa6nXfRGQKCoH9zsgRtJ6nTfNYC8BjGxpLXjvsVzAmV';

process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

const uri = process.env.MONGODB_URI || "mongodb+srv://Daniel:7pFQNXkzViEgZnMp@cluster0.guf6p.mongodb.net/webproject-danielsvenberg-database?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

// MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
//     if (err) {
//         throw(err)
//     }

//     console.log("Connection to MongoDB established");
// })



const client = new MongoClient(uri, { useUnifiedTopology: true });

if (client.isConnected) {console.log("Connection to MongoDB established")}

app.use('/', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    if (req = "/") {
        res.sendFile(__dirname + '/public/main.html')
    } else {
        res.sendFile(__dirname + '/public/404.html')
    }
});

// app.get('/api/userAuth', authenticateToken, (req, res) => {
    
// })

app.post('/validate', async (req, res) => {
    
    // jwt.verify(token, JWT_SECRET, function(err, decoded) {
    //     console.log(decoded.foo)
    // })

    res.JWT_SECRET
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // const user = await User.findOne({ username }).lean()
    const user = client.db.collection('users').find({username: username})

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username or password' })
    }
    
    if (await bcrypt.compare(password, user.password)) {
        // the userame, password combination is successful

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        return res.json({ status: 'ok', data: token })
    }

    res.json({ status: 'error', error: 'Invalid username/password' })
});

app.post('/register', (req, res) => {
    const { username, email, password: plainTextPassword, password2: plainTextPassword2, newslettersignup } = req.body;

    if (!username || typeof username !== 'string') {
        return res.json({status: 'error', error: 'Invalid username' })
    }
    
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be at least 6 characters'
        })
    }
    
    if (plainTextPassword != plainTextPassword2) {
        return res.json({status: 'error', error: 'Passwords do not match'})
    }

    if (!email || typeof email !== 'string') {
        return res.json({status: 'error', error: 'Invalid email'})
    }

     const password = bcrypt.hash(plainTextPassword, 13)

    try {
        // const response = User.create({
        //     username,
        //     password,
        //     email,
        //     newslettersignup
        // })
        client.db.collection('users').insertOne({
            username: username,
            password: password,
            email: email,
            newslettersignup: newslettersignup
        })
     } catch (error) {
         if (error.code === 11000) {
             // duplicate key
             return res.json({ status: 'error', error: 'Username already in use' })
         }
         throw error
     }

     res.json({ status: 'ok' })
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
});

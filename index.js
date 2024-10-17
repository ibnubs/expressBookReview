const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authenication mechanism here
    const token = req.headers['authorization'];
    console.log(`cek log tokennya ${token}`);
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            console.log(`ini log err yang ada di index ${err}`);
            return res.status(401).send('Invalid Token');
            
        }
        req.user = user;
        next();
    });
});

const PORT =5012;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

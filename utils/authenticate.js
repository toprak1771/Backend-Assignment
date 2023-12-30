const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.checkAuth = (req,res,next) => {
    const autHeader = req.headers['authorization'];
    const token = autHeader && autHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401).send('You do not have access!');

    jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
        if(err) return res.status(401).send('Not authenticate');

        req.user = user;
        console.log("JWT Token Verified");
        next();
    });
};
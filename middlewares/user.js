const mongoose = require('mongoose');
const jwt = require('jwt');
const { USER_JWT } = require('../config');


function userMiddleware(req,res,next) {
    const token = req.headers.token;
    const tokenVerify = jwt.verify(token, USER_JWT);
    if(!tokenVerify){
        return res.status(403).send({
            message: 'invalid token'
        })
    }
    else{
        req.userId = tokenVerify.userId;
        next()
    }
}

module.exports = {
    userMiddleware
}
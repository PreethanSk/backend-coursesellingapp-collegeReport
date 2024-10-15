const mongoose = require('mongoose');
const jwt = require('jwt');
const { ADMIN_JWT } = require('../config');
const{ adminModel } = require('../db')


async function adminMiddleware(req,res,next) {
    const token = req.headers.token;
    try {

        const tokenVerify = jwt.verify(token, ADMIN_JWT);
        if (tokenVerify) {
            req.userId = tokenVerify.userId;
            next()
        } else {
            res.status(403).send({
                message: 'invalid token'
            })
        }
    }
    catch (err) {
        res.status(500).send({
            message: 'server crashed'
        })
    }
}
module.exports = {
    adminMiddleware
}
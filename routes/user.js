const express = require('express');
const Router = express.Router;
const userRouter = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const { userModel, courseModel, purchaseModel} = require('../db');
const { USER_JWT } = require('../config');
const { userMiddleware } = require('../middlewares/user');

userRouter.post('/signup',async(req,res) => {
    const { email, password, username } = req.body;
    const zod0 = z.object({
        email: z.string().email(),
        password: z.string(),
        username: z.string()
    });
    const zodParse0 = zod0.safeParse(req.body);
    if(!zodParse0.success){
        return res.status(403).send({
            message: 'invalid entry'
        })
    }
    try{
        const hashPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            email,
            password: hashPassword,
            username
        })
        res.json({
            message: 'signed up'
        })
    }
    catch(err){
        res.status(500).send({
            message: 'server crashed'
        })
    }
})

userRouter.post('/singin',async (req,res) => {
    const { email, password } = req.body;
    const zod1 = z.object({
        email: z.string().email(),
        password: z.string()
    })
    const zodParse1 = zod1.safeParse(req.body);
    if(!zodParse1.success){
        return res.status(403).send({
            message: 'invalid entry'
        })
    }
   try{
       const userVerify = await userModel.findOne({
           email
       })
       if(!userVerify){
           return res.status(403).send({
               message: 'invalid user'
           })
       }
       else{
           const bcryptCompare = await bcrypt.compare(password, userVerify.password)
           if(!bcryptCompare){
               res.status(403).send({
                   message: 'invalid password'
               })
           }
           else{
               const token = jwt.sign({
                   userId: userVerify._id
               },USER_JWT)
               res.json({
                   token: token
               })
           }
       }
   }
    catch(err){
        res.json({
            message: 'server crashed'
        })
    }
})

userRouter.get('/purchases',userMiddleware,async(req,res) => {
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId
    })
    const courses = await courseModel.find({
        userId: {
            "$in": userId.
        }
    })
})


module.exports = {
    userRouter
}
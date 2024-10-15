const express = require('express');
const Router = express.Router;
const adminRouter = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const { adminModel, courseModel } = require('../db');
const { ADMIN_JWT } = require('../config');
const { adminMiddleware } = require('../middlewares/admin')

adminRouter.post('/signup',async (req,res) => {
    const { email, password, username } = req.body;
    const zod0 = z.object({
        email: z.string().email().min(5).max(50),
        password: z.string().min(5).max(50),
        username: z.string().min(5).max(20)
    })
    const zodParse0 = zod0.safeParse(req.body);
    if(!zodParse0.success){
        return res.status(403).send({
            message: 'invalid entry',
            error: zodParse0.error
        })
    }
try{
    const hashPassword = await bcrypt.hash(password, 10);
    await adminModel.create({
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

adminRouter.post('/signin',async (req,res) =>{
    const { email, password } = req.body;
    const zod1 = z.object({
        email: z.string().email(),
        password: z.string()
    })
    const zodParse1 = zod1.safeParse(req.body);
    if(!zodParse1.success){
        return res.status(403).send({
            message: 'invalid entry',
            error: zodParse1.error
        })
    }
    try{
        const userVerify = await adminModel.findOne({
            email
        })
        if(!userVerify){
            return res.status(403).send({
                message: 'invalid email'
            })
        }
        const passwordVerify = await bcrypt.compare(passowrd, userVerify.password);
        if(passwordVerify){
            const jwt = jwt.sign({
                userId: userVerify._id
            }, ADMIN_JWT)
            res.json({
                token: token
            })
        }
        else{
            return res.status(403).send({
                message:'invalid password'
            })
        }

    }
    catch(err){
        res.status(500).send({
            message: 'server crashed'
        })
    }

})

adminRouter.post('/createCourse',adminMiddleware,async(req,res) => {
    const userId = req.userId;
    const { title, description, price } = req.body;
    try{
        const course = await courseModel.create({
            title,
            description,
            price,
            userId
        })
        res.json({
            message:'course created',
            courseId: course._id
        })
    }
    catch(err){
        res.status(500).send({
            message: 'server crashed'
        })
    }

})

adminRouter.put('/updateCourse',adminMiddleware, async(req,res) =>{
    const userId = req.userId;
    const { title, description, price, courseId } = req.body;
   try{
       const userVerify = await courseModel.findOne({
           userId, _id: courseId
       })
       if(userVerify){
            await courseModel.updateOne(
               {_id: courseId},
               {title,description, price}
           )
           res.json({
               message: 'course updated'
           })
       }
       else{
           res.status(403).send({
               message: 'you dont have acess'
           })
       }
   }
   catch(err){
       res.status(500).send({
           message: 'server crashed'
       })
   }
} )

adminRouter.delete('/deleteCourse',adminMiddleware,async (req,res) =>{
    const userId = req.userId;
    const courseId = req.body.courseId;
    try{

        const userIdVerify = await courseModel.findOne({
            userId, _id: courseId
        })
        if(userIdVerify){
            await courseModel.deleteOne(
                {_id: courseId}
            )
        }
        else{
            res.status(403).send({
                message: 'you dont have access'
            })
        }
    }
    catch(err){
        res.status(500).send({
            message: 'server crashed'
        })
    }
})


module.exports = {
    adminRouter
}
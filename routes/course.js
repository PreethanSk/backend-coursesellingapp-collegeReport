const express = require('express');
const Router = express.Router;
const courseRouter = Router();
const { userModel, courseModel, purchaseModel} = require('../db');
const { userMiddleware } = require('../middlewares/user');

courseRouter.post('/purchase',userMiddleware,async (req,res) =>{
    const userId = req.userId;
    const courseId = req.body.courseId;
    const purchase = await purchaseModel.create({
        userId,
        courseId
    })

})

courseRouter.get('/preview',async (req,res) => {
    const preview = await courseModel.find();
    res.json({
        preview
    })
})
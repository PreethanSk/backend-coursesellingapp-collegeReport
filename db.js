const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const user = new Schema ({
    email: { type: String, unique: true },
    password: String,
    username: String
})

const admin = new Schema ({
    email: { type: String, unique: true },
    password: String,
    username: String
})

const course = new Schema ({
    title: String,
    description: String,
    price: Number,
    userId: ObjectId
})

const purchase = new Schema ({
    userId: ObjectId,
    courseId: ObjectId
})

const userModel = mongoose.model("users",user);
const adminModel = mongoose.model("admin",admin);
const courseModel = mongoose.model("courses",course);
const purchaseModel = mongoose.model("purchases",purchase);

module.exports ={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URL } = require("./config");
const { adminRouter } = require("./routes/admin");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");

mongoose.connect(MONGO_URL);
app.use(express.json());
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

app.listen(3000);

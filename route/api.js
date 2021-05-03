const express = require('express')
const router = express.Router()
const userRouter = require("./user");
const courseRouter = require("./course");
const courseCreatorRouter = require("./creator");

router.use("/user", userRouter);
router.use("/course", courseRouter); // /api/course/create
router.use("/creator", courseCreatorRouter);

module.exports = router;
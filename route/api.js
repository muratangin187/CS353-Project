const express = require('express')
const router = express.Router()
const userRouter = require("./user");
const courseRouter = require("./course");

router.use("/user", userRouter);
router.use("/course", courseRouter);


module.exports = router;
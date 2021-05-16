const db = require("../db");
const express = require('express')
const jwt = require("jsonwebtoken");
const {SECRET} = require("../config");
const {verifyToken} = require("../authMiddle");
const router = express.Router()

router.get("/:id", async (req, res) => {
    let result = await db.getUserById(parseInt(req.params.id));
    res.status(200).send(result);
});

router.get("/bought-courses/:id", async (req, res)=>{
    console.log(JSON.stringify(req.params.id));
    let result = await db.getCourseBought(
        req.params.id,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});

router.get("/wishlist-courses/:id", async (req, res)=>{
    console.log(JSON.stringify(req.params.id));
    let result = await db.getCourseAddedWishlist(
        req.params.id,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});


router.get("/cart-courses/:id", async (req, res)=>{
    console.log(JSON.stringify(req.params.id));
    let result = await db.getCourseAddedCart(
        req.params.id,
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});

router.delete("/remove-wishlist/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.removeCourseFromWishlist(
        req.params.cid,
    );
    if(result == null){
        res.status(404).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});

router.get("/get-refunds/:uid", async(req, res)=>{
    let result = await db.getUserRefunds(req.params.uid);
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db read stage of refund creation."});
    }else{
        res.status(200).send(result);
    }
});

router.post("/load-balance", async(req, res)=>{
    let result = await db.loadUserBalance(req.body.userId, req.body.balance);
    if(result){
        res.status(200).send({"message": "Successfully loaded balance."});
    }else{
        res.status(400).send({"message": "There is an error occured in the db write stage of balance."});
    }
});

router.delete("/remove-cart/:cid", async (req, res)=>{
    console.log(JSON.stringify(req.params.cid));
    let result = await db.removeCourseFromCart(
        req.params.cid,
    );
    if(result == null){
        res.status(404).send({"message": "There is an error occurred in the db retrieve stage of course creation."});
    }else{
        console.log(result);
        res.status(200).send(result);
    }
});


router.post("/login", async (req, res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).send({message:"You need to provide username and password."});
        return;
    }
    let result = await db.checkCreds(
        req.body.username,
        req.body.password
    );
    if(result == null){
        res.status(400).send({message:"There is no user exists with given username and password"});
    }else{
        console.log("result:");
        console.log(result);
        const token = jwt.sign({ id: result.id }, SECRET, {
            expiresIn: 86400
        });
        res.send({message:"Login successfully", id: result.id, role: result.role, token: token});
    }
});

/**
 * @swaggerPath
 *
 * /api/user/register:
 *   post:
 *     summary: Register a regular user
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: username
 *         required: true
 *       - in: formData
 *         name: email
 *         required: true
 *       - in: formData
 *         name: photo
 *         required: true
 *       - in: formData
 *         name: name
 *         required: true
 *       - in: formData
 *         name: surname
 *         required: true
 *       - in: formData
 *         name: password
 *         required: true
 *     responses:
 *       '200':
 *         description: Operation was successful.
 *         schema:
 *       '400':
 *         description: Server error
 */
router.post("/register", async(req, res) => {
    let user = await db.checkUserExists(req.body.username, req.body.email);
    if(user){
        res.status(400).send({message:"There is a user with same email or username already."});
        return;
    }
    if(!req.body.username || !req.body.email || !req.body.photo ||
        !req.body.name || !req.body.surname || !req.body.password){
        res.status(400).send({message:"You need to provide username, email, photo, name, surname, password and account type."});
        return;
    }

    let result = await db.insertPerson(
        req.body.username,
        req.body.email,
        req.body.photo,
        req.body.name,
        req.body.surname,
        req.body.password
    );
    if(!result){
        res.status(400).send({"message": "There is an error occured in the db write stage of person."});
    }else{
        let result2;
        if(req.body.isCreator)
            result2 = await db.insertCreator(result);
        else
            result2 = await db.insertUser(result);
        if(!result){
            res.status(400).send({"message": "There is an error occured in the db write stage of a user."});
        }else {
            res.status(200).send({"message": "Successfully user registered."});
        }
    }
});

router.post("/change-balance", async (req, res) => {
    let response = await db.changeBalance(req.body.userId, req.body.amount);
    if(!response){
        res.status(400).send({"message": "There is an error occured in the db write stage of balance."});
    }else {
        res.status(200).send({"message": "Successfully updated user balance."});
    }
});

router.get("/logout", (req, res) => {
    res.json({"api": "logout"});
});

router.get("/getUserCertificates/:uid", async (req, res) => {
    let response = await db.getUserCertificates(req.params.uid);
    if(response == null){
        res.status(400).send([]);
    }else{
        console.log(response);
        res.status(200).send(response);
    }
});


module.exports = router;
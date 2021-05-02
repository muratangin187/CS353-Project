const db = require("../db");
const express = require('express')
const jwt = require("jsonwebtoken");
const {SECRET} = require("../config");
const router = express.Router()

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
        const token = jwt.sign({ id: result }, SECRET, {
            expiresIn: 86400
        });
        res.send({message:"Login successfully", id: result, token: token});
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
        !req.body.name || !req.body.surname || !req.body.password || !req.body.isCreator){
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

router.get("/logout", (req, res) => {
    res.json({"api": "logout"});
});

module.exports = router;
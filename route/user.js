const db = require("../db");
const express = require('express')
const router = express.Router()

router.get("/login", (req, res) => {
    res.json({"api": "login"});
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
        res.status(400).send({message:"You need to provide username, email, photo, name, surname, password."});
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
        let result2 = await db.insertUser(result);
        if(!result){
            res.status(400).send({"message": "There is an error occured in the db write stage of user."});
        }else {
            res.status(200).send({"message": "Successfully user registered."});
        }
    }
});

router.get("/logout", (req, res) => {
    res.json({"api": "logout"});
});

module.exports = router;
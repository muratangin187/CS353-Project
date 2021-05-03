const db = require("../db");
const express = require('express')
const router = express.Router()

router.post("/create", async (req, res)=>{
    console.log(JSON.stringify(req.body));
    let result = await db.insertCourse(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.thumbnail,
        req.body.category,
        req.body.creator_id
    );
    if(result == null){
        res.status(400).send({"message": "There is an error occured in the db write stage of course creation."});
    }else{
        res.status(200).send({"message": "Successfully course created."});
    }
});

/**
 * @swaggerPath
 *
 * /api/course/creator/{creatorId}:
 *   get:
 *     summary: Get the information of the course creator
 *     operationId: getCourseCreatorById
 *     parameters:
 *       - name: creatorId
 *         in: path
 *         required: true
 *         schema:
 *              type: integer
 *              format: int64
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *              application/json
 *       '400':
 *         description: Unsuccessful operation
 *         content:
 *              application/json
 */

// TODO fix swaggerpath
router.get("/creator/:creatorId", async (req, res) => {
    let creatorId = req.params["creatorId"];
    let result = await db.getCourseCreator(creatorId);
    console.log("course.js\n");
    console.log(result); // TODO delete console log
    if (result == null)
        res.status(400).send({"message": "While getting the information of course creator an error occurred."});
    else
        res.status(200).send(result);
});

module.exports = router;

const db = require("../db");
const express = require('express');
const router = express.Router();

/**
 * @swaggerPath
 *
 * /api/creator/{creatorId}:
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

router.get("/:creatorId", async (req, res) => {
    let creatorId = req.params["creatorId"];
    let result = await db.getCourseCreator(creatorId);
    if (result == null)
        res.status(400).send({"message": "While getting the information of course creator an error occurred."});
    else
        res.status(200).send(result[0]); //
});

module.exports = router;
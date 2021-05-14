const mysql = require('mysql');
const config = require("./config");

class Db{
    constructor() {
        this._db = mysql.createConnection({
            host     : config.HOST,
            user     : config.USER,
            password : config.PASSWORD,
            database : config.DB
        });
        this._db.connect();
    }

    test(){
        this._db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
        });
    }

    checkUserExists(username, email){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM Person WHERE username = ? OR email = ? LIMIT 1',
                [username, email],
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results[0]);
                    }
                });
        });
    }

    getCourse(cid){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM Course WHERE id = ? LIMIT 1',
                [cid],
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results);
                        resolve(results[0]);
                    }
                });
        });
    }

    insertPerson(username, email, photo, name, surname, password){
        return new Promise(resolve=> {
            this._db.query(
                'INSERT INTO Person (username, email, name, surname, password, photo) VALUES ?',
                [[[username, email, name, surname, password, photo]]],
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    insertCourse(title, price, description, thumbnail, category, creator_id){
        return new Promise(resolve=> {
            this._db.query(
                'INSERT INTO Course (title, price, description, thumbnail, category, creator_id) VALUES ?',
                [[[title, price, description, thumbnail, category, creator_id]]],
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    changeBalance(userId, amount){
        return new Promise(resolve => {
            this._db.query(
                `UPDATE User SET balance = balance + ${amount} WHERE id=${userId}`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(false);
                    }else{
                        resolve(true);
                    }
                }
            );
        });
    }

    insertCreator(id){
        return new Promise(resolve=> {
            this._db.query(
                `INSERT INTO Creator(id) VALUES (${id})`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(true);
                    }
                }
            );
        });
    }

    createDiscount(courseId, startDate, endDate, percentage, adminId){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO Discount(percentage, startDate, endDate, course_id, admin_id) VALUES ('${percentage}', '${startDate}', '${endDate}', '${courseId}', '${adminId}')`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(true);
                    }
                }
            );
        });
    }

    getAllCourses(){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM Course',
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results);
                        resolve(results);
                    }
                });
        });
    }

    filterCourses(minimum,maximum,order,orderDirection,search,categories, pageNumber){
        let offset = (pageNumber-1) * 10;
        let categoryString = "";
        categories.forEach(c=>categoryString+="'"+c+"',");
        categoryString = categoryString.substr(0, categoryString.length-1);
        let searchString = "%" + search + "%";
        console.log(categoryString);
        let sql = "";
        if(orderDirection == "ASC") orderDirection = "";
        if(order == "Price"){
            sql = `SELECT * FROM Course WHERE (category IN (${categoryString})) AND (price BETWEEN ${minimum} AND ${maximum}) AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}') ORDER BY price ${orderDirection} LIMIT ${offset}, 10;`;
        }else if(order == "Rating"){
            sql = `SELECT * FROM Course WHERE (category IN (${categoryString})) AND (price BETWEEN ${minimum} AND ${maximum}) AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}') ORDER BY averageRating ${orderDirection} LIMIT ${offset}, 10;`;
        }else{
            // TODO add it when discount added
            sql = `SELECT * FROM Course WHERE (category IN (${categoryString})) AND (price BETWEEN ${minimum} AND ${maximum}) AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}') ORDER BY price ${orderDirection} LIMIT ${offset}, 10;`;
        }
        return new Promise(resolve=>{
            this._db.query(sql, (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(sql);
                        console.log(results);
                        resolve(results);
                    }
                }
            );
        });
    }

    insertUser(id){
        return new Promise(resolve=> {
            this._db.query(
                `INSERT INTO User(id) VALUES (${id})`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(true);
                    }
                }
            );
        });
    }

    buyCourse(uid, cid){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO Buy(user_id, course_id) VALUES (${uid}, ${cid});`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    isLectureCompleted(uid, cid, lid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT * FROM CompleteLecture WHERE lecture_id = ${lid} AND user_id = ${uid} AND course_id = ${cid};`,
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve(!!results.length);
                    }
                }
            );
        });
    }

    isCourseRated(cid, uid){
        return new Promise( resolve => {
           this._db.query(
               `SELECT * FROM Rating WHERE user_id = ${uid} AND course_id = ${cid}`,
               (error, results, fields) => {
                   if(error) {
                       console.log(error);
                       resolve(false);
                   } else {
                       resolve(!!results.length);
                   }
               }
           );
        });
    }

    isCourseCompleted(cid, uid){
        return new Promise(resolve => {
            this._db.query(
                `WITH
                    Lids as (SELECT id as lecture_id, course_id FROM Lecture WHERE course_id = ${cid}),
                    CompLids as (SELECT lecture_id FROM CompleteLecture WHERE course_id = ${cid} AND user_id = ${uid})
                 SELECT DISTINCT(lecture_id)
                 FROM Lids, Buy
                 WHERE lecture_id NOT IN (
                    SELECT lecture_id
                    From CompLids
                 );`,
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(false);
                    } else {
                        this._db.query(
                            `SELECT COUNT(*) as cnt FROM Buy WHERE course_id=${cid} AND user_id=${uid};`,
                            (err, res, fie) => {
                                if(err){
                                    console.log(error);
                                    resolve(false);
                                } else {
                                    if( res[0].cnt != 1){
                                        resolve(false);
                                    } else {
                                        console.log();
                                        resolve(!(!!results.length));
                                    }
                                }
                            }
                        )
                    }
                }
            );
        })
    }

    getLectureIndices(cid){
        return new Promise( resolve => {
           this._db.query(
               `SELECT lecture_index, id FROM Lecture WHERE course_id = ${cid}`,
               (error, results, fields) => {
                   if(error) {
                       console.log(error);
                       resolve([]);
                   } else {
                       resolve(results);
                   }
               }
           )
        });
    }

    getUserCertificates(uid) {
        return new Promise( resolve => {
           this._db.query(
               `SELECT C.name, C.course_id FROM Certificate C, HasCertificates HC WHERE HC.certificate_id = C.id AND HC.user_id = ${uid};`,
               (error, results, fields) => {
                   if(error) {
                       console.log(error);
                       resolve(null);
                   } else {
                       resolve(results);
                   }
               }
           )
        });
    }

    getCourseRatings(cid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT * FROM Rating WHERE course_id = ${cid};`,
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve([]);
                    } else {
                        console.log(results);
                        resolve(results);
                    }
                }
            );
        });
    }

    completeLecture(uid, cid, lid){
        return new Promise( resolve => {
           this._db.query(
               `INSERT INTO CompleteLecture(lecture_id, user_id, course_id) VALUES (${lid}, ${uid}, ${cid});`,
               (error, results, fields) => {
                   if(error) {
                       console.log(error);
                       resolve(null);
                   } else {
                       resolve(results.insertId);
                   }
               }
           );
        });
    }

    getCourseCreator(id){
        return new Promise(resolve => {
           this._db.query(
               'SELECT * FROM Person NATURAL JOIN Creator WHERE ID = ?',
               [id],
               (error, results, fields)=>{
                   if(error){
                       console.log(error);
                       resolve(null);
                   }else{
                       resolve(results);
                   }
               }
           );
        });
    }

    getVisibleLectures(cid){
        return new Promise(resolve => {
            this._db.query(
                `SELECT * FROM Lecture WHERE course_id = ${cid} AND isVisible = 1`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            )
        })
    }

    getLecture(cid, lid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT * FROM Lecture WHERE course_id = ${cid} AND isVisible = 1 AND lecture_index = ${lid}`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        console.log("Get lecture: " + results[0]);
                        resolve(results[0]);
                    }
                }
            );
        })
    }

    getBookmarks(uid, lid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT * FROM Bookmark WHERE user_id=${uid} AND lecture_id=${lid}`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getAnnouncements(cid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT * FROM Announcement WHERE course_id=${cid}`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getCourseNamesOfCreator(uid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT id, title FROM Course WHERE creator_id=${uid}`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getNotes(uid, lid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT * FROM Note WHERE user_id=${uid} AND lecture_id=${lid}`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getMaxLectureIndex(cid){
        return new Promise( resolve => {
            this._db.query(
                `SELECT MAX(lecture_index) AS max_index FROM Lecture WHERE course_id = ${cid}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        if(results[0])
                            resolve(results[0]);
                        else
                            resolve({max_index:0});
                    }
                }
            );
        });
    }

    addBookmark(videoTimestamp, user_id, lecture_id) {
        return new Promise(resolve => {
            this._db.query(
                'INSERT INTO Bookmark (videoTimestamp, user_id, lecture_id) VALUES ?',
                [[[videoTimestamp, user_id, lecture_id]]],
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    addAnnouncement(title, content, creator_id, course_id) {
        return new Promise(resolve => {
            this._db.query(
                'INSERT INTO Announcement (title, content, creator_id, course_id) VALUES ?',
                [[[title, content, creator_id, course_id]]],
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        });
    }


    addRating(ratingScore, content, user_id, course_id){
        return new Promise( resolve => {
           this._db.query(
               `INSERT INTO Rating (ratingScore, content, user_id, course_id) VALUES ?`,
               [[[ratingScore, content, user_id, course_id]]],
               (error, results, fields) => {
                   if(error) {
                       console.log(error);
                       resolve(null);
                   } else {
                       resolve(true);
                   }
               }
           );
        });
    }

    updateRating(ratingScore, content, user_id, course_id) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE Rating
                 SET ratingScore = ${ratingScore}, content = '${content}'
                 WHERE user_id = ${user_id} AND course_id = ${course_id};`,
                (error, results, fields) => {
                    if(error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    addNote( title, content, user_id, lecture_id) {
        return new Promise( resolve => {
            this._db.query(
                'INSERT INTO Note (title, content, user_id, lecture_id) VALUES ?',
                [[[title, content, user_id, lecture_id]]],
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    addLecture( chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index){
        return new Promise( resolve => {
            this._db.query(
                'INSERT INTO Lecture (chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ?',
                [[[chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index]]],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results.insertId);
                    }
                }
            )
        });
    }

    makeRefund(courseId, title, reason, userId){
        return new Promise(resolve=>{
            this._db.query(
                'INSERT INTO Refund (title, reason, user_id, course_id) VALUES ?',
                [[[title, reason, userId, courseId]]],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        resolve(false);
                    } else {
                        console.log(results);
                        resolve(true);
                    }
                }
            );
        });
    }

    getUserById(userId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT * FROM Person WHERE id = \'${userId}\';`,
                async (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        if(results.length > 0) {
                            let isAdmin = await this.isAdmin(userId);
                            let isCreator = await this.isCreator(userId);
                            results[0].isAdmin = isAdmin;
                            results[0].isCreator = isCreator;
                            if(isCreator){
                                this._db.query(
                                    `SELECT * FROM Creator WHERE id = ${userId};`,
                                    (error, results2, fields) => {
                                        if (error){
                                            console.log(error);
                                            resolve(false);
                                        }else{
                                            if(results2.length > 0) {
                                                results[0] = {...results[0], ...results2[0]};
                                                resolve(results[0]);
                                            }else{
                                                resolve(null);
                                            }
                                        }
                                    }
                                );
                            }else{
                                this._db.query(
                                    `SELECT * FROM User WHERE id = ${userId};`,
                                    (error, results2, fields) => {
                                        if (error){
                                            console.log(error);
                                            resolve(false);
                                        }else{
                                            if(results2.length > 0) {
                                                results[0] = {...results[0], ...results2[0]};
                                                resolve(results[0]);
                                            }else{
                                                resolve(results[0]);
                                            }
                                        }
                                    }
                                );
                            }
                        }else{
                            resolve(null);
                        }
                    }
                }
            );
        });
    }

    checkCreds(username, password){
        return new Promise(resolve => {
            this._db.query(
                `SELECT id FROM Person WHERE username = \'${username}\' AND password = \'${password}\';`,
                async (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        if(results.length > 0) {
                            let isCreator = await this.isCreator(results[0].id);
                            let isAdmin = await this.isAdmin(results[0].id);
                            let role = "user";
                            if(isCreator){
                                role = "creator";
                            }else if(isAdmin){
                                role = "admin";
                            }
                            resolve({id:results[0].id, role: role});
                        }else{
                            resolve(null);
                        }
                    }
                }
            );
        });
    }

    isCreator(userId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT id FROM Creator WHERE id = ${userId};`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(false);
                    }else{
                        if(results.length > 0) {
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    }
                }
            );
        });
    }

    isAdmin(userId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT id FROM Admin WHERE id = ${userId};`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(false);
                    }else{
                        if(results.length > 0) {
                            resolve(true);
                        }else{
                            resolve(false);
                        }
                    }
                }
            );
        });
    }

    getUserCourses(userId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT * FROM Course, Buy WHERE course_id = id AND user_id = ${userId}`,
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results);
                        resolve(results);
                    }
                });
        });
    }

}
module.exports = new Db();
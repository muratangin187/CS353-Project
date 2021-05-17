const mysql = require('mysql');
const config = require("./config");
const crypto = require('crypto');

class Db{
    constructor() {
        this._db = mysql.createConnection({
            host     : config.HOST,
            user     : config.USER,
            password : config.PASSWORD,
            database : config.DB,
            multipleStatements: true
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
                `SELECT d.percentage as percentage FROM Allow a, Discount d WHERE a.discount_id = d.id AND d.course_id = ${cid} LIMIT 1`,
                (error, discounts, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        this._db.query(
                            'SELECT * FROM Course WHERE id = ? LIMIT 1',
                            [cid],
                            (error, results, fields)=>{
                                if(error){
                                    console.log(error);
                                    resolve(null);
                                }else{
                                    console.log("DISCOUNT:", JSON.stringify(discounts, null, 2));
                                    console.log("RESULTS IN :", JSON.stringify(results[0],null,2));
                                    if(discounts[0] && discounts[0].percentage)
                                        results[0].discount = discounts[0].percentage;
                                    else
                                        results[0].discount = 0;
                                    resolve(results[0]);
                                }
                            });
                    }
                });
        });
    }

    getCreatedCourses(uid){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM Course c WHERE c.creator_id = ?',
                [uid],
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

    getCourseBought(uid){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM Buy b, Course c WHERE b.user_id = ? AND c.id = b.course_id',
                [uid],
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

    getCourseAddedCart(uid){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM CartCourses b, Course c WHERE b.user_id = ? AND c.id = b.course_id',
                [uid],
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

    getCourseAddedWishlist(uid){
        return new Promise(resolve=>{
            this._db.query(
                'SELECT * FROM WishlistCourses b, Course c WHERE b.user_id = ? AND c.id = b.course_id',
                [uid],
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


    insertPerson(username, email, photo, name, surname, password){
        return new Promise(resolve=> {
            let hash = crypto.createHash('md5').update(password).digest('hex');
            this._db.query(
                'INSERT INTO Person (username, email, name, surname, password, photo) VALUES ?',
                [[[username, email, name, surname, hash, photo]]],
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
    
    averageCategory(){
        return new Promise(resolve=> {
            this._db.query(
                `SELECT c.category, AVG(c.price) as avgPrice FROM Course c GROUP BY c.category ORDER BY avgPrice DESC`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results);
                    }
                }
            );
        });
    }

    getMostBoughtCourses(){
        return new Promise(resolve=> {
            this._db.query(
                `SELECT c.id, c.title, t.user_count FROM Course c, (SELECT b.course_id as id, COUNT(user_id) as user_count FROM Buy b GROUP BY b.course_id) as t WHERE t.id = c.id ORDER BY user_count DESC LIMIT 6`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results);
                    }
                }
            );
        });
    }

    distributionOfCourses(){
        return new Promise(resolve=> {
            this._db.query(
                `SELECT c.category, COUNT(*) as counts FROM Course c GROUP BY c.category`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results);
                    }
                }
            );
        });
    }

    getMostRatedCourses(){
        return new Promise(resolve=> {
            this._db.query(
                `SELECT c.id, c.title, t.ratingAvg FROM Course c, (SELECT r.course_id as id, AVG(r.ratingScore) as ratingAvg FROM Rating r GROUP BY r.course_id) as t WHERE t.id = c.id ORDER BY ratingAvg DESC LIMIT 6`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        resolve(results);
                    }
                }
            );
        });
    }

    insertCourse(title, price, description, thumbnail, category, creator_id){
        return new Promise(resolve=> {
            let sql = `INSERT INTO Course (title, price, description, thumbnail, category, creator_id) VALUES ('${title}', ${price}, '${description}', '${thumbnail}', '${category}', ${creator_id})`;
            this._db.query(sql,(error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(sql);
                        console.log("SQL FOR CREATE COURSE\n", sql);
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

    closeRefund(refundId, isAccepted, adminId){
        return new Promise(resolve => {
            let status = isAccepted ? "ALLOWED" : "REJECTED";
            console.log(refundId + " - " + isAccepted);
            this._db.query(
                `UPDATE Refund SET state='${status}', admin_id=${adminId} WHERE id=${refundId}`,
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

    loadUserBalance(userId, balance){
        return new Promise(resolve=>{
            this._db.query(
                `UPDATE User SET balance = balance + ${balance} WHERE id = ${userId};`,
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(false);
                    }else{
                        console.log(results);
                        resolve(true);
                    }
                });
        });
    }

    changePhoto(uid, photo){
        return new Promise(resolve => {
            this._db.query(
                `UPDATE Person SET photo= '${photo}' WHERE id=${uid}`,
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

    changePassword(uid, newPassword){
        return new Promise(resolve => {
            let hash = crypto.createHash('md5').update(newPassword).digest('hex');
            this._db.query(
                `UPDATE Person SET password = '${hash}' WHERE id=${uid}`,
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

    removeNotification(nid){
            return new Promise(resolve => {
                this._db.query(
                    `DELETE FROM Notification WHERE id = ${nid}`,
                    (error, results, fields) => {
                        if(error){
                            console.log(error);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                );
            });
    }

    deleteCourse(id){
        return new Promise(resolve => {
            this._db.query(
                `DELETE FROM Course WHERE id = ${id}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    getUserNotifications(userId){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT rn.id as id, r.course_title as course_title, r.refund_title as title, r.reason as content, r.state as state, r.user_id as user_id
                FROM (SELECT c.title as course_title, r.id as rid, r.title as refund_title, r.reason as reason, r.state as state, r.user_id as user_id FROM Refund r, Course c WHERE r.course_id = c.id) as r,
                (SELECT * FROM Notification NATURAL JOIN RefundNotification) as rn WHERE rn.refund_id = r.rid AND r.user_id = ${userId} UNION
                SELECT an.id as id, a.course_title as course_title, a.announcement_title as title, a.content as content, Null AS state, an.user_id as user_id
                FROM (SELECT c.title as course_title, a.id as aid, a.title as announcement_title, a.content as content FROM Announcement a, Course c WHERE a.course_id = c.id) as a,
                (SELECT * FROM Notification NATURAL JOIN AnnouncementNotification) as an WHERE an.announcement_id = a.aid AND an.user_id = ${userId};`,
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve([]);
                    }else{
                        console.log(results);
                        resolve(results);
                    }
                });
        });
    }

    cancelRefund(rid){
        return new Promise(resolve=>{
            this._db.query(
                `DELETE FROM Refund WHERE id = ${rid}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    getUserRefunds(userId){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT ref.id, ref.title, ref.reason, ref.state, ref.seen, ref.reason, c.title as course_title, c.id as course_id, p.username as username FROM Refund ref, Course c, Person p WHERE ref.course_id = c.ID AND ref.user_id = p.ID AND ref.user_id=${userId} ORDER BY admin_id;`,
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

    getAllRefunds(){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT ref.id, ref.title, ref.reason, ref.state, ref.seen, ref.reason, c.title as course_title, c.id as course_id, p.username as username FROM Refund ref, Course c, Person p WHERE ref.course_id = c.ID AND ref.user_id = p.ID ORDER BY admin_id;`,
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

    allowDiscount(cid, did, isAllowed){
        if(isAllowed){
            return new Promise(resolve => {
                this._db.query(
                    `INSERT INTO Allow(creator_id, discount_id) VALUES ('${cid}', '${did}')`,
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
        }else{
            return new Promise(resolve => {
                this._db.query(
                    `DELETE FROM Discount WHERE id = ${did}`,
                    (error, results, fields) => {
                        if(error){
                            console.log(error);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                );
            });
        }
    }

    disableDiscount(did){
        return new Promise(resolve => {
            this._db.query(
                `DELETE FROM Allow WHERE discount_id = ${did}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    deleteLecture(lid){
        return new Promise(resolve => {
            this._db.query(
                `DELETE FROM Lecture WHERE id = ${lid}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    deleteAnnouncement(aid){
        return new Promise(resolve => {
            this._db.query(
                `DELETE FROM Announcement WHERE id = ${aid}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    isDiscountAllowed(did){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT * FROM Allow WHERE discount_id = ${did} LIMIT 1`,
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(false);
                    }else{
                        if(results.length == 1)
                            resolve(true);
                        else
                            resolve(false);
                    }
                });
        });
    }

    getAllDiscounts(cid){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT d.id as id, d.percentage as percentage, d.startDate as startDate, d.endDate as endDate, d.course_id as course_id, d.admin_id as admin_id, c.price FROM Discount d, Course c WHERE d.course_id = c.id AND c.id = ${cid};`,
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

    getQuestionChildren(qid){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT q.id as id, q.content as content, q.date as date, q.parent_id as parent_id, p.username as username FROM Question q, Person p WHERE p.id = q.user_id AND q.parent_id = ${qid}`,
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve([]);
                    }else{
                        console.log(results);
                        resolve(results);
                    }
                });
        });
    }

    getRootQuestions(cid){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT q.id as id, q.content as content, q.date as date, q.parent_id as parent_id, p.username as username FROM Question q, Person p WHERE p.id = q.user_id AND q.parent_id IS null AND course_id = ${cid}`,
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

    getAnswer(qid){
        return new Promise(resolve=>{
            this._db.query(
                `SELECT a.id as id, a.content as content, a.date as date, a.question_id as question_id, p.username as username FROM Answer a, Person p WHERE p.id = a.creator_id AND a.question_id = ${qid}`,
                (error, results, fields)=>{
                    if(error){
                        console.log(error);
                        resolve(null);
                    }else{
                        console.log(results[0]);
                        resolve(results[0]);
                    }
                });
        });
    }

    answerQuestion(content, uid, qid){
        return new Promise(resolve=> {
            this._db.query(
                `INSERT INTO Answer(content, question_id, creator_id) VALUES ('${content}', ${qid}, ${uid})`,
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

    askQuestion(content, cid, qid, uid){
        return new Promise(resolve=> {
            if(qid){
                this._db.query(
                    `INSERT INTO Question(content, course_id, parent_id, user_id) VALUES ('${content}', ${cid}, ${qid}, ${uid})`,
                    (error, results, fields) => {
                        if (error){
                            console.log(error);
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    }
                );
            }else{
                this._db.query(
                    `INSERT INTO Question(content, course_id, user_id) VALUES ('${content}', ${cid}, ${uid})`,
                    (error, results, fields) => {
                        if (error){
                            console.log(error);
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                    }
                );
            }
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

    searchCourses(search, uid, isCreator){
        let searchString = "%" + search + "%";
        return new Promise(resolve=>{
            if(isCreator){
                    this._db.query(
                        `SELECT * FROM Course WHERE c.creator_id = ${uid} AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}')`,
                        (error, results, fields)=>{
                            if(error){
                                console.log(error);
                                resolve([]);
                            }else{
                                //console.log(results);
                                resolve(results);
                            }
                        }
                    );
            }else{
                    this._db.query(
                        `SELECT * FROM Buy b, Course c WHERE b.course_id = c.id AND b.user_id = ${uid} AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}')`,
                        (error, results, fields)=>{
                            if(error){
                                console.log(error);
                                resolve([]);
                            }else{
                                //console.log(results);
                                resolve(results);
                            }
                        }
                    );
            }
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
        if(maximum == 1000) maximum = 9999;
        if(order == "Price"){
            sql += `SELECT * FROM DiscountedCourse WHERE (category IN (${categoryString})) AND (price*(100-discount)/100 BETWEEN ${minimum} AND ${maximum}) AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}') ORDER BY price*(100-discount)/100 ${orderDirection} LIMIT ${offset}, 11;`;
        }else if(order == "Rating"){
            sql += `SELECT * FROM DiscountedCourse WHERE (category IN (${categoryString})) AND (price*(100-discount)/100 BETWEEN ${minimum} AND ${maximum}) AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}') ORDER BY averageRating ${orderDirection} LIMIT ${offset}, 10;`;
        }else{
            // TODO add it when discount added
            sql += `SELECT * FROM DiscountedCourse WHERE (category IN (${categoryString})) AND (price*(100-discount)/100 BETWEEN ${minimum} AND ${maximum}) AND (description LIKE '${searchString}' OR title LIKE '${searchString}' OR category LIKE '${searchString}') ORDER BY discount ${orderDirection} LIMIT ${offset}, 10;`;
        }
        return new Promise(resolve=>{
            this._db.query(sql, (error, results, fields) => {
                console.log(sql);
                    if (error){
                        console.log(error);
                        resolve([]);
                    }else{
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

    addCourseToCart(uid, cid){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO CartCourses(user_id, course_id) VALUES (${uid}, ${cid});`,
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

    addCourseToWishlist(uid, cid){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO WishlistCourses(user_id, course_id) VALUES (${uid}, ${cid});`,
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
    removeCourseFromCart(cid){
        return new Promise(resolve => {
            this._db.query(
                `DELETE FROM CartCourses w WHERE w.course_id = ?`,
                [cid],
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }
    removeCourseFromWishlist(cid){
        return new Promise(resolve => {
            this._db.query(
                `DELETE FROM WishlistCourses w WHERE w.course_id = ?`,
                [cid],
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
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

    isCourseBought(cid, uid){
        return new Promise( resolve => {
           this._db.query(
               `SELECT * FROM Buy WHERE user_id = ${uid} AND course_id = ${cid};`,
               (error, results, fields) => {
                   if( error) {
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

    getLectureInfo(cid, uid){
        return new Promise(resolve => {
            this._db.query(
                `SELECT COUNT(*) as totalLectureCount FROM Lecture WHERE course_id = ${cid} AND isVisible = 1; SELECT COUNT(*) as completedCount FROM CompleteLecture WHERE course_id = ${cid} AND user_id = ${uid}`,
                (error, results, fields) => {
                    if(error){
                        console.log(error);
                        resolve(null);
                    } else {
                        console.log("-------------");
                        console.log(JSON.stringify(results,null,2));
                        console.log("-------------");
                        resolve([results[0][0].totalLectureCount, results[1][0].completedCount]);
                    }
                }
            )
        })
    }

    getAllLectures(cid){
        return new Promise(resolve => {
            this._db.query(
                `SELECT * FROM Lecture WHERE course_id = ${cid}`,
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
                `SELECT * FROM Lecture WHERE course_id = ${cid} AND isVisible = 1 AND id = ${lid}`,
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

    updateTitle(id, title) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE Course SET title = '${title}' WHERE id = ${id};`,
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

    updateDescription(id, description) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE Course SET description = '${description}' WHERE id = ${id};`,
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

    updatePrice(id, price) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE Course SET price = ${price} WHERE id = ${id};`,
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

    updateThumbnail(id, thumbnail) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE Course SET thumbnail = '${thumbnail}' WHERE id = ${id};`,
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

    toggleVisibility(lid) {
        return new Promise( resolve => {
            this._db.query(
                `UPDATE Lecture
                 SET isVisible = 1 - isVisible
                 WHERE id = ${lid};`,
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
            let hash = crypto.createHash('md5').update(password).digest('hex');
            this._db.query(
                `SELECT id FROM Person WHERE username = \'${username}\' AND password = \'${hash}\';`,
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


    addCourseToCard(uid, cid){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO CartCourses(user_id, course_id) VALUES (${uid}, ${cid});`,
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

    addCourseToWishlist(uid, cid){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO WishlistCourses(user_id, course_id) VALUES (${uid}, ${cid});`,
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

    insertQuiz(duration, name, creator_id, course_id){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO Quiz(duration, name, creator_id, course_id)
                VALUES (\'${duration}\', \'${name}\', \'${creator_id}\', \'${course_id}\');`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        console.log("results.insertId");
                        console.log(results.insertId);
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    insertFlashCard(question, quiz_id){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO FlashCard(question, quiz_id)
                VALUES (\'${question}\', \'${quiz_id}\');`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    insertTrueFalse(f_id, answer){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO TrueFalse(id, answer)
                VALUES (\'${f_id}\', \'${answer}\');`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    // INSERT INTO MultipleChoice(ID, choice1, choice2, choice3, choice4, answer)
    // SELECT ID, <written_choice1>, <written_choice2>, <written_choice3>, <written_choice4>, <selected_answer>
    // FROM FlashCard f
    // WHERE f.question = <written_question> AND f.quiz_id IN (SELECT q.ID
    // FROM Quiz q
    // WHERE q.creator_id = @creator_id AND q.course_id = @course_id);
    insertMultiple(f_id, choice1, choice2, choice3, choice4, answer){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO MultipleChoice(id, choice1, choice2, choice3, choice4, answer)
                VALUES (\'${f_id}\', \'${choice1}\', \'${choice2}\', \'${choice3}\', \'${choice4}\', \'${answer}\');`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }



    getQuizzes(course_id){
        console.log("");
        return new Promise(resolve => {
            this._db.query(
                `SELECT id, name, duration
                FROM Quiz
                WHERE course_id = \'${course_id}\';`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getCompletedQuizzes(course_id, user_id){
        return new Promise(resolve => {
            this._db.query(
                `SELECT id, score
                FROM Quiz, CompletedQuizzes
                WHERE id = quiz_id AND course_id = \'${course_id}\' AND user_id = \'${user_id}\';`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getQuizInf(quiz_id){
        return new Promise(resolve => {
           this._db.query(
               `SELECT name, duration
               FROM Quiz
               WHERE id = \'${quiz_id}\';`,
               (error, result, fields) => {
                   if (error){
                       console.log(error);
                       resolve(null);
                   } else {
                       resolve(result);
                   }
               }
           );
        });
    }

    getQuizQATF(quiz_id){
        return new Promise(resolve => {
            this._db.query(
                `SELECT id, question, answer 
                FROM FlashCard NATURAL JOIN TrueFalse
                WHERE quiz_id = \'${quiz_id}\';`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getQuizQAM(quiz_id){
        return new Promise(resolve => {
            this._db.query(
                `SELECT id, question, choice1, choice2, choice3, choice4, answer
                FROM FlashCard f NATURAL JOIN MultipleChoice m
                WHERE f.quiz_id = \'${quiz_id}\';`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    insertCompletedQuiz(quiz_id, user_id, score){
        return new Promise(resolve => {
            this._db.query(
                `INSERT INTO CompletedQuizzes(quiz_id, user_id, score)
                VALUES (\'${quiz_id}\', \'${user_id}\', \'${score}\');`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    clearDiscounts(){
        this._db.query(
            `SELECT id FROM Discount WHERE endDate < CURRENT_TIMESTAMP`,
            (error, results, fields) => {
                if(error){
                    console.log(error);
                }else{
                    for(let i = 0; i < results.length; i++){
                        this._db.query(
                            `DELETE FROM Allow WHERE discount_id = ${results[i].id}`,
                            (error, results, fields) => {
                                if(error){
                                    console.log(error);
                                } else {
                                }
                            }
                        );
                        this._db.query(
                            `DELETE FROM Discount WHERE id = ${results[i].id}`,
                            (error, results, fields) => {
                                if(error){
                                    console.log(error);
                                } else {
                                }
                            }
                        );
                    }
                    console.log(results);
                }
            }
        );
    }

    getNumberOfAttenders(courseId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT q.id, COUNT(*) AS count
                FROM Quiz q, CompletedQuizzes c
                WHERE q.id = c.quiz_id AND q.course_id = \'${courseId}\'
                GROUP BY q.id;`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    getScoreAvg(courseId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT q.id, AVG(c.score) AS count
                FROM Quiz q, CompletedQuizzes c
                WHERE q.id = c.quiz_id AND q.course_id = \'${courseId}\'
                GROUP BY q.id;`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }
}
module.exports = new Db();

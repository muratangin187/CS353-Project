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

    insertCreator(id){
        return new Promise(resolve=> {
            this._db.query(
                `INSERT INTO Creator(ID) VALUES (${id})`,
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

    insertUser(id){
        return new Promise(resolve=> {
            this._db.query(
                `INSERT INTO User(ID) VALUES (${id})`,
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

    getUserById(userId){
        return new Promise(resolve => {
            this._db.query(
                `SELECT * FROM Person WHERE id = \'${userId}\';`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        if(results.length > 0) {
                            resolve(results[0]);
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
                `SELECT ID FROM Person WHERE username = \'${username}\' AND password = \'${password}\';`,
                (error, results, fields) => {
                    if (error){
                        console.log(error);
                        resolve(null);
                    }else{
                        if(results.length > 0) {
                            let isCreator = this.isCreator(results[0].ID);
                            let isAdmin = this.isAdmin(results[0].ID);
                            let role = isCreator ? "creator" : (isAdmin ? "admin" : "user");
                            resolve({id:results[0].ID, role: role});
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
                `SELECT ID FROM Creator WHERE ID = \'${userId}\';`,
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
                `SELECT ID FROM Admin WHERE ID = \'${userId}\';`,
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
}
module.exports = new Db();
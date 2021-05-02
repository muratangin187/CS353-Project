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
                        console.log(results.insertId);
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
                        console.log(results.insertId);
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
                            resolve(results[0].ID);
                        }else{
                            resolve(null);
                        }
                    }
                }
            );
        });
    }
}
module.exports = new Db();
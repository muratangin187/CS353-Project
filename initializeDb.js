const config = require("./config.js");
const mysql = require("mysql");

let db = mysql.createConnection({
    host     : config.HOST,
    user     : config.USER,
    password : config.PASSWORD,
    database : config.DB
});

async function main (){
    await db.connect();
    console.log("DB connection initialized.");

    await db.query('DROP TABLE IF EXISTS `course`;');
    await db.query('DROP TABLE IF EXISTS `user`;');
    await db.query('DROP TABLE IF EXISTS `creator`;');
    await db.query('DROP TABLE IF EXISTS `admin`;');
    await db.query('DROP TABLE IF EXISTS `person`;');

    console.log("DB tables removed.");

    await db.query('CREATE TABLE Person(\n' +
        'ID INT AUTO_INCREMENT,\n' +
        'email VARCHAR(64) NOT NULL,\n' +
        'password VARCHAR(30) NOT NULL,\n' +
        'name VARCHAR(20) NOT NULL,\n' +
        'surname VARCHAR(20) NOT NULL,\n' +
        'username VARCHAR(20) NOT NULL,\n' +
        'photo VARCHAR(255),\n' +
        'PRIMARY KEY (ID),\n' +
        'UNIQUE(email),\n' +
        'UNIQUE(username));');

    await db.query('CREATE TABLE User( ID INT AUTO_INCREMENT,\n' +
        'hideCourses TINYINT(1) NOT NULL DEFAULT 0,\n' +
        'balance DECIMAL(10,2) NOT NULL DEFAULT 0,\n' +
        'PRIMARY KEY (ID),\n' +
        'FOREIGN KEY (ID) REFERENCES Person(ID)\n' +
        ');');

    await db.query('CREATE TABLE Creator( ID INT AUTO_INCREMENT,\n' +
        'about VARCHAR(1024),\n' +
        'website VARCHAR(255),\n' +
        'linkedin VARCHAR(255),\n' +
        'youtube VARCHAR(255),\n' +
        'PRIMARY KEY (ID),\n' +
        'FOREIGN KEY (ID) REFERENCES Person(ID)\n' +
        ');');

    await db.query('CREATE TABLE Admin( ID INT AUTO_INCREMENT,\n' +
        'PRIMARY KEY (ID),\n' +
        'FOREIGN KEY (ID) REFERENCES Person(ID)\n' +
        ');');

    await db.query('CREATE TABLE Course( ID INT AUTO_INCREMENT,\n' +
        'title VARCHAR(64) NOT NULL,' +
        'price NUMERIC(6, 2) NOT NULL,' +
        'description VARCHAR(255) NOT NULL,' +
        'thumbnail VARCHAR(255) NOT NULL,' +
        'category VARCHAR(64) NOT NULL,' +
        'creator_id INT NOT NULL,' +
        'averageRating FLOAT NOT NULL DEFAULT 0,' +
        'ratingCount INT NOT NULL DEFAULT 0,'   +
        'PRIMARY KEY (ID),' +
        'FOREIGN KEY (creator_id) REFERENCES Creator(ID)' +
        ');');

    console.log("DB tables created.");
    console.log("Initialization finished");
}

main().then(()=>db.end());
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

    await db.query('DROP TABLE IF EXISTS `Discount`;');
    await db.query('DROP TABLE IF EXISTS `Course`;');
    await db.query('DROP TABLE IF EXISTS `User`;');
    await db.query('DROP TABLE IF EXISTS `Creator`;');
    await db.query('DROP TABLE IF EXISTS `Admin`;');
    await db.query('DROP TABLE IF EXISTS `Person`;');
    console.log("DB tables removed.");
    await db.query('CREATE TABLE Person(\n' +
        'id INT AUTO_INCREMENT,\n' +
        'email VARCHAR(64) NOT NULL,\n' +
        'password VARCHAR(30) NOT NULL,\n' +
        'name VARCHAR(20) NOT NULL,\n' +
        'surname VARCHAR(20) NOT NULL,\n' +
        'username VARCHAR(20) NOT NULL,\n' +
        'photo VARCHAR(255),\n' +
        'PRIMARY KEY (id),\n' +
        'UNIQUE(email),\n' +
        'UNIQUE(username));');

    await db.query('CREATE TABLE User( id INT AUTO_INCREMENT,\n' +
        'hideCourses TINYINT(1) NOT NULL DEFAULT 0,\n' +
        'balance DECIMAL(10,2) NOT NULL DEFAULT 0,\n' +
        'PRIMARY KEY (id),\n' +
        'FOREIGN KEY (id) REFERENCES Person(id)\n' +
        ');');

    await db.query('CREATE TABLE Creator( id INT AUTO_INCREMENT,\n' +
        'about VARCHAR(1024),\n' +
        'website VARCHAR(255),\n' +
        'linkedin VARCHAR(255),\n' +
        'youtube VARCHAR(255),\n' +
        'PRIMARY KEY (id),\n' +
        'FOREIGN KEY (id) REFERENCES Person(id)\n' +
        ');');

    await db.query('CREATE TABLE Admin( id INT AUTO_INCREMENT,\n' +
        'PRIMARY KEY (id),\n' +
        'FOREIGN KEY (id) REFERENCES Person(id)\n' +
        ');');

    await db.query('CREATE TABLE Course( id INT AUTO_INCREMENT,\n' +
        'title VARCHAR(64) NOT NULL,' +
        'price NUMERIC(6, 2) NOT NULL,' +
        'description VARCHAR(255) NOT NULL,' +
        'thumbnail VARCHAR(255) NOT NULL,' +
        'category VARCHAR(64) NOT NULL,' +
        'creator_id INT NOT NULL,' +
        'averageRating FLOAT NOT NULL DEFAULT 0,' +
        'ratingCount INT NOT NULL DEFAULT 0,'   +
        'PRIMARY KEY (id),' +
        'FOREIGN KEY (creator_id) REFERENCES Creator(id)' +
        ');');

    await db.query(
           `CREATE TABLE Discount( id INT AUTO_INCREMENT,
            percentage NUMERIC (5,2) NOT NULL,
            startDate DATETIME NOT NULL,
            endDate DATETIME NOT NULL,
            course_id INT NOT NULL,
            admin_id INT NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (course_id) REFERENCES Course(id),
            FOREIGN KEY (admin_id) REFERENCES Admin(id));`
    );

    console.log("DB tables created.");



    console.log("Initialization finished");
}

main().then(()=>db.end());
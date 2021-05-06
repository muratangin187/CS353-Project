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

    await db.query('DROP TABLE IF EXISTS `Buy`;');
    await db.query('DROP TABLE IF EXISTS `Note`;');
    await db.query('DROP TABLE IF EXISTS `Bookmark`;');
    await db.query('DROP TABLE IF EXISTS `Lecture`;');
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

    /**
     *  getdate() default olmuyor elle girecez
     */
    await db.query(
        'CREATE TABLE Lecture( id INT AUTO_INCREMENT, ' +
        'chapterName VARCHAR(64) NOT NULL, ' +
        'title VARCHAR(64) NOT NULL, ' +
        'duration TIME(6) NOT NULL, ' +
        'date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
        'isVisible TINYINT(1) NOT NULL DEFAULT 1, ' +
        'additionalMaterial VARCHAR(255), ' +
        'video VARCHAR(512), ' +
        'course_id INT NOT NULL, ' +
        'lecture_index INT NOT NULL, ' +
        'PRIMARY KEY (id), ' +
        'UNIQUE( course_id, lecture_index), ' +
        'FOREIGN KEY (course_id) REFERENCES Course(id)' +
        ');'
);

    await db.query(
        'CREATE TABLE Note( id INT AUTO_INCREMENT,' +
        'title VARCHAR(64) NOT NULL,' +
        'content VARCHAR(512),' +
        'date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        'user_id INT NOT NULL,' +
        'lecture_id INT NOT NULL,' +
        'PRIMARY KEY (id),' +
        'FOREIGN KEY (user_id) REFERENCES User(id),' +
        'FOREIGN KEY (lecture_id) REFERENCES Lecture(id)' +
        ');'
);

    await db.query(
        'CREATE TABLE Bookmark( id INT AUTO_INCREMENT,' +
        'videoTimestamp TIME(6) NOT NULL,' +
        'date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        'user_id INT NOT NULL,' +
        'lecture_id INT NOT NULL,' +
        'PRIMARY KEY (id),' +
        'FOREIGN KEY (user_id) REFERENCES User(id),' +
        'FOREIGN KEY (lecture_id) REFERENCES Lecture(id)' +
        ');'
);

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

    await db.query(
        `CREATE TABLE Buy( user_id INT,
        course_id INT,
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY user_id REFERENCES User(id),
        FOREIGN KEY course_id REFERENCES Buy(id));`
    );

    console.log("DB tables created.");

    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_user', 'test_user@gmail.com', 'Mehmet', 'Testoglu', '123', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_creator', 'test_creator@gmail.com', 'David', 'Testoglu', '123', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_admin', 'test_admin@gmail.com', 'Atalar', 'Testoglu', '123', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (0, false, 10000);`);
    await db.query(`INSERT INTO Creator (id,about, website, linkedin, youtube) VALUES (1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nibh arcu, facilisis nec posuere eget, molestie ac felis. Aenean aliquam, nibh scelerisque pharetra pharetra, mi nunc hendrerit urna, in iaculis sapien est sit amet ex. Quisque sit amet ante eros. In hac habitasse platea dictumst. Cras convallis augue eget libero egestas, luctus malesuada diam pretium.', 'www.google.com', 'www.linkedin.com', 'www.youtube.com');`);
    await db.query(`INSERT INTO Admin (id) VALUES (2);`);
    await db.query(`INSERT INTO Course(id,title,price,description,thumbnail,category,creator_id,averageRating,ratingCount) VALUES (0, 'Python egitimi', 120, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nibh arcu, facilisis nec posuere eget, molestie ac felis. Aenean aliquam, nibh scelerisque pharetra pharetra, mi nunc hendrerit urna.', 'https://i1.wp.com/stickker.net/wp-content/uploads/2015/09/python.png?fit=600,600&ssl=1', 'Technology', 1, 4.5, 1)`);

    console.log("Initialization finished");
}

main().then(()=>db.end());
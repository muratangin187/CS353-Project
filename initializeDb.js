const config = require("./config.js");
const mysql = require("mysql");
const crypto = require('crypto');

let db = mysql.createConnection({
    host     : config.HOST,
    user     : config.USER,
    password : config.PASSWORD,
    database : config.DB
});

async function main (){
    await db.connect();
    console.log("DB connection initialized.");

    await db.query('DROP TABLE IF EXISTS `RefundNotification`;');
    await db.query('DROP TABLE IF EXISTS `AnnouncementNotification`;');
    await db.query('DROP TABLE IF EXISTS `Notification`;');
    await db.query('DROP TABLE IF EXISTS `Answer`;');
    await db.query('DROP TABLE IF EXISTS `Question`;');
    await db.query('DROP TABLE IF EXISTS `Allow`;');
    await db.query('DROP TRIGGER IF EXISTS `rating_update`;');
    await db.query('DROP TRIGGER IF EXISTS `rating_insert`;');
    await db.query('DROP TRIGGER IF EXISTS `give_certificate`;');
    await db.query('DROP TRIGGER IF EXISTS `create_certificate`;');
    await db.query('DROP TABLE IF EXISTS `HasCertificates`;');
    await db.query('DROP TABLE IF EXISTS `Certificate`;');
    await db.query('DROP TABLE IF EXISTS `Announcement`;');
    await db.query('DROP TABLE IF EXISTS `Rating`;');
    await db.query('DROP TABLE IF EXISTS `MultipleChoice`;')
    await db.query('DROP TABLE IF EXISTS `TrueFalse`;')
    await db.query('DROP TABLE IF EXISTS `FlashCard`;')
    await db.query('DROP TABLE IF EXISTS `Quiz`;')
    await db.query('DROP TABLE IF EXISTS `CartCourses`;');
    await db.query('DROP TABLE IF EXISTS `WishlistCourses`;');
    await db.query('DROP TABLE IF EXISTS `Refund`;')
    await db.query('DROP TABLE IF EXISTS `CompleteLecture`;');
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
        'password VARCHAR(50) NOT NULL,\n' +
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
        'date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
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
        FOREIGN KEY (user_id) REFERENCES User(id),
        FOREIGN KEY (course_id) REFERENCES Course(id));`
    );

    await db.query(
            `CREATE TABLE Refund( id INT AUTO_INCREMENT,
            title VARCHAR(64) NOT NULL,
            state VARCHAR(16) NOT NULL DEFAULT 'PENDING' CHECK (state IN ('PENDING', 'ALLOWED', 'REJECTED')),
            seen TINYINT(1) NOT NULL DEFAULT 0, reason VARCHAR(1024) NOT NULL, user_id INT NOT NULL,
            course_id INT NOT NULL,
            admin_id INT,
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES User(id),
            FOREIGN KEY (course_id) REFERENCES Course(id),
            FOREIGN KEY (admin_id) REFERENCES Admin(id)
            );`
    );

    await db.query(
        `CREATE TABLE CompleteLecture( lecture_id INT NOT NULL,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        PRIMARY KEY (lecture_id, user_id, course_id),
        FOREIGN KEY (lecture_id) REFERENCES Lecture(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id, course_id) REFERENCES Buy(user_id, course_id) ON DELETE CASCADE);`
    );

    await db.query(
            `CREATE TABLE CartCourses( user_id INT,
        course_id INT,
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES User(id),
        FOREIGN KEY (course_id) REFERENCES Course(id));`
    );

    await db.query(
        `CREATE TABLE WishlistCourses( user_id INT,
        course_id INT,
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES User(id),
        FOREIGN KEY (course_id) REFERENCES Course(id));`
    );


    // QUIZ
    await db.query(
        `CREATE TABLE Quiz(id INT AUTO_INCREMENT,
        duration TIME(6) NOT NULL,
        name VARCHAR(128) NOT NULL,
        creator_id INT NOT NULL,
        course_id INT NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY(creator_id) REFERENCES Creator(id),
        FOREIGN KEY(course_id) REFERENCES Course(id));`
    );

    await db.query(
        `CREATE TABLE FlashCard(id INT AUTO_INCREMENT,
        question VARCHAR(500),
        quiz_id INT NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY(quiz_id) REFERENCES Quiz(id),
        UNIQUE(question, quiz_id));`
    );

    await db.query(
        `CREATE TABLE TrueFalse(id INT,
        answer TINYINT(1) NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY(id) REFERENCES FlashCard(id));`
    );

    await db.query(
        `CREATE TABLE MultipleChoice(id INT,
        choice1 VARCHAR(255) NOT NULL,
        choice2 VARCHAR(255) NOT NULL,
        choice3 VARCHAR(255) NOT NULL,
        choice4 VARCHAR(255) NOT NULL,
        answer INT NOT NULL, 
        PRIMARY KEY(id),
        FOREIGN KEY(id) REFERENCES FlashCard(id));`
    );

    await db.query(
        `CREATE TABLE Allow( creator_id INT, discount_id INT,
        PRIMARY KEY (creator_id, discount_id),
        FOREIGN KEY (creator_id) REFERENCES Creator(id), FOREIGN KEY (discount_id) REFERENCES Discount(id));`
    );

    await db.query(
        `CREATE TABLE Question( id INT AUTO_INCREMENT,
        content VARCHAR(1024) NOT NULL,
        date DATETIME NOT NULL DEFAULT(sysdate()), user_id INT NOT NULL,
        course_id INT NOT NULL,
        parent_id INT DEFAULT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES User(id), FOREIGN KEY (course_id) REFERENCES Course(id)
        );`
    );

    await db.query(
        `CREATE TABLE Answer( id INT AUTO_INCREMENT,
        content VARCHAR(1024) NOT NULL,
        date DATETIME NOT NULL DEFAULT(sysdate()), question_id INT NOT NULL,
        creator_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (question_id) REFERENCES Question(id), FOREIGN KEY (creator_id) REFERENCES Creator(id)
        );`
    );

    await db.query(
        `CREATE TABLE Rating(
        id INT NOT NULL AUTO_INCREMENT,
        ratingScore DECIMAL(2,1) NOT NULL CHECK (ratingScore IN (1, 2, 3, 4, 5)),
        content VARCHAR(512),
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        PRIMARY KEY(id),
        UNIQUE( user_id, course_id),
        FOREIGN KEY (user_id, course_id) REFERENCES Buy(user_id, course_id)
        );`
    );

    await db.query(
        `CREATE TABLE Announcement(
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(100),
        content VARCHAR(512),
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        creator_id INT NOT NULL,
        course_id INT NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY (creator_id) REFERENCES Creator(id),
        FOREIGN KEY (course_id) REFERENCES Course(id)
);`
    );

    await db.query(
        `CREATE TABLE Certificate( 
        id INT AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        course_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (course_id) REFERENCES Course(id),
        UNIQUE(course_id));`
    );

    await db.query(
        `CREATE TABLE HasCertificates(
        certificate_id INT NOT NULL,
        user_id INT NOT NULL,
        PRIMARY KEY(certificate_id, user_id),
        FOREIGN KEY (certificate_id) REFERENCES Certificate(id),
        FOREIGN KEY (user_id) REFERENCES User(id));`
    );

    await db.query(
        `CREATE TABLE Notification( id INT AUTO_INCREMENT,
        user_id INT NOT NULL,
        type INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES User(id));`
    );

    await db.query(
        `CREATE TABLE AnnouncementNotification( id INT,
        announcement_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (id) REFERENCES Notification(id) ON DELETE CASCADE,
        FOREIGN KEY (announcement_id) REFERENCES Announcement(id) ON DELETE CASCADE );`,
    );

    await db.query(
        `CREATE TABLE RefundNotification( id INT,
        refund_id INT NOT NULL,
        FOREIGN KEY (id) REFERENCES Notification(id) ON DELETE CASCADE,
        FOREIGN KEY (refund_id) REFERENCES Refund(id));`,
    );


    console.log("DB tables created.");

    await db.query(
        `CREATE INDEX announcement_cid ON Announcement(course_id)`
    );
    await db.query(
        `CREATE INDEX answer_qid ON Answer(question_id)`
    );
    await db.query(
        `CREATE INDEX discount_cid ON Discount(course_id)`
    );
    await db.query(
        `CREATE INDEX lecture_cid ON Lecture(course_id)`
    );
    await db.query(
        `CREATE INDEX note_uid ON Note(user_id)`
    );
    await db.query(
        `CREATE INDEX notification_uid ON Notification(user_id)`
    );
    await db.query(
        `CREATE INDEX question_cid ON Question(course_id)`
    );
    await db.query(
        `CREATE INDEX person_email ON Person(email)`
    );
    await db.query(
        `CREATE INDEX refund_uid ON Refund(user_id)`
    );
    await db.query(
        `CREATE INDEX complete_uid ON CompleteLecture(user_id)`
    );

    console.log("DB secondary indices initialized.");

    await db.query(
        `CREATE TRIGGER rating_update
         AFTER UPDATE ON Rating
         FOR EACH ROW 
         UPDATE Course
         SET averageRating = (SELECT AVG(ratingScore) FROM Rating WHERE course_id = NEW.course_id) 
         WHERE Course.id = NEW.course_id;
         `
    );

    await db.query(
        `CREATE TRIGGER rating_insert
         AFTER INSERT ON Rating
         FOR EACH ROW 
         UPDATE Course
         SET averageRating = (SELECT AVG(ratingScore) FROM Rating WHERE course_id = NEW.course_id), ratingCount = ratingCount + 1
         WHERE Course.id = NEW.course_id;
         `
    );

    await db.query(
        `CREATE TRIGGER give_certificate
         AFTER INSERT ON CompleteLecture
         FOR EACH ROW
         BEGIN
            IF ((SELECT COUNT(lecture_id) AS lid_cnt FROM CompleteLecture WHERE user_id = NEW.user_id AND course_id = NEW.course_id) = (SELECT COUNT(lecture_index) as lid_cnt FROM Lecture WHERE course_id = NEW.course_id AND isVisible = 1)) THEN
                INSERT INTO HasCertificates(certificate_id, user_id) VALUES ( (SELECT DISTINCT id FROM Certificate WHERE course_id = NEW.course_id), NEW.user_id);
            END IF;
         END 
         `
    );

    await db.query(
        `CREATE TRIGGER add_announcement_notification
         AFTER INSERT ON Announcement
         FOR EACH ROW
         BEGIN
            INSERT INTO Notification(user_id, type) SELECT user_id, 1 as type FROM BUY b WHERE b.course_id = NEW.course_id;
         END 
         `
    );

    await db.query(
        `CREATE TRIGGER add_refund_notification
         AFTER UPDATE ON Refund 
         FOR EACH ROW
         BEGIN
            IF (OLD.state <> NEW.state) THEN
                INSERT INTO Notification(user_id, type) VALUES(NEW.user_id, 0);
                INSERT INTO RefundNotification(id, refund_id) VALUES((SELECT id FROM Notification ORDER BY id DESC LIMIT 1), NEW.id);
            END IF;
            IF (OLD.state <> NEW.state AND NEW.state = 'ALLOWED') THEN
                DELETE FROM Buy WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
                UPDATE User SET balance = balance + (SELECT price FROM Course WHERE id = NEW.course_id) WHERE id = NEW.user_id;
            END IF;
         END 
         `
    );

    await db.query(
        `CREATE TRIGGER add_notification
         AFTER INSERT ON Notification 
         FOR EACH ROW
         BEGIN
            IF (NEW.type = 1) THEN
                INSERT INTO AnnouncementNotification(id, announcement_id) VALUES(NEW.id, (SELECT id as announcement_id FROM Announcement ORDER BY id DESC LIMIT 1));
            END IF;
         END 
         `
    );

    await db.query(
        `CREATE TRIGGER create_certificate
         AFTER INSERT ON Course
         FOR EACH ROW
         INSERT INTO Certificate(name, course_id) VALUES (NEW.title, NEW.id);
        `
    );

    console.log("Triggers have been created.");

    let hash = crypto.createHash('md5').update("123").digest('hex');
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_user', 'test_user@gmail.com', 'Mehmet', 'Testoglu', '${hash}', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_user2', 'test_user2@gmail.com', 'Mehmet2', 'Testoglu2', '${hash}', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_creator', 'test_creator@gmail.com', 'David', 'Testoglu', '${hash}', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('test_admin', 'test_admin@gmail.com', 'Atalar', 'Testoglu', '${hash}', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (1, false, 10000);`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (2, false, 10000);`);
    await db.query(`INSERT INTO Creator (id,about, website, linkedin, youtube) VALUES (3, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nibh arcu, facilisis nec posuere eget, molestie ac felis. Aenean aliquam, nibh scelerisque pharetra pharetra, mi nunc hendrerit urna, in iaculis sapien est sit amet ex. Quisque sit amet ante eros. In hac habitasse platea dictumst. Cras convallis augue eget libero egestas, luctus malesuada diam pretium.', 'www.google.com', 'www.linkedin.com', 'www.youtube.com');`);
    await db.query(`INSERT INTO Admin (id) VALUES (4);`);
    await db.query(`INSERT INTO Course(id,title,price,description,thumbnail,category,creator_id,averageRating,ratingCount) VALUES (1, 'Python egitimi', 120, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nibh arcu, facilisis nec posuere eget, molestie ac felis. Aenean aliquam, nibh scelerisque pharetra pharetra, mi nunc hendrerit urna.', 'https://i1.wp.com/stickker.net/wp-content/uploads/2015/09/python.png?fit=600,600&ssl=1', 'Technology', 3, 4.5, 1)`);
    await db.query(`INSERT INTO Buy (user_id, course_id) VALUES (1,1);`);
    await db.query(`INSERT INTO Buy (user_id, course_id) VALUES (2,1);`);
    await db.query(`INSERT INTO Refund (title, reason, course_id, user_id, admin_id) VALUES ("Cok dandik ", "parami iade edin", 1, 1, NULL);`);
    await db.query(`INSERT INTO Refund (title, reason, course_id, user_id, admin_id) VALUES ("Cok guzel kurs", "ama gene siz parami iade edin", 1, 2, NULL);`);
    await db.query(`INSERT INTO Question (content, user_id, course_id) VALUES ("Kurs sonucunda sertifika var mi", 1, 1);`);
    await db.query(`INSERT INTO Question (content, user_id, course_id, parent_id) VALUES ("Kurs sonucunda sertifika var mi", 2, 1, 1);`);

    console.log("Initialization finished");
}

main().then(()=>db.end());

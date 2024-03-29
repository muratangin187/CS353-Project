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

    await db.query('DROP VIEW IF EXISTS `DiscountedCourse`');
    await db.query('DROP TABLE IF EXISTS `CompletedQuizzes`;')
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


    await db.query(`
        CREATE TABLE CompletedQuizzes(
            quiz_id INT,
            user_id INT,
            score REAL,
            FOREIGN KEY(quiz_id) REFERENCES Quiz(id),
            FOREIGN KEY(user_id) REFERENCES User(id));
    `);

    await db.query(
        `CREATE VIEW DiscountedCourse AS SELECT Course.*, ifnull(DisPrice.percentage, 0) as discount FROM Course LEFT JOIN (SELECT d.course_id as course_id, d.percentage as percentage FROM Allow a, Discount d WHERE a.discount_id = d.id) as DisPrice ON Course.id = DisPrice.course_id`
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
        `CREATE TRIGGER remove_wishlist
         AFTER INSERT ON Buy
         FOR EACH ROW 
         IF (SELECT COUNT(*) FROM WishlistCourses WHERE course_id = NEW.course_id AND user_id = NEW.user_id) THEN
            DELETE FROM WishlistCourses WHERE course_id = NEW.course_id AND user_id = NEW.user_id;
         END IF;
         `
    );

    await db.query(
        `CREATE TRIGGER remove_cart 
         AFTER INSERT ON Buy
         FOR EACH ROW 
         IF (SELECT COUNT(*) FROM CartCourses WHERE course_id = NEW.course_id AND user_id = NEW.user_id) THEN
            DELETE FROM CartCourses WHERE course_id = NEW.course_id AND user_id = NEW.user_id;
         END IF;
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

    // PERSON
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('user', 'user@gmail.com', 'Umit', 'Basaran', '${hash}', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('allison', 'allison@gmail.com', 'Allison', 'Becker', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/20180610_FIFA_Friendly_Match_Austria_vs._Brazil_850_1625.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('kevin', 'debruyne@gmail.com', 'Kevin De', 'Bruyne', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_201807091.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('mo', 'mo@gmail.com', 'Mohamed', 'Salah', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('caglar', 'caglar@gmail.com', 'Caglar', 'Soyuncu', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/b/bb/AUT_vs._TUR_2016-03-29_%28381%29_%28cropped%29.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('creator', 'creator@gmail.com', 'Sir Alex', 'Ferguson', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/1/14/Alex_Ferguson.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('pep', 'pep@gmail.com', 'Pep', 'Guardiola', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/b/be/Pep_2017_%28cropped%29.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('jurgen', 'jurgen@gmail.com', 'Jurgen', 'Klopp', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/6/63/Liverpool_vs._Chelsea%2C_UEFA_Super_Cup_2019-08-14_04.jpg');`);
    await db.query(`INSERT INTO Person (username, email, name, surname, password, photo) VALUES ('admin', 'admin@gmail.com', 'Gianni', 'Infantino', '${hash}', 'https://upload.wikimedia.org/wikipedia/commons/4/40/Gianni_Infantino_2018.jpg');`);

    // USER
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (1, false, 10000);`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (2, false, 10000);`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (3, false, 10000);`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (4, false, 10000);`);
    await db.query(`INSERT INTO User (id,hideCourses,balance) VALUES (5, false, 10000);`);

    // CREATOR
    await db.query(`INSERT INTO Creator (id,about, website, linkedin, youtube) VALUES (6, 'Sir Alexander Chapman Ferguson CBE (born 31 December 1941) is a Scottish former football manager and player, widely known for managing Manchester United from 1986 to 2013. He is considered by many to be one of the greatest managers of all time and he has won more trophies than any other manager in the history of football.', 'www.google.com', 'www.linkedin.com', 'www.youtube.com');`);
    await db.query(`INSERT INTO Creator (id,about, website, linkedin, youtube) VALUES (7, 'Josep "Pep" Guardiola Sala (born 18 January 1971) is a Spanish professional football manager and former player, who is the current manager of Premier League club Manchester City. He is often considered to be one of the greatest managers of all time and holds the record for the most consecutive league games won in La Liga, the Bundesliga and the Premier League.', 'www.google.com', 'www.linkedin.com', 'www.youtube.com');`);
    await db.query(`INSERT INTO Creator (id,about, website, linkedin, youtube) VALUES (8, 'Jürgen Norbert Klopp (born 16 June 1967) is a German professional football manager and former player who is the manager of Premier League club Liverpool. He is widely regarded as one of the best managers in the world.', 'www.google.com', 'www.linkedin.com', 'www.youtube.com');`);

    // ADMIN
    await db.query(`INSERT INTO Admin (id) VALUES (9);`);

    // COURSE
    await db.query(`INSERT INTO Course(title, price, description, thumbnail, category, creator_id) VALUES ('Python Course', 120, 'This course is aimed at complete beginners who have never programmed before, as well as existing programmers who want to increase their career options by learning Python.', 'https://i1.wp.com/stickker.net/wp-content/uploads/2015/09/python.png?fit=600,600&ssl=1', 'Technology', 6);`);
    await db.query(`INSERT INTO Course(title, price, description, thumbnail, category, creator_id) VALUES ('Bakery Course ', 140, 'Save yourself a TON of time and energy as your business grows, by making sure the first few steps you take while building your bakery business, are wise and knowledgeable.', 'https://www.deciccoandsons.com/wp-content/uploads/2019/06/somers_bakery-department-header.jpg', 'Cooking', 6);`);
    await db.query(`INSERT INTO Course(title,price,description,thumbnail,category,creator_id) VALUES ('JavaScript: Understanding the Weird Parts', 100, 'In this course you will gain a deep understanding of Javascript, learn how Javascript works under the hood, and how that knowledge helps you avoid common pitfalls and drastically improve your ability to debug problems.', 'https://www.setxrm.com/wp-content/uploads/2019/11/Javascript-programming-language.jpg', 'Technology', 6);`);

    await db.query(`INSERT INTO Course(title, price, description, thumbnail, category, creator_id) VALUES ('Guitar Course', 80, 'Pep teachings are different than all of the other online teachers.  He has made it super easy to be successful at playing guitar.  All you have to do is follow the videos in order and put together some good practice habits.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu7Y_9NMtc8RFWs2Oj1vozuxvj87lFMH9P5w&usqp=CAU', 'Music', 7);`);
    await db.query(`INSERT INTO Course(title, price, description, thumbnail, category, creator_id) VALUES ('Game Theory Course', 200, 'Game Theory and Decision Theory, model and analyze Interdependence, Cooperation, Competition and Conflict Management. This has given rise to powerful concepts and Strategies.', 'https://onlinecourses.one/wp-content/uploads/2019/08/6-Best-Game-Theory-Course-Certification-2019.jpg', 'Economy', 7);`);

    await db.query(`INSERT INTO Course(title, price, description, thumbnail, category, creator_id) VALUES ('Socialize with Jurgen Klopp', 40, 'DONT HESITATE, JUST RELAX WITH ME', 'https://e0.365dm.com/21/02/2048x1152/skysports-jurgen-klopp-liverpool_5262850.jpg', 'Social', 8);`);
    await db.query(`INSERT INTO Course(title, price, description, thumbnail, category, creator_id) VALUES ('Life in Liverpool', 150, 'Liverpool is the 6th most visited city in the UK thanks to its rich history, beautiful architecture and diverse nightlife. Although Liverpool is a thriving city, property prices and the cost of living remain low compared to other UK cities', 'https://i2-prod.liverpoolecho.co.uk/incoming/article16153189.ece/ALTERNATES/s615b/0_JS176643503.jpg', 'Life', 8);`);

    // LECTURE
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'Python Introduction', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 1, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'Python Primitive Types', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 1, 2);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'Bakery Introduction', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 2, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'How to Cook', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 2, 2);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'JS Introduction', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 3, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'JS Primitive Types', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 3, 2);`);

    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'Guitar Introduction', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 4, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'Selecting the Best Guitar', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 4, 2);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'Game Theory Introduction', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 5, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'Fundamentals', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 5, 2);`);

    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'Who am I', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 6, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'General Structure of the Course', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 6, 2);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 1', 'Quick Tour of the Course', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 7, 1);`);
    await db.query(`INSERT INTO Lecture(chapterName, title, duration, isVisible, additionalMaterial, video, course_id, lecture_index) VALUES ('Chapter - 2', 'Loving Liverpool - You will never walk alone', '11:00', 1, 'www.drive.google.com', 'https://www.youtube.com/watch?v=g6G_MSdj_xs', 7, 2);`);

    // BUY
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (1, 1);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (1, 3);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (1, 7);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (1, 4);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (1, 2);`);

    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (4, 2);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (4, 6);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (4, 3);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (4, 5);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (4, 7);`);

    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (2, 4);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (2, 3);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (2, 7);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (2, 2);`);
    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (2, 1);`);

    await db.query(`INSERT INTO Buy(user_id, course_id) VALUES (3, 3);`);

    // RATING
    await db.query(`INSERT INTO Rating(ratingScore, content, user_id, course_id) VALUES (2, 'Not effective', 1, 1);`);
    await db.query(`INSERT INTO Rating(ratingScore, content, user_id, course_id) VALUES (3, 'Nice', 1, 3);`);
    await db.query(`INSERT INTO Rating(ratingScore, content, user_id, course_id) VALUES (5, 'The energy is amazing', 1, 7);`);

    await db.query(`INSERT INTO Rating(ratingScore, content, user_id, course_id) VALUES (4, 'Love this course', 4, 2);`);
    await db.query(`INSERT INTO Rating(ratingScore, content, user_id, course_id) VALUES (5, 'AMAZING', 4, 6);`);

    await db.query(`INSERT INTO Rating(ratingScore, content, user_id, course_id) VALUES (1, 'Not useful', 2, 4);`);

    // NOTE
    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 1', 'Important point', 1, 1);`);
    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 2', 'Dont understand', 1, 1);`);
    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 3', 'Look again this point', 1, 1);`);

    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 1', 'Important point', 4, 4);`);
    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 2', 'Dont understand', 4, 5);`);

    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 1', 'Important point', 2, 6);`);
    await db.query(`INSERT INTO Note(title, content, user_id, lecture_id) VALUES ('Note - 2', 'Love you Jurgen', 2, 6);`);

    // BOOKMARK
    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('10:00', 1, 1);`);
    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('8:00', 1, 1);`);
    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('10:00', 1, 1);`);

    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('7:00', 4, 4);`);
    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('4:00', 4, 5);`);

    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('2:00', 2, 6);`);
    await db.query(`INSERT INTO Bookmark(videoTimestamp, user_id, lecture_id) VALUES ('5:00', 2, 6);`);

    // DISCOUNT
    await db.query(`INSERT INTO Discount(percentage, startDate, endDate, course_id, admin_id) VALUES (49.5, '15.05.2021', '20.05.2021', 2, 9);`);
    await db.query(`INSERT INTO Discount(percentage, startDate, endDate, course_id, admin_id) VALUES (60, '16.05.2021', '20.05.2021', 1, 9);`);
    await db.query(`INSERT INTO Discount(percentage, startDate, endDate, course_id, admin_id) VALUES (67.15, '17.05.2021', '20.05.2021', 4, 9);`);
    await db.query(`INSERT INTO Discount(percentage, startDate, endDate, course_id, admin_id) VALUES (45.25, '14.05.2021', '20.05.2021', 5, 9);`);

    // REFUND
    await db.query(`INSERT INTO Refund(title, reason, user_id, course_id, admin_id) VALUES ('Refund - 1', 'Dont like it', 1, 2, 9);`);
    await db.query(`INSERT INTO Refund(title, reason, user_id, course_id, admin_id) VALUES ('Refund - 2', 'I dont need it', 2, 1, 9);`);
    await db.query(`INSERT INTO Refund(title, reason, user_id, course_id, admin_id) VALUES ('Refund - 3', 'My internet connection is unstable', 4, 7, 9);`);

    // COMPLETE LECTURE
    await db.query(`INSERT INTO CompleteLecture(lecture_id, user_id, course_id) VALUES (1, 1, 1);`);
    await db.query(`INSERT INTO CompleteLecture(lecture_id, user_id, course_id) VALUES (2, 1, 1);`);

    await db.query(`INSERT INTO CompleteLecture(lecture_id, user_id, course_id) VALUES (3, 4, 2);`);
    await db.query(`INSERT INTO CompleteLecture(lecture_id, user_id, course_id) VALUES (4, 4, 2);`);

    // QUIZ
    await db.query(`INSERT INTO Quiz(duration, name, creator_id, course_id) VALUES ('3:00', 'Python Quiz - 1', 6, 1);`);
    await db.query(`INSERT INTO Quiz(duration, name, creator_id, course_id) VALUES ('12:00', 'Python Quiz - 2', 6, 1);`);
    await db.query(`INSERT INTO Quiz(duration, name, creator_id, course_id) VALUES ('9:00', 'Python Quiz - 3', 6, 1);`);

    await db.query(`INSERT INTO Quiz(duration, name, creator_id, course_id) VALUES ('5:00', 'JS Quiz - 1', 6, 3);`);
    await db.query(`INSERT INTO Quiz(duration, name, creator_id, course_id) VALUES ('8:00', 'JS Quiz - 2', 6, 3);`);

    await db.query(`INSERT INTO Quiz(duration, name, creator_id, course_id) VALUES ('2:00', 'Are You Enjoying?', 8, 6);`);

    // FLASHCARD
    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Is this expression correct? (int a)', 1);`);
    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Select the correct expression.', 1);`);

    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('What is the data type of the expression? (a = 5)', 2);`);
    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Is this course easy?', 2);`);

    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Which usage cause an error in Python?', 3);`);
    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('What is the output? (print("Hello"))', 3);`);

    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Is this expression correct? (let a)', 4);`);
    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Select the correct expression.', 4);`);

    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Is this expression correct? (string a)', 5);`);
    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('Is this course hard?', 5);`);

    await db.query(`INSERT INTO FlashCard(question, quiz_id) VALUES ('This course is amazing', 6);`);

    // TRUE FALSE
    await db.query(`INSERT INTO TrueFalse(id, answer) VALUES (1, 0);`);
    await db.query(`INSERT INTO TrueFalse(id, answer) VALUES (4, 1);`);
    await db.query(`INSERT INTO TrueFalse(id, answer) VALUES (7, 1);`);
    await db.query(`INSERT INTO TrueFalse(id, answer) VALUES (9, 0);`);
    await db.query(`INSERT INTO TrueFalse(id, answer) VALUES (10, 0);`);
    await db.query(`INSERT INTO TrueFalse(id, answer) VALUES (11, 1);`);

    // MULTIPLE CHOICE
    await db.query(`INSERT INTO MultipleChoice(id, choice1, choice2, choice3, choice4, answer) VALUES (2, "int b", "let b", "#b", "b = 5", 4);`);
    await db.query(`INSERT INTO MultipleChoice(id, choice1, choice2, choice3, choice4, answer) VALUES (3, "number", "string", "date", "character", 1);`);
    await db.query(`INSERT INTO MultipleChoice(id, choice1, choice2, choice3, choice4, answer) VALUES (5, "b = 6", "c = a * c", "c++", "double d = 1.5", 4);`);
    await db.query(`INSERT INTO MultipleChoice(id, choice1, choice2, choice3, choice4, answer) VALUES (6, "H e l l o", "Hello", "hello", "HELLO", 2);`);
    await db.query(`INSERT INTO MultipleChoice(id, choice1, choice2, choice3, choice4, answer) VALUES (8, "let b", "string str", "char c", "double d", 1);`);

    //ALLOW
    await db.query(`INSERT INTO Allow(creator_id, discount_id) VALUES (6, 1);`);
    await db.query(`INSERT INTO Allow(creator_id, discount_id) VALUES (7, 3);`);

    // QUESTION
    await db.query(`INSERT INTO Question(content, user_id, course_id) VALUES ("How can I find additional materials?", 1, 3);`);
    await db.query(`INSERT INTO Question(content, user_id, course_id, parent_id) VALUES ("I agree, I am curious about that, too?", 2, 3, 1);`);
    await db.query(`INSERT INTO Question(content, user_id, course_id, parent_id) VALUES ("Also, will there be any update for that course?", 4, 3, 2);`);

    await db.query(`INSERT INTO Question(content, user_id, course_id) VALUES ("Is Jurgen a bit too happy or not :)???", 2, 7);`);

    // ANSWER
    await db.query(`INSERT INTO Answer(content, question_id, creator_id) VALUES ("You can find some materials from youtube", 1, 6);`);
    await db.query(`INSERT INTO Answer(content, question_id, creator_id) VALUES ("Liverpool effect is true :-)))) YOUUU WIIIL NEVEER WAAALK AAAALOOONE", 4, 8);`);

    // ANNOUNCEMENT
    await db.query(`INSERT INTO Announcement(title, content, creator_id, course_id) VALUES ("UPDATE", "The course materials are updated", 6, 1);`);

    // COMPLETED QUIZZES
    await db.query(`INSERT INTO CompletedQuizzes(quiz_id, user_id, score) VALUES (4, 1, 10);`);
    await db.query(`INSERT INTO CompletedQuizzes(quiz_id, user_id, score) VALUES (4, 2, 10);`);
    await db.query(`INSERT INTO CompletedQuizzes(quiz_id, user_id, score) VALUES (4, 4, 5);`);

    console.log("Initialization finished");
}

main().then(()=>db.end());

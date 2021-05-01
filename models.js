class Person{
    constructor(id, photo, username, name, surname, password, email) {
        this.id = id;
        this.photo = photo;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.email= email;
    }
}

class User extends Person{
    constructor(id, photo, username, name, surname, password, email, hideCourses, balance) {
        super(id, photo, username, name, surname, password, email);
        this.hideCourses = hideCourses;
        this.balance = balance;
    }
}
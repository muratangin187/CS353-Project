import axios from "axios";
import {createContext} from "react";

class AuthService {
    constructor() {
        this.AuthContext = createContext();
    }

    async login(username, password) {
        let response = await axios.post("/api/user/login", {
            username,
            password
        });
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify({id: response.data.id, token: response.data.token}));
        }

        return response;
    }


    logout() {
        localStorage.removeItem("user");
    }

    async register(username, email, name, surname, password, photo, isCreator,) {
        return axios({
            url:"/api/user/register",
            method: "POST",
            data: {
                username,
                email,
                name,
                surname,
                password,
                photo,
                isCreator,
            }
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();

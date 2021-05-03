import axios from "axios";
import {createContext} from "react";

class AuthService {
    async login(username, password) {
        let response = await axios.post("/api/user/login", {
            username,
            password
        });
        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify({id: response.data.id, role: response.data.role, token: response.data.token}));
        }

        return response;
    }


    logout() {
        localStorage.removeItem("user");
    }

    authHeader(){
        const currentUser = this.getCurrentLocal();
        if (currentUser && currentUser.token) {
            return { Authorization: `Bearer ${currentUser.token}` };
        } else {
            return {};
        }
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

    getCurrentLocal() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getCurrentUser(){
        let local = this.getCurrentLocal();
        if(!local){
            return null;
        }else{
            return axios({
                url: "/api/user/" + local.id,
                method: "GET",
                header: this.authHeader()
            });
        }
    }

    isAdmin() {
        return JSON.parse(localStorage.getItem('user')).role == "admin";
    }

    isCreator() {
        return JSON.parse(localStorage.getItem('user')).role == "creator";
    }
}

export default new AuthService();

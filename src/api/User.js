import axios from "axios";

export async function userLogin(loginData) {
    try {
        const res = await axios.post(
            "http://localhost:8080/user/login",
            loginData
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function userRegister(registerData) {
    try {
        const res = await axios.post(
            "http://localhost:8080/user/register",
            registerData
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
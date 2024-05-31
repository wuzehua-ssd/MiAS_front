import axios from "axios";

export async function payCreate(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.get(
            "http://localhost:8080/pay/create",
            {
                headers: {
                    token: token, // 添加用户token
                    "Content-Type": "application/json" // 设置请求头的Content-Type
                },
                params: queryData
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function paySearch(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.get(
            "http://localhost:8080/pay/queryByOrderId",
            {
                headers: {
                    token: token, // 添加用户token
                    "Content-Type": "application/json" // 设置请求头的Content-Type
                },
                params: queryData
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function payReset(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.get(
            "http://localhost:8080/pay/reset",
            {
                headers: {
                    token: token, // 添加用户token
                    "Content-Type": "application/json" // 设置请求头的Content-Type
                },
                params: queryData
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
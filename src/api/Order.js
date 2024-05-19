import axios from "axios";

export async function orderCreate(orderData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/create",
            orderData,
            {
                headers: {
                    token: token // 添加用户token
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function orderList(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/list",
            queryData,
            {
                headers: {
                    token: token // 添加用户token
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function orderCancel(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/cancel",
            queryData,
            {
                headers: {
                    token: token // 添加用户token
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function orderConfirm(formData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/confirm",
            formData,
            {
                headers: {
                    token: token // 添加用户token
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function orderDetails(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/processDetails",
            queryData,
            {
                headers: {
                    token: token // 添加用户token
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
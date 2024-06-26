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

export async function orderAccept(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.put(
            "http://localhost:8080/order/accept",
            null,
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

export async function orderMaintenance(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.put(
            "http://localhost:8080/order/maintenance",
            null,
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

export async function orderToRecheck(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.put(
            "http://localhost:8080/order/inventoryApplication",
            queryData,
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

export async function orderRecheck(formData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/recheck",
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

export async function orderReturn(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.put(
            "http://localhost:8080/order/return",
            null,
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

export async function orderConfirmReceipt(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/order/confirmReceipt",
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
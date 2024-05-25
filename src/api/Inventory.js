import axios from "axios";

export async function addInventory(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/inventory/addInventory/?userId=" + queryData.userId,
            queryData,
            {
                headers: {
                    token: token, // 添加用户token
                    "Content-Type": "application/json"
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function inventoryList(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/inventory/list/?userId=" + queryData.userId,
            queryData,
            {
                headers: {
                    token: token, // 添加用户token
                    "Content-Type": "application/json"
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateInventory(queryData) {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const token = user.token;
    try {
        const res = await axios.post(
            "http://localhost:8080/inventory/updateInventory/?userId=" + queryData.userId,
            queryData,
            {
                headers: {
                    token: token, // 添加用户token
                    "Content-Type": "application/json"
                }
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
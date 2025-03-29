import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt-tokens";

const hasToken = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token !== null;
};

const getJWTToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

const setJWTToken = async (token: string) => {
    console.log("Setting token: ", token);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const clearJWTToken = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export class Api {
    static readonly BASE_URL = "https://addhere.vercel.app/";

    static async buildHeaders() {
        const token = await getJWTToken();

        return {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        };
    }

    static async get(url: string) {
        try {
            console.log("GET request to: ", url);
            const response = await fetch(url, {
                method: "GET",
                headers: await Api.buildHeaders(),
            });
            const responseJson = await response.json();
            console.log("Response: ", responseJson, response.status);
            return { responseJson, status: response.status };
        } catch (error) {
            console.log("Error in get request: ", error);
            return { responseJson: null, status: 500 };
        }
    }

    static async post(url: string, data: any) {
        try {
            console.log("POST request to: ", url);
            const response = await fetch(url, {
                method: "POST",
                headers: await Api.buildHeaders(),
                body: JSON.stringify(data),
            });
            const responseJson = await response.json();
            console.log("Response: ", responseJson, response.status);
            return { responseJson, status: response.status };
        } catch (error) {
            console.log("Error in post request: ", error);
            return { responseJson: null, status: 500 };
        }
    }

    static async logoutUser() {
        await SecureStore.deleteItemAsync("ex-count");
        await clearJWTToken();
    }
}

export { setJWTToken, clearJWTToken, hasToken };

const apiUrl = "http://127.0.0.1:8000";

const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";
const defaultHeaders = {
    "Content-Type": "application/json",
};

const getAccessToken = () => {
    return window.localStorage.getItem(accessTokenKey);
};

const setAccessToken = (newAccessToken) => {
    window.localStorage.setItem(accessTokenKey, newAccessToken);
};

const getRefreshToken = () => {
    return window.localStorage.getItem(refreshTokenKey);
};

const setRefreshToken = (newRefreshToken) => {
    window.localStorage.setItem(refreshTokenKey, newRefreshToken);
};

const updateAccessToken = async (refreshToken) => {
    const response = await fetch(`${apiUrl}/api/token/refresh/`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ token: refreshToken }),
    });

    if (response.status == 200) {
        const data = await response.json();
        setAccessToken(data.access_token);
    } else {
        throw Error("Can not refresh login");
    }
};

export async function login(username, password) {
    const response = await fetch(`${apiUrl}/api/token/`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ username, password }),
    });

    if (response.status == 200) {
        const data = await response.json();
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
    } else {
        throw Error("Can not refresh login");
    }
}

export async function request(path, method = "GET", requestHeaders = {}) {
    const accessToken = getAccessToken();
    const headers = { ...defaultHeaders, ...requestHeaders };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    while (true) {
        const response = await fetch(`${apiUrl}${path}`, {
            method,
            headers,
        });

        if (response.status == 401) {
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    updateAccessToken(refreshToken);
                } catch {
                    throw response;
                }
            } else {
                throw response;
            }
        }

        return response;
    }
}

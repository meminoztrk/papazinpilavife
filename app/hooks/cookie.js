import Cookie from 'js-cookie'

export const userPrefs = async (token) => {
    await Cookie.set("jwt", token, {
        expires: 30,
        sameSite: 'lax',
        path: '/'
    });
    return token;
}

export const getUserToken = () => {
    return Cookie.get("jwt")
}

export const removeToken = () => {
    console.log("cokie desin")
    Cookie.remove("jwt")
}

export const getUser = async (jwt,api,api_key) => {
    const response = await fetch(api + "/User/user?jwt=" + jwt, {
        headers: {
            'ApiKey': api_key,
            'Content-Type': 'application/json'
        },
        withCredentials: true,
    });
    return await response.json();
}

export const getJwt = (cookies) => {
    if (cookies) {
        const token = cookies.split(" ").filter(str => str.match('jwt='))[0];
        const jwt = token ? token.slice(4).replace(";", "") : null
        return jwt
    }
    else{
        return null
    }

}
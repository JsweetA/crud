import request from "@/api/request";

export const register = async (params = {}) => {
    const res = await request({
        url:'/login/register',
        method:'POST',
        params
    });
    return res;
};

export const Login = async (params = {}) => {
    const res = await request({
        url:'/login',
        method:'POST',
        params
    });
    return res;
};

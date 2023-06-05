import request from "@/api/request";

export const login = async (params = {}) => {
    const res = await request({
        url:'',
        method:'POST',
        params
    });
    return res;
};

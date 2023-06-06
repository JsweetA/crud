import request from "@/api/request";

// 获取部门选项
export const queryDepartmentOptions = async (params = {}) => {
    const res = await request({
        url:'/department',
    });

    return res;
};

// 新增部门
export const addDepartment = async (params = {}) => {

};

// 删除部门
export const deleteDepartment = async (params = {}) => {

};

// 分页获取表单
export const queryData = async (params = {}) => {
    console.log("queryData",params);
    const res = await request({
        url:`/employee/query?page=${params?.current}&size=${params?.pageSize || 6}`,
        method:'POST',
        params:params?.data || {}
    });
    return res;
};

// 添加人员
export const addPerson = async (params = {}) => {
    const res = await request({
        url:'/employee',
        method:'POST',
        params
    });
    return res;
};

// 删除人员
export const deletePerson = async (params = {}) => {
    const res = await request({
        url:`/employee/${params.id}`,
        method:'DELETE'
    });
    return res;
};

// 修改人员
export const updatePerson = async (params = {}) => {
    const res = await request({
        url:`/employee/${params.id}`,
        method:'PUT',
        params
    });
    return res;
};
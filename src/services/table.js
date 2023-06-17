import request from "@/api/request";

// 获取部门选项
export const queryDepartmentOptions = async (params = {}) => {
    const res = await request({
        url:'/department/query',
    });

    return res;
};

// 新增部门
export const addDepartment = async (params = {}) => {
    const res = await request ({
        url:'/department',
        method:'POST',
        params
    });
    return res;
};

// 删除部门
export const deleteDepartment = async (params = {}) => {
    const res = await request ({
        url:`/department/${params?.id}`,
        method:'DELETE',
    });
    return res;
};

// 分页获取表单
export const queryData = async (params = {}) => {
    let data = {};
    for(let key of  Object.keys(params)){
        if(params[key].length) data[key] = params[key];
    }
    console.log(data);
    const res = await request({
        url:`/employee/query?page=${params?.current || 0}&size=${params?.pageSize || 6}`,
        method:'POST',
        params:data
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

import request from "@/api/request";

export const checkPoint = async (params = {}) => {
  const data = await request({
    url:`/point/${params?.name}`
  });
  return data?.data;
};

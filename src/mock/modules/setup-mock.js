export default ({ mock, setup }) => {
  if (mock !== false) setup();
};

export const successResponseWrap = (data) => {
  return data;
};

export const failResponseWrap = (data, msg, code = 50000) => {
  return {
    data,
    status: 'fail',
    msg,
    code,
  };
};

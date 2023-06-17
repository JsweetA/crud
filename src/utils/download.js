import { getBaseUrl } from '../api/apiConfig';
import useLoading from '@/hooks/loading';

const url = getBaseUrl();

export const download = (path) => {
  const fileName = '人员信息.xlsx';
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = url + path;
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
};

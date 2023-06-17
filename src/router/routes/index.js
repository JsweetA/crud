import rank from './rank.js';
import { getAuthority } from '@/utils/auth';

const authority = getAuthority();
const modules = import.meta.globEager('./modules/*.js');

function formatModules(_modules, result) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    
    result = moduleList.map((e) => {
      return e;
    });
  });
  const res = [];
  rank.forEach(r => {
    const temp = result.find(ele => ele.meta.title === r);
    if (!temp) throw new Error(`${r}找不到对应排名`);
    res.push(temp);
  });
  return res;
}

export const appRoutes = formatModules(modules, []);

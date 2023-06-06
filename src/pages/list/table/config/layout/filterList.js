/**
 * @description: 此文件用来描述筛选列表，即筛选、搜索、查询表格相关字段的展示和解析
 */

import i18n from '@/locale';
import { sexOptions, } from './options';
import { useTableStore } from '../../../../../store/table';
import { computed } from 'vue';

const t = i18n?.global?.t;
const store = useTableStore();
const department = computed(()=>{
  return store?.options?.department;
});
/**
 * @return {*}
 * @description: 需要提供component描述筛选输入
 */
export const fields = [
  {
    field: 'name', // 字段value
    label: '姓名', // 字段对应的中文
    component: { // 填写表单时对应的组件类型
      type: 'input',
      placeholder: t('searchTable.form.number.placeholder'),
    },
  },
  {
    field: 'sex',
    label: '性别',
    component: {
      type: 'select',
      placeholder: '男 or 女',
      options: sexOptions,
    },
  },
  {
    field: 'department',
    label: '部门',
    component: {
      type: 'select',
      placeholder: t('searchTable.form.selectDefault'),
      options: department,
    }, 
  },
];

export default fields;

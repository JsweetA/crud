/**
 * @description: 此文件用来描述字段列表，即表格相关字段的展示和解析
 */

import i18n from '@/locale';
import { sexOptions, } from './options';


let old = '';
const t = i18n?.global?.t;

/**
 * @return {*}
 * @description: 一般情况下，使用field和label就行，因为展示的内容一般是直接采用value，
 * 但是如果需要临时计算转换也可以传入函数此外可以根据情况传入resolve函数，返回一个对象，这些都会被components下colItem组件解析
 */
export const fields = [
  {
    field: 'serialNum', // 字段value
    label: '编号', // 字段对应的中文
    unedit:true,
    unadd:true,
  },
  {
    field: 'name',
    label: '姓名',
    required:true,
    message:'请输入姓名',
    validate:(v) => {
      if(v ===undefined || v === '') return false;
      return true;
    }
  },
  {
    field: 'sex',
    label: '性别',
    type:'select',
    options:sexOptions,
    required:true,
    message:'请选择性别',
    validate:(v) => {
      if(v ===undefined || v === '') return false;
      return true;
    }
  },
  
  {
    field: 'age',
    label: '年龄',
    type:'number',
    required:true,
    message:'请输入合法年龄',
    validate:(v) => {
      if(v >= 0 && v <= 200) return true;
      return false;
    }
  },
  {
    field: 'department',
    label: '部门',
    type:'select',
    required:true,
    message:'请选择部门',
    validate:(v) => {
      if(v === undefined || v === '') return false;
      return true;
    }
  },
  {
    field: 'mailbox',
    label: '邮箱',
    required:true,
    message:'请输入合法邮箱',
    validate:(v) => {
      let t = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      return t.test(v);
    }
  },  
  {
    field: 'avatar',
    label: '头像',
    type:'file',
    unadd:true,
    resolve: (record) => { // 返回一个图片+文字
      let src;
      console.log(old,record.url,"111111111");
      src = record.url;
      old = src;
      return {
        type: 'avatar',
        src,
      };
    },
  },
];

export default fields;

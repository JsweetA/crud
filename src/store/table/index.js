import useLoading from '@/hooks/loading';
import { defineStore } from 'pinia';
import _ from 'lodash';
import {
  queryDepartmentOptions,
  queryData,
  addPerson,
  deletePerson,
  updatePerson,
  addDepartment,
  deleteDepartment,
} from '../../services/table';
import { getBaseUrl } from '@/api/apiConfig';
import usePage from '@/hooks/usePage.js';
import { uploadRef } from '../../pages/list/table/components/upload';

const { page, setPage } = usePage('table');
const url = getBaseUrl();
const { setLoading } = useLoading();
/**
 * @return {*}
 * @description: 登录
 */
export const useTableStore = defineStore('table', {
  state: () => ({
    renderData: [],
    options: {
      department: null,
    },
  }),
  actions: {
    async init() {
      this.getData(); // 获取表单信息
      this.getDepartments(); // 获取部门选项
    },

    // 获取表格数据
    async getData(params = {}) {
      setLoading(true);
      try {
        const res = await queryData(params);
        const content = res?.data?.content;
        for (let i = 0; i < content.length; i++) {
            content[i].url = `${url}${content[i]?.attach.url}`;
            content[i].upUrl = `${url}/employee/${content[i].id}/upload`;
            content[i].sex = content[i].sex === 'male' ? '男' : '女';
            content[i].department = content[i].departmentOutput.name;
        }
        this.renderData = content;
        console.log(this.renderData, 'renderData');
        setPage({
          ...params,
          current: params.current + 1 || 1,
          pageSize: res?.data?.pageSize,
          total: res?.data?.totalElements,
        });
      } catch (err) {
        // you can report use errorHandler or other
        console.log(err, 1231);
      } finally {
        setLoading(false);
      }
    },

    // 增删改查表格
    async add(params) {
      const res = await addPerson(params);
    },
    async delete(params) {
      const res = await deletePerson(params);
    },
    async modify(params) {
      const res = await updatePerson(params);
      await uploadRef.value.submit();
      return res?.code === 200;
    },

    // 增删改查部门
    async getDepartments() {
      let department = await queryDepartmentOptions();
      department = department.data.map((i) => {
        return {
          ...i,
          label: i?.name,
          value: i?.name,
        };
      });
      this.options.department = department;
    },
    async addDep(name) {
      await addDepartment({ name });
      this.getDepartments();
    },
    async delDep(id) {
      await deleteDepartment({ id });
      this.getDepartments();
    },
  },
});

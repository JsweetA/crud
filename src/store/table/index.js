import useLoading from '@/hooks/loading';
import { defineStore } from 'pinia';
import _ from 'lodash';
import { queryDepartmentOptions,queryData, addPerson,deletePerson, updatePerson } from '../../services/table';
import { getBaseUrl } from '@/api/apiConfig';
import usePage from '@/hooks/usePage.js';

const {page, setPage} = usePage('table');
const url = getBaseUrl();
const { setLoading } = useLoading();
/**
 * @return {*}
 * @description: 登录
 */
export const useTableStore = defineStore('table', {
  state: () => ({
    renderData:[],
    options:{
        department:null
    },
    page,
  }),
  actions: {
    async init(){
        this.getData(); // 获取表单信息
        this.getDepartments(); // 获取部门选项
    },
    async getData(params = {}){
        setLoading(true);
        try {
            const res = await queryData(params);
            const department = await queryDepartmentOptions();
            if(!this.options.department) this.options.department = department.data.map(i => {
                return {
                    label:i?.name,
                    value:i?.name
                };
            });
            this.renderData = res?.data?.content;
            for(let i = 0; i < this.renderData.length; i ++){
                this.renderData[i].url = `${url}${this.renderData[i]?.attach.url}`;
                this.renderData[i].upUrl = `${url}/${this.renderData[i].id}/upload`;
                this.renderData[i].sex = this.renderData[i].sex === 'male' ? '男':'女';
                this.renderData[i].department = this.renderData[i].departmentOutput.name;
            }
            setPage({
                current:params.current + 1 || 1,
                pageSize:res?.data?.pageSize,
                total:res?.data?.totalElements
            });
        } catch (err) {
        // you can report use errorHandler or other
        } finally {
            setLoading(false);
        }
    },
    async add (params) {
        const res = await addPerson(params);
    },
    async delete (params) {
        const res = await deletePerson(params);
    },
    async modify (params) {
        const res = await updatePerson(params);
    },
    async getDepartments(){
        const res = await queryDepartmentOptions();
        this.department = res?.data;
    },
  }
});
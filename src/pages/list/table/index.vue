<template>
  <div class="container">
    <a-card class="general-card" :title="title">
      <FilterTable :fetchData="fetchData" :pagination="pagination" />
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="16">
          <a-space>
            <Operate type="primary" icon="IconPlus" :text="$t('searchTable.operations.create')"
              @opt="() => operate('create', '创建', false)" />
          </a-space>
        </a-col>
      </a-row>
      {{ pagination }}
      <a-table
        row-key="id" :loading="loading" :bordered="false"
        :pagination="pagination" :data="renderData"
        @page-change="onPageChange"
      >

        <template #columns>
          <a-table-column
            v-for="item in fieldList" :key="item.field"
            :title="item.label" :data-index="item.field"
          >
            
            <template v-if="item.resolve" #cell="{ record }">
              <ColItem :meta="item" :info="record" @opt="(flag, text, e) => operate(flag, text, e)" />
            </template>
            
          </a-table-column>
          
          <a-table-column
            title="操作"
            data-index="operations"
          >
            <template #cell="{ record }">
              <a-button type="text" status="warning"
                @click="() => operate('modify', '修改', record)">
                {{ $t('searchTable.operations.modify') }}
              </a-button>
              <a-popconfirm content="确认删除吗?" type="info" @ok="operate('delete', '删除', record)">
                <a-button type="text" status="danger">
                  {{ $t('searchTable.operations.delete') }}
              </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
  
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
    <template #title>
      新增
    </template>
    <div>
      <a-from :model="fields"  auto-label-width>
        <a-form-item v-for="item of fields" 
          :field="item?.field" 
          :label="item?.label" 
          :key="item?.label">
          
          <a-input v-if="!item?.type" 
            v-model="formData[item.field]"  
            :style="{width:'100%'}" 
            :placeholder="'请输入'+item?.label"/>

          <a-select v-if="item.type === 'select'" 
            v-model="formData[item.field]"
            :options="item?.options ? 
                      item?.options :
                      store?.options[item?.field]"
            :placeholder="'请选择'+item?.label" />

          <upload v-if="item.type === 'file' && state === 'edit'" />
        </a-form-item>
        {{ formData }}
      </a-from>
    </div>
    
  </a-modal>
  
</template>

<script setup name='search_table'>
  
  import config from './config';
  import { Notification } from '@arco-design/web-vue';
  import { useTableStore } from '@/store/table';
  import { computed, ref, reactive, onMounted,watch } from 'vue';
  import { ColItem, FilterTable, Operate } from './components/index';
  import upload from './components/upload.vue';

  const state = ref('add');
  const visible = ref(false);
  const store = useTableStore();
  const { fieldList, title, } = config;
  const fetchData = store.getData;
  let fields = fieldList.filter((i) => !i?.unadd);
  const formData = ref({});
  const pagination = computed(()=>{
    return store?.page;
  });
  const renderData = computed(()=>{
    return store?.renderData;
  });

  /**
   * @param {*} eventType 事件类型
   * @param {*} title 事件名
   * @param {*} e 关联数据
   * @description: 事件处理器
   */
  const operate = async (eventType, title, e) => {
    if(eventType === 'create'){
      state.value = 'add';
      visible.value = true;
      formData.value = {};
    }
    if(eventType === 'modify'){
      fields = fieldList.filter(i=>!i?.unedit);
      state.value = 'edit';
      formData.value = {...e,sex:e?.sex === '男'?'male':'female',id:e?.id};
      visible.value = true;
    }
    if(eventType === 'delete'){
      await store?.delete({id:e?.id});
      Notification.success('删除成功');
      await fetchData();
    }
  };

  const handleOk = async () => {
    if(state.value === 'add'){
      await store?.add(formData.value);
      for(let key of Object.keys(formData.value)){
        formData.value[key] = '';
      }
      Notification.success("添加成功"); 
    }   
    else {
      await store.modify({...formData.value,});
      Notification.success("编辑成功"); 
    }
    await fetchData();
  };
  /**
   * @param {*} current
   * @return {*}
   * @description: 分页
   */
  const onPageChange = (current) => {
    fetchData({ ...pagination, current:current - 1});
  };
  onMounted(fetchData);
</script>

<style scoped lang="scss">
  @import url('./index.scss');
</style>

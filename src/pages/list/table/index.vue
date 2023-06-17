<template>
  <div class="container">
    <a-card class="general-card" :title="title">
      <FilterTable :fetchData="searchData" :pagination="pagination" />
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="16">
          <a-space>
            <Operate
              v-if="authority === 'ROOT'"
              type="primary"
              icon="IconPlus"
              :text="$t('searchTable.operations.create')"
              @opt="() => operate('add', '创建', false)"
            />
          </a-space>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a-space>
            <Operate
              icon="IconDownload"
              :text="$t('searchTable.operations.download')"
              @opt="() => operate('download', '下载', false)"
            />
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :bordered="false"
        :pagination="pagination"
        :data="renderData"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column v-for="item in fieldList" :key="item.field" :title="item.label" :data-index="item.field">
            <template v-if="item.resolve" #cell="{ record }">
              <ColItem :meta="item" :info="ref(record)" @opt="(flag, text, e) => operate(flag, text, e)" />
            </template>
          </a-table-column>

          <a-table-column title="操作" data-index="operations" v-if="authority === 'ROOT'">
            <template #cell="{ record }">
              <a-button type="text" status="warning" @click="() => operate('edit', '修改', record)">
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

  <a-modal v-model:visible="visible" @ok="handleOk" :on-before-ok="validate" @cancel="clearState">
    <template #title>{{ state === 'add' ? '新增' : '编辑' }}</template>
    <div>
      <!-- {{ formData }} -->
      <a-from :model="formData" auto-label-width ref="form">
        <a-form-item v-for="item of fields" :field="item?.field" :label="item?.label" :key="item?.field">
          <a-input
            v-if="!item?.type"
            v-model="formData[item.field]"
            :style="{ width: '100%' }"
            :placeholder="'请输入' + item?.label"
          />

          <a-input-number
            v-if="item?.type === 'number'"
            v-model="formData[item.field]"
            :min="0"
            :max="200"
            :placeholder="'请输入' + item?.label"
          />

          <a-select
            v-if="item.type === 'select'"
            v-model="formData[item.field]"
            :options="item?.options ? item?.options : store?.options[item?.field]"
            :placeholder="'请选择' + item?.label"
          />

          <upload v-if="item.type === 'file' && state === 'edit'" :url="formData.upUrl || 1" :file="formData" />
        </a-form-item>
      </a-from>
    </div>
  </a-modal>
</template>

<script setup name="search_table">
import config from './config';
import { Notification } from '@arco-design/web-vue';
import { useTableStore } from '@/store/table';
import { computed, ref, reactive, onMounted, watch, nextTick } from 'vue';
import { ColItem, FilterTable, Operate } from './components/index';
import upload from './components/upload.vue';
import usePage from '@/hooks/usePage.js';
import { download } from '@/utils/download';
import { getAuthority } from '@/utils/auth';

const authority = getAuthority();
const form = ref(null);
const { page, setPage } = usePage('table');
const state = ref('add');
const visible = ref(false);
const store = useTableStore();
const { fieldList, title } = config;
let fields = fieldList.filter((i) => !i?.unadd);
const formData = ref(null);
const pagination = page;
const renderData = computed(() => {
  return Object.assign(store?.renderData);
});

/**
 * @param {*} eventType 事件类型
 * @param {*} title 事件名
 * @param {*} e 关联数据
 * @description: 事件处理器
 */
const operate = async (eventType, title, e) => {
  // 新增和编辑
  if (eventType === 'add' || eventType === 'edit') {
    fields = fieldList.filter((i) => !i[`un${eventType}`]);
    formData.value = e ? { ...e, sex: e?.sex === '男' ? 'male' : 'female', id: e?.id } : {};
    state.value = eventType;
    visible.value = true;
  }

  // 删除
  if (eventType === 'delete') {
    await store?.delete({ id: e?.id });
    Notification.success('删除成功');
    store.getData({ ...pagination, current: pagination.current - 1 });
  }

  // 下载
  if (eventType === 'download') {
    download('/employee/excel/export');
  }
};

const validate = () => {
  let v = formData.value;
  for (let i of fields) {
    if (i?.required && !i?.validate(v[i?.field])) {
      Notification.info(i?.message);
      return false;
    }
  }
  return true;
};

// 新增和编辑
const handleOk = async () => {
  // 验证失败直接退出
  if (state.value === 'add') {
    await store?.add(formData.value);
    for (let key of Object.keys(formData.value)) {
      formData.value[key] = '';
    }
    Notification.success('添加成功');
  } else {
    const res = await store.modify({ ...formData.value });
    if (res) Notification.success('编辑成功');
  }
  clearState();
  nextTick(() => {
    store.getData(pagination.current);
  });
};

const clearState = () => {
  formData.value = null;
  state.value = 'add';
};

const searchData = (e) => {
  store.getData(e);
};

/**
 * @param {*} current
 * @return {*}
 * @description: 分页
 */
const onPageChange = (current) => {
  store.getData({ ...pagination, current: current - 1 });
};
onMounted(store.init);
</script>

<style scoped lang="scss">
@import url('./index.scss');
</style>

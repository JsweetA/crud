<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload
      :action="url"
      ref="uploadRef"
      :auto-upload="false"
      :fileList="files ? [files] : []"
      :show-file-list="false"
      @change="onChange"
      @progress="onProgress"
      :data="data"
      @success="success"
    >
      <template #upload-button>
        <div :class="`arco-upload-list-item${files && files.status === 'error' ? ' arco-upload-list-item-error' : ''}`">
          <div class="arco-upload-list-picture custom-upload-avatar" v-if="files && files.url">
            <img :src="files.url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <a-progress
              v-if="files.status === 'uploading' && files.percent < 100"
              :percent="files.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <div class="arco-upload-picture-card" v-else>
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">选择头像</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  </a-space>
</template>
  
<script setup>
import { IconEdit, IconPlus } from '@arco-design/web-vue/es/icon';
import { ref, onMounted, computed, watch } from 'vue';
import { uploadRef } from './upload';
import { getToken } from '@/utils/auth';

const files = ref();
const satoken = getToken();
const headers = ref({
  satoken,
});
const data = computed(() => {
  let arr = uploadRef?.value?.fileList[0]?.name.split('.');
  return {
    name: `${new Date().getTime()}.${arr.pop()}`,
    category: 'aaaa',
  };
});
const props = defineProps({
  url: null,
  file: null,
});

const success = () => {
  files.value = null;
};
const onChange = (_, currentFile) => {
  files.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};

const onProgress = (currentFile) => {
  files.value = currentFile;
};

onMounted(() => {
  files.value = {
    ...props.file,
    uid: props?.file.id,
  };
});
</script>
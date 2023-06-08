<template>
    <a-space direction="vertical" :style="{ width: '100%' }">
        {{ data }}
      <a-upload
        :action="url"
        ref="uploadRef"
        :auto-upload="false"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
        @progress="onProgress"
        :headers="headers"
        :data="data"
      >
        <template #upload-button>
          <div
            :class="`arco-upload-list-item${
              file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
            }`"
          >
            <div
              class="arco-upload-list-picture custom-upload-avatar"
              v-if="file && file.url"
            >
              <img :src="file.url" />
              <div class="arco-upload-list-picture-mask">
                <IconEdit />
              </div>
              <a-progress
                v-if="file.status === 'uploading' && file.percent < 100"
                :percent="file.percent"
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
  import { ref,onMounted,computed } from 'vue';
  import { uploadRef } from './upload';
  import { getToken } from '@/utils/auth';

  const file = ref();
  const satoken = getToken();
  const headers = ref({
    satoken,
  });
  const data = computed(()=>{
    return {
        name:uploadRef?.value?.fileList[0]?.name,
        category:'aaaa'
    };
  });
  const props = defineProps({
    url:null
  });
  
  const onChange = (_, currentFile) => {
    file.value = {
      ...currentFile,
      // url: URL.createObjectURL(currentFile.file),
    };
  };
     
  const onProgress = (currentFile) => {
    file.value = currentFile;
  };
  onMounted(()=>{
    console.log("openUpload");
  });
  </script>
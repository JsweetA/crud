<template>
  <a-card style="margin-bottom: 15px" class="card-demo" :title="lable" hoverable>
    <a-tag
      style="margin-right: 20px"
      v-for="(tag, index) of val" :key="tag" closable bordered
      @close="handleRemove(tag, index)"
    >
      {{ tag.name }}
    </a-tag>
    <a-input
      v-if="showInput" ref="inputRef" :style="{ width: '90px' }" size="mini"   v-model.trim="inputVal"
      @keyup.enter="handleAdd"
      @blur="handleAdd"
    />
    <a-tag
      v-else
      :style="{
        width: '90px',
        backgroundColor: 'var(--color-fill-2)',
        border: '1px dashed var(--color-fill-3)',
        cursor: 'pointer',
      }"
      @click="handleEdit"
    >
      <template #icon>
        <icon-plus />
      </template>
      新增
    </a-tag>
  </a-card>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useTableStore } from '@/store/table/index.js';

const store = useTableStore();
const inputRef = ref(null);
const showInput = ref(false);
const inputVal = ref('');
const props = defineProps({
  name: null,
  lable: null,
});

const val = computed(() => {
  let v = store.options[props?.name];
  let arr = [];
  for (let i of Object.keys(v)) {
    arr.push({ name: v[i]?.name, id: v[i]?.id });
  }
  return arr;
});

const handleEdit = () => {
  showInput.value = true;

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const handleAdd = async () => {
  if (inputVal.value) {
    await store.addDep(inputVal.value);

    inputVal.value = '';
  }
  showInput.value = false;
};
// watch(()=>{})
const handleRemove = async (tag, index) => {
  store.delDep(tag?.id);
};

onMounted(() => {
  if (store.options[props?.name] === null) {
    store.getDepartments();
  }
});
</script>

<style scoped>
.card-demo {
  flex: 1;
  margin-left: 24px;
  transition-property: all;
}
.card-demo:hover {
  transform: translateY(-4px);
}
</style>
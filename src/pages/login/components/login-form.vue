<template>
  <div v-if="current === 0" class="login-form-wrapper">
    <div class="login-form-title">登录</div>
    <div class="login-form-sub-title">人员管理系统</div>
    <br />
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="userInfo.username" placeholder="username">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password v-model="userInfo.password" placeholder="password" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="true"
            @change="setRememberPassword"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button type="text" @click="()=>current = 1" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
  <div v-if="current === 1" class="login-form-wrapper">
    <div class="login-form-title">注册</div>
    <div class="login-form-sub-title">管理员账号</div>
    <br />
    <a-form  :model="registerInfo" class="login-form" layout="vertical" >
      <a-form-item
        label="请输入用户名"
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="registerInfo.username" placeholder="用户名：admin">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>  
      <a-form-item
        label="请输入密码"
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"  
      >
        <a-input-password v-model="registerInfo.password" allow-clear placeholder="密码：123456">
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <a-button type="primary" @click="handleRegister" html-type="submit" long :loading="loading">
          确认注册
        </a-button>
        <a-button type="text" @click="()=>current = 0" long class="login-form-register-btn">
          返回
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script setup>
import { register } from '@/services/login.js';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/store/user/index';
import useLoading from '@/hooks/loading';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const store = useUserStore();
const current = ref(0);

const registerInfo = reactive({
  username:'',
  password:''
});

const userInfo = reactive({
  username: '',
  password: '',
});

const handleRegister = async () => {
    setLoading(true);
    await register(registerInfo);
    registerInfo.username = '';
    registerInfo.password = '';
    current.value = 0;
    Message.success("注册成功!");
    setLoading(false);
};
const handleSubmit = async ({ errors, values }) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      const state = await store.login(values);
      if(state){
        router.push({
          name: 'search_table',
        });
        Message.success(t('login.form.login.success'));
      }
    } catch (err) {
      errorMessage.value = err.message;
    } finally {
      setLoading(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.login-form {
  &-wrapper {
    width: 400px;
    padding: 30px;
    padding-left: 40px;
    padding-right: 40px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 1.8px 2.8px 2.2px rgba(0, 0, 0, 0.005), 4.3px 6.7px 5.3px rgba(0, 0, 0, 0.005),
      8.1px 12.5px 10px rgba(0, 0, 0, 0.007), 14.5px 22.3px 17.9px rgba(0, 0, 0, 0.013),
      27.2px 41.8px 33.4px rgba(0, 0, 0, 0.031), 65px 100px 80px rgba(0, 0, 0, 0.11);
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>

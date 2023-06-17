<template>
  <div class="login-form-title">注册</div>
  <div class="login-form-sub-title">管理员账号</div>
  <br />
  <a-form :model="registerInfo" class="login-form" auto-label-width label-align="left">
    <a-form-item
      label="用户名"
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
      label="密码"
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
    <a-form-item
      label="邮箱"
      field="email"
      :rules="[{ required: true, message: '请输入合法邮箱', type: 'email' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="registerInfo.email" placeholder="邮箱：123@qq.com" />
      <a-button  @click="sentSecurityCode" type="outline" :style="{ marginLeft: '10px' }">发送验证</a-button>
    </a-form-item>
    <a-form-item
      label="验证码"
      field="password"
      :rules="[{ required: true, message: '请输入验证码' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="registerInfo.code" allow-clear placeholder="验证码"></a-input>
    </a-form-item>

    <a-space class="btn">
      <a-button type="primary" @click="handleRegister" html-type="submit" long :loading="loading">确认注册</a-button>
      <a-button type="text" @click="emiter('confirm')" long class="login-form-register-btn">返回</a-button>
    </a-space>
  </a-form>
</template>

<script setup>
import { register, fetchSecurityCode } from '@/services/login.js';
import { ref, reactive, watch } from 'vue';
import { Message, Notification } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';

const { loading, setLoading } = useLoading();

const registerInfo = reactive({
  username: '',
  password: '',
  email: '',
  code: '',
});

const emiter = defineEmits(['confirm']);

const sentSecurityCode = async () => {
  let t = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (t.test(registerInfo.email)) {
    Message.success('发送成功!');
    await fetchSecurityCode({ recipient: registerInfo.email });
  } else {
    Message.info('请输入正确邮箱');
  }
};

watch(
  () => registerInfo.code,
  () => {
    registerInfo.code = registerInfo.code.toLocaleUpperCase();
  },
);

const handleRegister = async () => {
  setLoading(true);
  await register(registerInfo);
  registerInfo.username = '';
  registerInfo.password = '';
  Message.success('注册成功!');
  emiter('confirm');
  setLoading(false);
};
</script>

<style lang="scss" scoped>
.btn {
  margin-top: 20px;
  display: flex;
  width: 100%;
  justify-content: space-between;
}
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

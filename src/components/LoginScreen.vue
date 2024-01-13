<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

onMounted(() => {
  import("@components/EditorMain.vue");
});

const router = useRouter();

const username = ref("");
const password = ref("");
const isError = ref(false);

const isLoading = ref(false);

function handleLogin() {
  isLoading.value = true;
  if (username.value === "admin" && password.value === "123456") {
    router.push({
      name: "EditorHome",
    });
  } else {
    isError.value = true;
    isLoading.value = false;
    username.value = "";
    password.value = "";
  }
}
</script>

<template>
  <div class="aris-login-form flex flex-col items-center">
    <div class="aris-login-form__body flex flex-col items-center">
      <img src="/icon-hidpi.webp" class="al-no-select" />
      <div class="login-title al-no-select">欢迎，请登录</div>
      <div class="flex flex-col gap-3 w-full">
        <a-input
          v-model="username"
          placeholder="用户名"
          allow-clear
          :error="isError"
          @press-enter="handleLogin"
        />
        <a-input-password
          v-model="password"
          placeholder="密码"
          allow-clear
          :error="isError"
          @press-enter="handleLogin"
        />
        <span
          class="error-message text-red-600 w-full text-center"
          v-if="isError"
        >
          用户名或密码错误
        </span>
        <a-button
          :loading="isLoading"
          class="mt-2"
          type="primary"
          @click="handleLogin"
          >登录</a-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.aris-login-form {
  width: 288px;
  border-radius: 4px;
  background-color: white;
  margin: 96px auto auto;

  padding: 24px;
  gap: 8px;

  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.04);

  &__body {
    gap: 24px;
    width: 100%;

    img {
      width: 84px;
      height: 84px;
    }

    .login-title {
      font-size: 20px;
      font-weight: 500;
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-self: stretch;
    }
  }

  &__tip {
    font-size: 10px;
    color: #86909c;
  }
}
</style>

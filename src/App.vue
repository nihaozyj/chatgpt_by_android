<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['Home', 'Chat']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import defaultPre from '@/pre.config'

if (!localStorage.preList) {
  localStorage.preList = JSON.stringify(defaultPre)
}

if (!localStorage.setting) {
  localStorage.setting = '{"fontSize":1,"maxToken":2000,"theme":true,"balance":0,"key":"","baseUrl":"https://api.openai.com","model":"gpt-3.5-turbo","temperature":1,"historyNumber":2}'
}
</script>

<style lang="scss">
@import '@/assets/style/global.scss';

#app {
  height: 100vh;
}
</style>

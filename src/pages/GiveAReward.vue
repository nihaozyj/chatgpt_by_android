<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <van-nav-bar title="红包打赏" @click-left="router.back()" left-arrow></van-nav-bar>
    <div class="body">
      <img src="icon/hb.jpg" alt="支付宝红包码" />
      <img src="icon/wx.png" alt="微信收款码" />
      <img src="icon/zfb.jpg" alt="支付宝收款码" />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const setting = reactive({})

const router = useRouter()

onMounted(() => {
  // 初始化设置项
  if (localStorage.setting) {
    const result = JSON.parse(localStorage.setting)
    setting.theme = result.theme
    setting.fontSize = result.fontSize
  }
})

</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

.body {
  width: 100vw;

  img {
    width: calc(100vw - 20px);
    padding: 10px;
    background-color: #0005;
    border-radius: 15px;
    box-sizing: border-box;
    margin: 5px 10px;
  }
}

.container {
  .van-nav-bar {
    position: fixed;
    top: 0;
    width: 100%;
  }
}

.dark {
  background-color: $backgroundColorD;

  ::v-deep [class*=van-hairline]::after {
    border-color: $backgroundColorStressD;
  }

  .van-nav-bar {
    ::v-deep * {
      color: $colorMinor;
    }

    span {
      color: $mainColorD;
    }

    ::v-deep .van-nav-bar__content {
      background-color: $backgroundColorD;
    }

    .message-count {
      color: $colorMinorD;
      background-color: $backgroundColorD;
    }
  }
}
</style>
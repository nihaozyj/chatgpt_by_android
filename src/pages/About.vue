<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <van-nav-bar title="关于 Easygpt" @click-left="router.back()" left-arrow></van-nav-bar>
    <div class="text">
      <v-md-preview :text="markdown" />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const setting = reactive({})

const router = useRouter()

const markdown = `
* 开源仓库 (  [Github](https://https://github.com/nihaozyj/easygpt) / [Gitee](https://gitee.com/easecat_gitee/easygpt) )
* 哔哩哔哩 ( [暴走の毛毛虫](https://space.bilibili.com/39942486) )

* **本项目中关于预设部分，完全照搬 chatgpt next web 和 网上公开设定**
* [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)
`

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

.container {}

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
  padding-top: 50px;
  min-height: 100vh;

  .text {
    padding: 10px 15px;
    font-size: 1.2em;
    line-height: 2em;
  }

  .van-nav-bar {
    position: fixed;
    top: 0;
    width: 100%;
  }
}

.dark {
  background-color: $backgroundColorD;

  color: rgb(198, 198, 198);

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
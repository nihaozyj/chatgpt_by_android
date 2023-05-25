<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <van-nav-bar title="帮助文档" @click-left="router.back()" left-arrow></van-nav-bar>
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
# 关于配置项说明

* \`API KEY\` 必填，不填写将无法正常访问
* \`代理\` 选填，默认为 openai 官方接口地址， 你也可以使用其他第三方接口服务或者自己搭建转发服务器
* \`模型\` 默认为 chatgpt 3.5， 如果启用gpt4，所消耗的金额约3.5的30倍以上，不建议使用gpt4
* \`余额\` 你的api余额
* \`随机性\` 值越大回复的结果越随机，如果设置为2回复结果会乱码，推荐默认值即可
* \`token限制\` 由于不会计算token，因此此处实际是使用的是字符数量，而非token
* \`携带历史消息数\` 每次发送消息是，所携带的上下文数量，如果需要gpt能够对你说的话产生记忆性，你应该把该项拉满

# 功能性说明

* 在聊天界面需要删除请长按并且选择删除，由于技术原因复制功能可能不会生效
* 在预设和主界面，你可以长按对历史和预设进行删除，但由于已知BUG，该功能在移动端浏览器可能不会生效

# 遇到错误的解决方法

* 由于技术原因，该软件可能存在一些BUG，请先尝试重启，如果重启无法解决请清除应用数据
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
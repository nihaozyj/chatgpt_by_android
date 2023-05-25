<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <!-- 顶部导航 -->
    <van-nav-bar @click-left="router.replace('/home')" @click-right="router.push('/setting')">
      <template #left>
        <van-icon name="arrow-left" size="24" />
      </template>
      <template #title>
        <span>{{ history.role.name }}</span>
        <br />
        <span class="message-count">共 {{ history.dialog.length }} 条对话</span>
      </template>
      <template #right>
        <van-icon name="setting" size="24" />
      </template>
    </van-nav-bar>
    <!-- 消息记录 -->
    <div class="message-scroll">
      <div class="content">
        <!-- 机器人预设 -->
        <div class="item user" v-if="history.role.dialog != ''">
          <v-md-preview :text="history.role.dialog" />
        </div>
        <van-divider v-if="history.role.dialog != ''" style="color: #1989fa;border-color: #1989fa">上方为预设消息</van-divider>
        <!-- 用户和机器人的对话 -->
        <div class="item" :class="msg.role" v-for="(msg, index) in history.dialog" :key="msg.date"
          v-long-press="() => showActionSheet(msg.text, msg.date)">
          <v-md-preview :text="msg.text" />
          <van-loading v-if="isLoad && index == history.dialog.length - 1" type="spinner" size="16px" />
        </div>
      </div>
    </div>
    <!-- 底部聊天窗口 -->
    <div class="editor">
      <div class="form">
        <van-field v-model="message" rows="1" autosize type="textarea" placeholder="输入内容" />
        <van-button :icon="isLoad ? 'stop-circle' : 'icon/send.png'" :type="isLoad ? 'warning' : 'primary'"
          class="btn-send" @click="sendMsg">{{ isLoad ? '停止' : '发送' }}</van-button>
      </div>
    </div>
  </div>
  <!-- 动作面板 -->
  <van-action-sheet :disabled="isLoad" @select="onSelect" v-model:show="asData.isShow" :actions="asData.actions"
    close-on-click-action />
</template>

<script setup>
import { ref, reactive, onMounted, watch, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { onLongPress } from '@/utils'
import { showToast } from 'vant'
import { send, httpUpdateSession } from '@/api'

import BScroll from '@better-scroll/core'

const router = useRouter()

const asData = reactive({ isShow: false, actions: [{ name: '复制文本' }, { name: '删除记录' }], text: '', id: '' })

const setting = reactive({})

const history = reactive({ id: 0, dialog: [], role: {} })

const message = ref("")

const isLoad = ref(false)
// 用户滚动区
let bScroll = null

const vLongPress = onLongPress

watch(history, async () => {
  const data = JSON.stringify(history)
  localStorage.history = data
  await httpUpdateSession(JSON.parse(data))
  bScroll.refresh()
})

onUpdated(() => {
  bScroll.refresh()
})

onMounted(() => {
  // 判断有无历史记录
  if (!localStorage.history) return router.replace('/home')
  // 加载已有的历史记录
  const result = JSON.parse(localStorage.history)
  history.id = result.id
  history.role = result.role
  history.dialog = result.dialog
  // 创建聊天消息滚动区域
  bScroll = new BScroll('.message-scroll', {})
  // 滚动到最底部
  setTimeout(() => bScroll.scrollTo(0, bScroll.maxScrollY, 500), 10)
  // 初始化设置项
  if (localStorage.setting) {
    const result = JSON.parse(localStorage.setting)

    setting.theme = result.theme
    setting.fontSize = result.fontSize
    setting.historyNumber = result.historyNumber
    setting.maxToken = result.maxToken
  }
})

async function onSelect(item) {
  if (item.name == asData.actions[0].name) {
    const clipboard = navigator.clipboard
    // 判断用户浏览器是否支持操作剪贴板
    if (clipboard == undefined) return showToast('复制失败，你的浏览器不支持改功能！')
    // 将文本写入剪贴板
    await clipboard.writeText(asData.text)
    showToast('消息文本已复制到剪贴板！')
  }
  else if (item.name == asData.actions[1].name && !isLoad.value) {
    const index = history.dialog.findIndex(item => item.date == asData.id)
    history.dialog.splice(index, 1)
    showToast('删除成功！')
  }
}

function showActionSheet(text, id) {
  asData.isShow = true
  asData.text = text
  asData.id = id
}

function handleMessage(word, error, done, controller) {
  const index = history.dialog.length - 1
  // 用户选择停止消息
  if (!isLoad.value) return (controller.abort())
  // 请求错误，进行提示
  if (error) {
    isLoad.value = false
    history.dialog[index].text = "错误，请检查你的秘钥和网络！"
    bScroll.scrollBy(0, bScroll.maxScrollY - bScroll.y)
    return
  }
  // 请求结束，关闭加载动画、禁用打断按钮
  if (done) return (isLoad.value = false)
  // 将接受到的当个文字放入 DOM 元素中
  history.dialog[index].text += word
  bScroll.scrollBy(0, bScroll.maxScrollY - bScroll.y)
}

async function sendMsg() {
  // 获取要发送的消息内容
  const content = message.value.trim()
  // 当前消息未接收完毕时，禁止发送下一条信息
  if (isLoad.value) return (isLoad.value = false)
  // 消息框未空白时，禁止发送
  if (content == '') return
  // 清空当前编辑窗口
  message.value = ""
  // 将自身编辑的消息放置到界面中
  history.dialog.push({ date: Date.now(), role: 'user', text: content })
  // 添加一条新的空白消息，用于接收 chatgpt 的回复
  history.dialog.push({ date: Date.now() + 2000, role: 'system', text: '' })
  // 显示加载动画
  isLoad.value = true
  // 将预设添加到消息中
  const fullMessage = [
    { role: 'user', content: history.role.dialog },
    { role: 'user', content }
  ]
  // 统计 TOKEN 数， 此处不会统计因此直接统计字数
  let size = history.role.dialog.length + content.length
  // 添加历史消息记录
  for (let i = history.dialog.length - 3, n = 0; i >= 0; i--, n++) {
    // 上下文数量达到了设定，结束添加
    if (n >= setting.historyNumber) break
    // 先统计字数，然后再判断是否添加，因为token超出上限后请求会失败！
    size += history.dialog[i].text.length
    // 没超过最大token则继续添加上下文
    if (size > setting.maxToken) break
    // 将消息添加到上下文
    fullMessage.unshift({
      role: history.dialog[i].role,
      content: history.dialog[i].text
    })
  }
  console.log(`当前字数 ${size}`)
  // 发送请求
  await send(fullMessage, handleMessage)
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';
@import 'highlight.js/styles/atom-one-dark.css';

// 夜晚
.dark {
  background-color: $backgroundColorD;
  color: $colorMinorD;

  .van-field ::v-deep * {
    color: $colorMinorD;
  }

  .van-cell:after {
    border: none;
  }

  ::v-deep [class*=van-hairline]::after {
    border-color: $backgroundColorStressD;
  }

  .van-nav-bar {
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

  .message-scroll {
    .content {
      .van-divider {
        color: $mainColorD;
        border-color: $mainColorD;
      }
    }

    .item {
      .van-loading {
        background-color: $backgroundColorStressD;
        color: black;
      }
    }

    .system {
      background-color: $backgroundColorStressD;

      &::before {
        background-color: $backgroundColorStressD;
      }
    }

    .user {
      background-color: $mainColorD;
      color: $backgroundColorStressD;

      &::before {
        background-color: $mainColorD;
      }
    }
  }

  .editor {
    background-color: $backgroundColorStressD;
    border-top: 1px solid $backgroundColorD;

    .form {
      background-color: $backgroundColorStressD;

      .van-field {
        background-color: $backgroundColorD;
      }
    }
  }
}

// 白天
.bright {
  background-color: $backgroundColor;

  .van-nav-bar {
    .message-count {
      color: $colorMinor;
    }
  }

  .message-scroll {
    .content {
      .van-divider {
        color: $mainColor;
        border-color: $mainColor;
      }
    }

    .item {
      .van-loading {
        background-color: #fff;
        color: black;
      }
    }

    .system {
      background-color: $backgroundColorStress;

      &::before {
        background-color: $backgroundColorStress;
      }
    }

    .user {
      background-color: $mainColor;
      color: $backgroundColorStress;

      &::before {
        background-color: $mainColor;
      }
    }
  }

  .editor {
    background-color: $backgroundColorStress;
    border-top: 1px solid $backgroundColor;

    .form {
      background-color: $backgroundColorStress;

      .van-field {
        background-color: $backgroundColor;
      }
    }
  }
}

// 常规
.container {
  height: 100%;
  padding-top: 46px;

  .van-nav-bar {
    width: 100%;
    position: fixed;
    top: 0;

    .message-count {
      font-size: 0.6em;
      font-weight: 400;
      // color: $colorMinor;
      display: block;
      margin-top: -3px;
    }
  }

  .message-scroll {
    padding: 0 10px;
    height: calc(100vh - 102px);
    overflow: scroll;

    .content {
      display: grid;
      grid-template-columns: 1fr;
      padding-bottom: 50px;
      gap: 10px;

      .van-divider {
        // color: $mainColor;
        // border-color: $mainColor;
        font-size: .1em;
      }
    }

    .item {
      padding: 10px;
      line-height: 1.6em;
      position: relative;
      border-radius: 6px;
      min-height: 22px;

      .van-loading {
        position: absolute;
        right: -8px;
        bottom: 0px;
        // background-color: #fff;
        // color: black;
        padding: 0 3px;
        border-radius: 50%;
      }

      &:nth-child(1) {
        margin-top: 10px;
      }

      &:nth-last-child(1) {
        margin-bottom: 10px;
      }

      &::before {
        content: '';
        display: block;
        width: 15px;
        height: 15px;
        border-radius: 50% 0 50% 0;
        position: absolute;
        top: 0px;
        transform: rotate(45deg);
      }
    }

    .system {
      // background-color: $backgroundColorStress;
      justify-self: self-start;

      &::before {
        // background-color: $backgroundColorStress;
        left: -1px;
      }
    }

    .user {
      // background-color: $mainColor;
      // color: $backgroundColorStress;
      justify-self: self-end;

      &::before {
        // background-color: $mainColor;
        right: -1px;
      }
    }
  }

  .editor {
    position: fixed;
    width: 100%;
    bottom: 0;
    // background-color: $backgroundColorStress;
    padding: 10px;
    // border-top: 1px solid $backgroundColor;

    .form {
      padding-right: 20px;
      display: grid;
      gap: 6px;
      grid-template-columns: 1fr auto;
      // background-color: $backgroundColorStress;

      .van-field {
        // background-color: $backgroundColor;
        border-radius: 5px;
        max-height: 50vh;
        overflow-y: scroll;
      }

      .btn-send {
        align-self: self-end;
      }
    }
  }
}
</style>
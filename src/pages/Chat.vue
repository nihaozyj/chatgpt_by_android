<template>
  <div class="container bright">
    <!-- 顶部导航 -->
    <van-nav-bar>
      <template #left>
        <van-icon name="arrow-left" size="24" />
      </template>
      <template #title>
        <span>{{ role.name }}</span>
        <br />
        <span class="message-count">共 86 条对话</span>
      </template>
      <template #right>
        <van-icon name="manager" size="24" />
      </template>
    </van-nav-bar>
    <!-- 消息记录 -->
    <div class="message-scroll">
      <div class="content">
        <div class="item" :class="msg.role" v-for="msg in history" :key="msg.date"
          v-Long-press="() => showActionSheet(msg.text, msg.date)">
          <v-md-preview :text="msg.text" />
        </div>
      </div>
    </div>
    <!-- 底部聊天窗口 -->
    <div class="editor">
      <div class="form">
        <van-field v-model="message" rows="1" autosize type="textarea" placeholder="输入内容" />
        <van-button icon="icon/发送.png" type="primary" class="btn-send" @click="sendMsg">发送</van-button>
      </div>
    </div>
  </div>
  <!-- 动作面板 -->
  <van-action-sheet @select="onSelect" v-model:show="asData.isShow" :actions="asData.actions" close-on-click-action />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import BScroll from '@better-scroll/core'
import { onLongPress } from '@/utils'
import { showToast } from 'vant'
import { send } from '@/api'

const role = reactive({
  name: '问答机器人',
  presuppose: []
})

const asData = reactive({
  isShow: false,
  actions: [{ name: '复制文本' }, { name: '删除记录' }],
  text: '',
  id: ''
})

const history = reactive([
  {
    date: '2022/10/15 18:16:21', role: 'user', text: '# 你好，横向认识你!'
  },
  { date: '2022/10/15 18:16:25', role: 'system', text: '你好，有问题请就可能得询问我，我会给你我所知道的一切解答!' },
])

const message = ref("")

const vLongPress = onLongPress

watch(history, async () => {
  window.bs.refresh()
  window.bs.scrollBy(0, window.bs.maxScrollY - window.bs.y)
})

onMounted(() => {
  window.bs = new BScroll('.message-scroll', {})
})

async function onSelect(item) {
  if (item.name == asData.actions[0].name) {
    const clipboard = navigator.clipboard
    if (clipboard == undefined)
      return showToast('复制失败，你的浏览器不支持改功能！')
    await clipboard.writeText(asData.text)
    showToast('消息文本已复制到剪贴板！')
  }
  if (item.name == asData.actions[1].name) {
    const index = history.findIndex(item => item.date == asData.id)
    history.splice(index, 1)
    showToast('删除成功！')
  }
}

function showActionSheet(text, id) {
  asData.isShow = true
  asData.text = text
  asData.id = id
}

async function sendMsg() {
  console.log(history)
  history.push({
    date: Date.now(), role: 'user', text: message.value
  })
  await send(message.value)
  message.value = ""
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';
@import 'highlight.js/styles/atom-one-dark.css';

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
      color: $colorMinor;
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
    }

    .item {
      padding: 10px;
      line-height: 1.6em;
      position: relative;
      border-radius: 6px;

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
      background-color: $backgroundColorStress;
      justify-self: self-start;

      &::before {
        background-color: $backgroundColorStress;
        left: -1px;
      }
    }

    .user {
      background-color: $mainColor;
      color: $backgroundColorStress;
      justify-self: self-end;

      &::before {
        background-color: $mainColor;
        right: -1px;
      }
    }
  }

  .editor {
    position: fixed;
    width: 100%;
    bottom: 0;
    background-color: $backgroundColorStress;
    padding: 10px;
    border-top: 1px solid $backgroundColor;

    .form {
      padding-right: 20px;
      display: grid;
      gap: 6px;
      grid-template-columns: 1fr auto;
      background-color: $backgroundColorStress;

      .van-field {
        background-color: $backgroundColor;
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
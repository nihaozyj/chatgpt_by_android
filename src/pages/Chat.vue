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
        <span class="message-count">共 {{ history.length }} 条对话</span>
      </template>
      <template #right>
        <van-icon name="smile" size="24" />
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
  {
    date: '2022/10/15 18:16:25', role: 'system', text: `# 标题`
  }
])

const message = ref("")
const isLoad = ref(false)

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
  if (!isLoad.value && item.name == asData.actions[1].name) {
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

function handleMessage(word, error, done, controller) {
  // chatgpt 消息框数据所对应的索引
  const index = history.length - 1
  // 请求错误，进行提示
  if (error) {
    history[index].text = "错误，请检查你的秘钥和网络！"
    retrun
  }
  // 请求结束，关闭加载动画、禁用打断按钮
  if (done) {
    isLoad.value = false
    return
  }
  // 将接受到的当个文字放入 DOM 元素中
  history[index].text += word
  // 用户选择停止消息
  if (!isLoad.value) controller.abort()
}

async function sendMsg() {
  // 当前消息未接收完毕时，禁止发送下一条信息
  if (isLoad.value) {
    isLoad.value = false
    return
  }
  // 获取要发送的消息内容
  const content = message.value.trim()
  // 清空当前编辑窗口
  message.value = ""
  // 消息框未空白时，禁止发送
  if (content == '') return
  // 将自身编辑的消息放置到界面中
  history.push({ date: Date.now(), role: 'user', text: content })
  // 添加一条新的空白消息，由于接收 chatgpt 的回复
  history.push({ date: Date.now() + 2000, role: 'system', text: '' })
  // 显示加载动画
  isLoad.value = true
  // 发送请求
  await send(content, handleMessage)
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
      min-height: 22px;

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
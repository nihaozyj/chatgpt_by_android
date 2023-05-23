<template>
  <div class="container bright">
    <!-- 头部导航 -->
    <van-nav-bar title="会话记录">
      <template #left>
        <span>管理预设</span>
      </template>
      <template #right>
        <span>配置 GPT</span>
      </template>
    </van-nav-bar>
    <!-- 会话记录滚动区 -->
    <div class="history-scroll">
      <div class="content">
        <van-empty v-if="historys.length == 0" description="会话记录为空" />
        <!-- 历史记录列表 -->
        <div class="item" v-for="item in historys" :key="item.historyId">
          <div>
            <h2>{{ item.role.name }}</h2>
          </div>
          <div>
            <span>{{ item.dialog.length }} 条对话</span>
            <span>{{ getFormatDate(item.dialog) }}</span>
          </div>
        </div>
        <!-- 占位 50 px -->
        <div class="end"></div>
      </div>
    </div>
    <!-- '创建对话' 按钮 -->
    <van-button icon="plus" type="primary" text="创建对话" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { formatDate } from '@/utils'

import BScroll from '@better-scroll/core'

// 用户滚动区
let bScroll = null

const historys = [
  {
    historyId: 1,
    role: { name: '文档机器人', presuppose: [{ role: 'user', text: '请使用 markdown 进行回复！' }] },
    dialog: [{ date: 1684808101175, role: 'user', text: '# 你好!' }]
  },
  {
    historyId: 1,
    role: { name: '文档机器人', presuppose: [{ role: 'user', text: '请使用 markdown 进行回复！' }] },
    dialog: [{ date: 1684808101175, role: 'user', text: '# 你好!' }]
  },
]

onMounted(() => {
  // 创建聊天消息滚动区域
  bScroll = new BScroll('.history-scroll', {})
  bScroll.refresh()
})

function deleteSession(id) {
  console.log(111111)
}

function getFormatDate(dialog) {
  if (dialog.length == 0) return '00:00'
  // 与当前时间的时间差
  const timestamp = dialog[dialog.length - 1].date
  const gap = Date.now() - timestamp

  if (gap < 60 * 1000) return '刚刚'
  if (gap < 60 * 60 * 1000) return '1小时内'
  if (gap < 24 * 60 * 60 * 1000) return formatDate(timestamp, "DD日hh:mm")
  if (gap < 30 * 24 * 60 * 60 * 1000) return formatDate(timestamp, "MM/DD hh:mm")
  return formatDate(timestamp, "YYYY/MM/DD hh:mm")
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

.container {
  height: 100vh;
  box-sizing: border-box;
  background-color: $backgroundColor;
  padding-top: 46px;

  .van-nav-bar {
    position: fixed;
    width: 100%;
    top: 0;

    span {
      font-weight: bold;
      color: $mainColor;
      border: 1px solid $backgroundColor;
      padding: 2px 10px;
      border-radius: 5px;
    }
  }

  &>.van-button {
    position: fixed;
    right: 20px;
    bottom: 30px;
    border-radius: 10px;
  }

  .history-scroll {
    height: calc(100vh - 46px);

    .content {
      .end {
        height: 100px;
      }

      .item {
        margin: 10px 12px;
        padding: 12px;
        border-radius: 6px;
        background-color: $backgroundColorStress;

        &>div {
          display: flex;
          justify-content: space-between;

          &:nth-child(1) {
            margin-bottom: 18px;

            h2 {
              font-weight: bold;
            }

            .van-button {
              margin-top: -7px;
            }
          }

          &:nth-child(2) {
            color: $colorMinor;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <!-- 头部导航 -->
    <van-nav-bar title="会话记录" @click-right="router.push('/setting')" @click-left="router.push('/preinstall')">
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
        <div class="item" v-for="item in historys" :key="item.id" v-long-press="() => deleteSession(item.id)"
          @click="openSession(item)">
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
    <van-button icon="plus" type="primary" text="创建对话" @click="router.push('/create-session')" />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { formatDate, onLongPress } from '@/utils'
import { useRouter } from 'vue-router'
import { httpHistorys, httpDeleteSession } from '@/api'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()

const vLongPress = onLongPress

const historys = reactive([])

const setting = reactive({})

// historys 数据格式
// [
//   {
//     id: 28,
//     role: { name: '文档机器人', dialog: '' },
//     dialog: [{ date: 1684808101175, role: 'user', text: '# 你好!' }]
//   },
// ]

onMounted(async () => {
  localStorage.removeItem('history')
  // 初始化设置项
  if (localStorage.setting) {
    const result = JSON.parse(localStorage.setting)
    setting.theme = result.theme
    setting.fontSize = result.fontSize
  }
  const result = await httpHistorys()
  if (!result) return showToast('获取历史数据失败！')
  result.forEach(item => historys.push(item))
})

function deleteSession(id) {
  showConfirmDialog({ message: '你确定要删除该记录吗 ?' })
    .then(async () => {
      const index = historys.findIndex(item => item.id == id)
      const result = await httpDeleteSession(id)
      if (result) {
        historys.splice(index, 1)
        showToast('删除失败!')
      }
      else {
        showToast('删除失败!')
      }
    })
    .catch(() => { })
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

function openSession(item) {
  localStorage.history = JSON.stringify({ ...item })
  router.push('/')
}

</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

// 黑夜主题
.dark {
  background-color: $backgroundColorD;
  color: $colorMinorD;

  .van-field {
    background-color: $backgroundColorStressD;

    ::v-deep * {
      color: $colorMinorD;
    }
  }

  .van-cell:after {
    border: none;
  }

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

  .content {
    .item {
      background-color: $backgroundColorStressD;

      &>div {
        &:nth-child(2) {
          color: $colorMinorD;
        }
      }
    }
  }
}

// 白天主题
.bright {
  background-color: $backgroundColor;

  .van-nav-bar {
    span {
      color: $mainColor;
      border: 1px solid $backgroundColor;
    }
  }

  .content {
    .item {
      background-color: $backgroundColorStress;

      &>div {
        &:nth-child(2) {
          color: $colorMinor;
        }
      }
    }
  }
}

// 样式

.container {
  height: 100vh;
  box-sizing: border-box;
  // background-color: $backgroundColor;
  padding-top: 46px;

  .van-nav-bar {
    position: fixed;
    width: 100%;
    top: 0;

    span {
      font-weight: bold;
      // color: $mainColor;
      // border: 1px solid $backgroundColor;
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
    overflow-y: scroll;

    .content {
      .end {
        height: 100px;
      }

      .item {
        margin: 10px 12px;
        padding: 12px;
        border-radius: 6px;
        // background-color: $backgroundColorStress;

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
            // color: $colorMinor;
          }
        }
      }
    }
  }
}
</style>
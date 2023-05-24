<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <!-- 头部导航 -->
    <van-nav-bar title="请选择一个预设" @click-left="router.back()" left-arrow />
    <!-- 会话记录滚动区 -->
    <div class="history-scroll">
      <div class="content">
        <div class="item" @click="createSession()">
          <div>
            <h2>默认聊天机器人</h2>
          </div>
          <van-text-ellipsis rows="3" content="该预设有任何提示词！" />
        </div>
        <!-- 历史记录列表 -->
        <div class="item" v-for="item in preList" :key="item.id" @click="createSession(item)">
          <div>
            <h2>{{ item.name }}</h2>
          </div>
          <van-text-ellipsis rows="3" :content="item.dialog" />
        </div>
        <!-- 占位 50 px -->
        <div class="end"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { httpCreateSession } from '@/api'
import { showToast } from 'vant'

const router = useRouter()

const preList = reactive([])

const setting = reactive({})

watch(preList, (nv) => {
  localStorage.preList = JSON.stringify(nv)
})

onMounted(() => {
  // 初始化设置项
  if (localStorage.setting) {
    const result = JSON.parse(localStorage.setting)
    setting.theme = result.theme
    setting.fontSize = result.fontSize
  }

  if (!localStorage.preList) return

  try {
    const pl = JSON.parse(localStorage.preList)
    preList.push(...pl)
  } catch (error) { console.error(error) }
})

async function createSession(pre = { name: '默认聊天机器人', dialog: '' }) {
  // 创建一条历史记录
  const history = { id: Date.now(), role: { ...pre }, dialog: [] }
  // 将历史记录添加到数据库
  const result = await httpCreateSession(history)
  // 进入聊天界面
  if (result) {
    localStorage.history = JSON.stringify(history)
    router.replace('/')
  }
  // 出现错误
  showToast('创建失败，请手动清除应用数据后再次尝试！')
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

// 黑夜
.dark {
  background-color: $backgroundColorD;
  color: $colorMinorD;

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

  .edit-box {
    .van-field {
      background-color: $backgroundColorD;
    }
  }

  .van-nav-bar {
    span {
      color: $mainColorD;
      border: 1px solid $backgroundColorD;
    }
  }

  .history-scroll {
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
}

// 白天
.bright {
  background-color: $backgroundColor;

  .edit-box {
    .van-field {
      background-color: $backgroundColor;
    }
  }

  .van-nav-bar {
    span {
      color: $mainColor;
      border: 1px solid $backgroundColor;
    }
  }

  .history-scroll {
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
}

// 常规

.container {
  height: 100vh;
  box-sizing: border-box;
  // background-color: $backgroundColor;
  padding-top: 46px;

  .edit-box {
    padding: 10px;

    .van-field {
      // background-color: $backgroundColor;
      margin-bottom: 10px;
      border-radius: 5px;
    }

    .van-button {
      position: absolute;
      width: calc(100% - 20px);
      bottom: 20px;
      border-radius: 5px;
    }
  }

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

          // &:nth-child(2) {
          //   color: $colorMinor;
          // }
        }
      }
    }
  }
}
</style>
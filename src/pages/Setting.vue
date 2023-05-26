<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <!-- 头部导航 -->
    <van-nav-bar title="GPT相关配置" left-arrow @click-left="router.back()" />
    <div class="setting-scroll">
      <div class="setting">
        <div class="block">
          <div class="item">
            <h3>主题（ 暗 / 亮 ）</h3>
            <van-switch v-model="setting.theme" />
          </div>
          <div class="item">
            <h3>字体大小</h3>
            <van-slider v-model="setting.fontSize" max="1.3" min="0.8" step="0.01">
              <template #button>
                <div class="custom-button">{{ setting.fontSize }}</div>
              </template>
            </van-slider>
          </div>
        </div>
        <div class="block">
          <div class="item">
            <h3>API KEY</h3>
            <van-field v-model="setting.key" placeholder="输入您的 KEY" />
          </div>
          <div class="item">
            <h3>启用代理</h3>
            <van-field v-model="setting.baseUrl" placeholder="https://api.openai.com" />
          </div>
          <div class="item">
            <h3>模型</h3>
            <select v-model="setting.model">
              <option>gpt-3.5-turbo</option>
              <option>gpt-4</option>
            </select>
          </div>
          <div class="item">
            <h3>余额</h3>
            <span style="color:#1989FA; font-weight: bold;">剩余 {{ setting.balance }} P</span>
          </div>
          <div class="item">
            <h3>随机性</h3>
            <van-slider v-model="setting.temperature" max="2" min="0" step="0.1">
              <template #button>
                <div class="custom-button">{{ setting.temperature }}</div>
              </template>
            </van-slider>
          </div>
          <div class="item">
            <h3>Token限制</h3>
            <van-slider v-model="setting.maxToken" max="4000" min="100" step="100">
              <template #button>
                <div class="custom-button">{{ setting.maxToken }}</div>
              </template>
            </van-slider>
          </div>
          <div class="item">
            <h3>携带历史消息数</h3>
            <van-slider v-model="setting.historyNumber" max="100" min="0" step="1">
              <template #button>
                <div class="custom-button">{{ setting.historyNumber }}</div>
              </template>
            </van-slider>
          </div>
        </div>
        <div class="block">
          <div class="item" @click="router.push('/about')">
            <h3>关于 EasyGPT</h3>
            <van-icon name="arrow" />
          </div>
          <div class="item" @click="router.push('/help')">
            <h3>帮助文档</h3>
            <van-icon name="arrow" />
          </div>
          <div class="item" @click="router.push('/give-reward')">
            <h3>打赏</h3>
            <van-icon name="arrow" />
          </div>
        </div>
        <van-button type="primary" @click="reset()">恢复默认值</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getBalance } from '@/api'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const setting = reactive({})

onMounted(async () => {
  reset(localStorage.setting)
  watch(setting, () => {
    localStorage.setting = JSON.stringify(setting)
  })

  // 如果用户选择了gpt4则进行提示
  watch(() => setting.model, nv => {
    if (nv != 'gpt-4') return
    showConfirmDialog({ message: 'GPT4 的价格约为 GPT3.5 的 30 倍以上，你确定要使用吗 ?' })
      .then(() => { })
      .catch(() => {
        setting.model = 'gpt-3.5-turbo'
      })
  })

  // 主题改变后调用方法使系统通知栏颜色改变,此处会调用 5+APP 暴露的全局方法
  watch(() => setting.theme, () => {
    if (window.$5PlusAPI)
      window.$5PlusAPI.switchTheme(setting.theme)
  })

  setting.balance = (await getBalance()).total_granted
})

function reset(settingJson) {
  const config = JSON.parse(settingJson || `{"theme":true,"fontSize":1,"key":"","baseUrl":"https://api.openai.com","model":"gpt-3.5-turbo","balance":0,"temperature":1,"maxToken":2000,"historyNumber":2}`)
  setting.theme = config.theme
  setting.balance = config.balance
  setting.fontSize = config.fontSize
  setting.useMarkdownView = config.useMarkdownView
  setting.key = config.key
  setting.baseUrl = config.baseUrl
  setting.model = config.model
  setting.balance = config.balance
  setting.temperature = config.temperature
  setting.maxToken = config.maxToken
  setting.historyNumber = config.historyNumber
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

// 黑夜
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

  .setting {
    .block {
      background-color: $backgroundColorStressD;

      .item {
        border-bottom: 1px solid $backgroundColorD;

        select {
          background-color: #0000;
          border: 1px solid $backgroundColorD;
        }

        .van-field {
          border: 1px solid $backgroundColorD;
        }

        .custom-button {
          background-color: $mainColorD;
          color: $backgroundColorStressD;
        }
      }

      .icon-wrapper .van-icon-underway {
        color: rgb(255, 135, 80);
      }

      .icon-wrapper .van-icon-smile {
        color: $mainColorD;
      }
    }
  }
}

// 白天
.bright {
  background-color: $backgroundColor;

  .setting {
    .block {
      background-color: $backgroundColorStress;

      .item {
        border-bottom: 1px solid $backgroundColor;

        select {
          background-color: #0000;
          border: 1px solid $backgroundColor;
        }

        .van-field {
          border: 1px solid $backgroundColor;
        }

        .custom-button {
          background-color: $mainColor;
          color: $backgroundColorStress;
        }
      }

      .icon-wrapper .van-icon-underway {
        color: rgb(255, 135, 80);
      }

      .icon-wrapper .van-icon-smile {
        color: $mainColorD;
      }
    }
  }
}

// 常规
.container {
  .setting-scroll {
    height: calc(100vh - 46px);
    overflow-y: scroll;
  }

  .setting {
    width: 100%;
    padding-bottom: 100px;

    .van-button {
      margin: 0 10px;
      width: calc(100% - 20px);
      font-size: 1em;
    }

    .block {
      padding: 2px 5px;
      // background-color: $backgroundColorStress;
      margin: 10px;
      border-radius: 6px;

      .item {
        // border-bottom: 1px solid $backgroundColor;
        line-height: 3.5em;
        padding: 0 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        select {
          padding: 5px 10px;
          // background-color: #0000;
          // border: 1px solid $backgroundColor;
          border-radius: 5px;
        }

        .van-button {
          width: 20%;
          margin-right: 0;
          font-size: 1em;
        }

        .van-field {
          max-width: 70%;
          // border: 1px solid $backgroundColor;
          padding: .3em 1em;
          border-radius: 5px;
          font-size: 1em;
        }

        .van-slider {
          width: 50%;
          margin-right: 32px;
          font-size: 1em;

          .custom-button {
            padding: 5px 10px;
            // background-color: $mainColor;
            height: 1em;
            line-height: 1em;
            border-radius: 10px;
            // color: $backgroundColorStress;
            white-space: nowrap;
          }
        }

        .icon-wrapper {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          font-size: 1em;
        }

        // .icon-wrapper .van-icon-underway {
        //   color: rgb(255, 135, 80);
        // }

        // .icon-wrapper .van-icon-smile {
        //   color: $mainColor;
        // }

        h3 {
          font-weight: bold;
        }

        &:nth-last-child(1) {
          border: none;
        }
      }
    }
  }
}
</style>
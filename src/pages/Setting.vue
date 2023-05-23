<template>
  <div class="container bright">
    <!-- 头部导航 -->
    <van-nav-bar title="GPT相关配置" left-arrow />
    <div class="setting-scroll">
      <div class="setting content">
        <div class="block">
          <div class="item">
            <h3>主题（ 暗 / 亮 ）</h3>
            <van-switch v-model="isBright" />
          </div>
          <div class="item">
            <h3>字体大小</h3>
            <van-slider v-model="setting.fontSize" max="1.5" min="0.5" step="0.1">
              <template #button>
                <div class="custom-button">{{ setting.fontSize }}</div>
              </template>
            </van-slider>
          </div>
          <div class="item">
            <h3>启用 Markdown 预览</h3>
            <van-switch v-model="setting.useMarkdownView" />
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
              <option>gpt-4</option>
              <option>gpt-3.5-turbo</option>
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
            <h3>附带历史消息数</h3>
            <van-slider v-model="setting.historyNumber" max="10" min="0" step="1">
              <template #button>
                <div class="custom-button">{{ setting.historyNumber }}</div>
              </template>
            </van-slider>
          </div>
        </div>
        <div class="block">
          <div class="item">
            <h3>关于 EasyGPT</h3>
            <van-icon name="arrow" />
          </div>
          <div class="item">
            <h3>给个赞助吧！</h3>
            <van-icon name="arrow" />
          </div>
        </div>
        <van-button type="primary">恢复默认值</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'

import BScroll from '@better-scroll/core'

// 主题
const isBright = ref(true)

const setting = reactive({
  // 主题 取值为 bright/dark
  theme: 'bright',
  // 字体大小 单位为 em
  fontSize: 1,
  // 是否使用markdown预览消息
  useMarkdownView: true,
  // 接口令牌
  key: '',
  // 请求的地址
  baseUrl: 'https://api.openai.com',
  // gpt 的模型
  model: 'gpt-3.5-turbo',
  // 余额
  balance: 0,
  // 随机性
  temperature: 0.5,
  // 单次信息的最大token
  maxToken: 2000,
  // 单次携带的上下文历史数量
  historyNumber: 2
})

// watch(isBright, async (ov, nv) => {
//   setting.theme = nv ? 'bright' : 'dark'
// })

onMounted(() => {
  new BScroll('.setting-scroll')
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

.container {
  .setting-scroll {
    height: calc(100vh - 46px);
  }

  .setting {
    width: 100%;
    padding-bottom: 100px;

    .van-button {
      margin: 0 10px;
      width: calc(100% - 20px);
    }

    .block {
      padding: 2px 5px;
      background-color: $backgroundColorStress;
      margin: 10px;
      border-radius: 6px;

      .item {
        border-bottom: 1px solid $backgroundColor;
        line-height: 3.5em;
        padding: 0 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        select {
          padding: 5px 10px;
          background-color: #0000;
          border: 1px solid $backgroundColor;
          border-radius: 5px;
        }

        .van-button {
          width: 20%;
          margin-right: 0;
        }

        .van-field {
          max-width: 78%;
          border: 1px solid $backgroundColor;
          padding: 3px 10px;
          border-radius: 5px;
        }

        .van-slider {
          width: 50%;
          margin-right: 32px;

          .custom-button {
            padding: 5px 10px;
            background-color: $mainColor;
            height: 1em;
            line-height: 1em;
            border-radius: 10px;
            color: $backgroundColorStress;
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

        .icon-wrapper .van-icon-underway {
          color: rgb(255, 135, 80);
        }

        .icon-wrapper .van-icon-smile {
          color: $mainColor;
        }

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
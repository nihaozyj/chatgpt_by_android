<template>
  <div class="container" :class="setting.theme ? 'bright' : 'dark'" :style="'font-size:' + setting.fontSize + 'em'">
    <!-- 头部导航 -->
    <van-nav-bar title="预设管理" @click-left="router.back()" @click-right="help" left-arrow>
      <template #right>
        <div>
          <van-icon size="24" name="question" />
        </div>
      </template>
    </van-nav-bar>
    <!-- 会话记录滚动区 -->
    <div class="history-scroll">
      <div class="content">
        <van-empty v-if="preList.length == 0" description="预设为空" />
        <!-- 历史记录列表 -->
        <div class="item" v-for="item in preList" :key="item.id" @click="showEditDialog(item)"
          v-long-press="() => showDeleteDialog(item)">
          <div>
            <h2>{{ item.name }}</h2>
          </div>
          <van-text-ellipsis rows="3" :content="item.dialog" />
        </div>
        <!-- 占位 50 px -->
        <div class="end"></div>
      </div>
    </div>
    <!-- '创建对话' 按钮 -->
    <van-button icon="plus" type="primary" text="创建预设" @click="showCreateDialog" />
    <!-- 编辑窗口 -->
    <van-popup v-model:show="preItem.showPopup" round position="bottom" style="height: 50%;">
      <div class="edit-box">
        <van-button type="primary" @click="savePre" :text="preItem.isUpdate ? '保存预设' : '创建预设'" />
        <van-cell-group inset>
          <van-field v-model="preItem.name" label="名称" placeholder="预设名称" />
        </van-cell-group>
        <van-cell-group inset>
          <van-field v-model="preItem.dialog" show-word-limit rows="6" autosize label="留言" type="textarea" maxlength="500"
            placeholder="请输入预设" style="max-height: 13.5em;overflow-y: scroll;" />
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { onLongPress } from '@/utils'
import { showConfirmDialog, showToast, showDialog } from 'vant'

const vLongPress = onLongPress

const router = useRouter()

const preList = reactive([])

const preItem = reactive({ isUpdate: false, showPopup: false, id: 1, name: '', dialog: '' })

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

function showDeleteDialog(role) {
  showConfirmDialog({ message: `是否删除名为 “${role.name}” 的预设 ?` })
    .then(() => {
      const index = preList.findIndex(item => item.id == role.id)
      preList.splice(index, 1)
      bScroll.refresh()
      showToast('删除成功!')
    })
    .catch(() => { })
}
function showEditDialog(role) {
  preItem.showPopup = true
  preItem.isUpdate = true
  preItem.name = role.name
  preItem.dialog = role.dialog
  preItem.id = role.id
}

function showCreateDialog() {
  preItem.showPopup = true
  preItem.isUpdate = false
  preItem.name = ''
  preItem.dialog = ''
}

function help() {
  showDialog({
    message: '长按可删除预设\n\n点击可以修改预设信息\n\n如需要添加预设可点击右下角“创建预设”按钮!',
  })
}

function savePre() {
  if (preItem.name.trim() == '') return showToast('请填写预设名称')
  // 关闭弹出层
  preItem.showPopup = false
  // 判断当前是更新还是创建
  if (preItem.isUpdate) {
    const index = preList.findIndex(item => item.id == preItem.id)
    preList[index].dialog = preItem.dialog.trim()
    preList[index].name = preItem.name.trim()
  }
  else {
    preList.unshift({
      id: Date.now(), dialog: preItem.dialog.trim(), name: preItem.name.trim()
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/style/global.scss';

// 黑夜主题
.dark {
  background-color: $backgroundColorD;


  ::v-deep>.van-popup {
    background-color: $backgroundColorD;
  }

  .item {
    * {
      color: $colorMinorD;
    }
  }

  .van-popup {
    * {
      background: $backgroundColorD !important;
    }


  }

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
    .item {
      background-color: $backgroundColorStressD;

      &>div {
        &:nth-child(2) {
          color: $colorMinor;
        }
      }
    }
  }
}

// 白天主题
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
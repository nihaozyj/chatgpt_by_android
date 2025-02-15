import { mount } from 'svelte'
import './reset.css'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

// 初始化主题
setTimeout(() => {
  document.body.className = 'dark'
})

document.addEventListener('plusready', function () {
  let firstPressTime = null
  const webview = plus.webview.currentWebview()

  plus.key.addEventListener('backbutton' as any, function () {
    if (webview.id === 'home') {
      // 如果是主页，启用双击退出逻辑
      if (!firstPressTime) {
        firstPressTime = new Date().getTime()
        plus.nativeUI.toast('再按一次退出应用', { duration: 'short' })
        setTimeout(function () {
          firstPressTime = null
        }, 1000)
      } else {
        if (new Date().getTime() - firstPressTime < 1000) {
          plus.runtime.quit()
        }
      }
    } else {
      // 如果不是主页，执行正常回退逻辑
      webview.canBack(function (e) {
        if (e.canBack) {
          webview.back()
        } else {
          plus.nativeUI.toast('页面无法回退', { duration: 'short' })
        }
      })
    }
  })
})


export default app

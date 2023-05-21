// 长按事件
export const onLongPress = {
  beforeMount(el, binding, vNode) {
    if (typeof binding.value !== "function") {
      const compName = vNode.context
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be `
      if (compName) { warn += `Found in component '${compName}' ` }
      console.warn(warn)
    }

    let pressTimer = null
    const handler = (e) => {
      binding.value(e)
    }
    const start = (e) => {
      if (e.type === "click") {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => { handler(e) }, 500)
      }
    }
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    document.oncontextmenu = function (event) {
      event.preventDefault()
      return false
    }
    el.addEventListener('contextmenu', function (e) { e.preventDefault() }, false)
    el.addEventListener("mousedown", start)
    el.addEventListener("touchstart", start)
    el.addEventListener("click", cancel)
    el.addEventListener("mouseout", cancel)
    el.addEventListener("mousemove", cancel)
    el.addEventListener("touchend", cancel)
    el.addEventListener("touchcancel", cancel)
    el.addEventListener("touchmove", cancel)
  }
}

// 获取格式化时间字符串
export function formatDate(timestamp = Date.now(), format = "YYYY/MM/DD hh:mm:ss") {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")
  const second = String(date.getSeconds()).padStart(2, "0")
  format = format.replace("YYYY", year)
  format = format.replace("MM", month)
  format = format.replace("DD", day)
  format = format.replace("hh", hour)
  format = format.replace("mm", minute)
  format = format.replace("ss", second)
  return format
}
// 长按事件
export const onLongPress = {
  mounted(el, binding) {
    document.oncontextmenu = function (event) {
      event.preventDefault()
      return false
    }
    el.addEventListener('contextmenu', function (e) { e.preventDefault() }, false)

    let startTimer = ''

    const start = () => startTimer = setTimeout(() => { binding.value() }, 400)

    const end = () => clearTimeout(startTimer)

    el.addEventListener('touchstart', start)
    el.addEventListener('touchend', end)
    el.addEventListener('touchmove', end)
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

// 获取变量的布尔值表达
export function bool(value) {
  if (typeof (value) === 'undefined' || value === 0 || value === '' || value == null)
    return false
  return true
}

// 复制文本到剪贴板
export function copyToClipboard(text) {
  // 创建一个文本域 
  const textArea = document.createElement('textarea')
  // 隐藏掉这个文本域，使其在页面上不显示	
  textArea.style.position = 'fixed'
  textArea.style.visibility = '-10000px'
  // 将需要复制的内容赋值给文本域
  textArea.value = text
  // 将这个文本域添加到页面上
  document.body.appendChild(textArea)
  // 添加聚焦事件，写了可以鼠标选取要复制的内容
  textArea.focus()
  // 选取文本域内容
  textArea.select()

  if (!document.execCommand('copy')) {
    // 复制失败将构造的标签 移除
    document.body.removeChild(textArea)
    return false
  } else {
    // 复制成功后再将构造的标签 移除
    document.body.removeChild(textArea)
    return true
  }
}
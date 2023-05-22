import { fetchEventSource } from "@microsoft/fetch-event-source"

export async function send(content, handleMessage) {
  const controller = new AbortController()
  // 请求地址
  const baseUrl = localStorage.baseUrl || 'https://openai.api2d.net'
  // 请求方式
  const method = 'POST'
  // 请求头
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk189338-hWotPqmwHi7x2JrU0ZkUsxwkV7QmOlzu'
  }
  // 请求体
  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content }],
    stream: true
  })

  await fetchEventSource(`${baseUrl}/v1/chat/completions`, {
    headers, method, body, signal: controller.signal,
    // 处理收到的消息
    onmessage(event) {
      try {
        // 此处必须放在 try 块中，如果捕获到异常则说明字符串中出现 '[DONE]'，这标准这传输完成
        // 如果代码没有放在 try catch 块中，则会因为异常没有被捕获，而重新发起请求，
        // 至于为什么会这样，我没看明白
        const content = JSON.parse(event.data).choices[0].delta.content || ''
        // 判断消息是否存在，存在则添加到消息框中, 第一次获取的肯定是 undefined, 直接返回空串
        handleMessage(content, null, false, controller)
      } catch {
        // 出现报错，说明连接关闭
        handleMessage(null, null, true, controller)
      }
    },
    onerror(err) {
      handleMessage(null, err, false, controller)
    }
  })
}

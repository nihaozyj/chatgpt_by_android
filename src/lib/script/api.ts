/**
 * 创建聊天 API 的工厂函数
 * @returns 包含 chat 和 cancel 方法的对象
 */
export function createStreamChatApi() {
  const controller = new AbortController()
  const signal = controller.signal

  /**
   * 发送聊天请求并处理流式响应
   * @param {string} baseUrl - API 基础 URL
   * @param {string} apiKey - API 密钥
   * @param {Object} body - 请求体
   * @param {function} callback - 处理响应的回调函数
   */
  async function chat(
    baseUrl: string,
    apiKey: string,
    body: object,
    callback: (content: string | null, error: string | null) => void
  ) {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal,
        cache: 'no-store'
      })

      if (!response.ok) {
        console.error(response)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let result = ''
      let buffer = '' // 用于存储可能不完整的 JSON 数据片段

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk // 将此次传输的数据块追加到缓冲区

        const lines = buffer.split('\n')
        buffer = lines.pop()! // 最后一行可能是不完整的，保留到缓冲区

        for (const line of lines) {
          if (!line.startsWith('data: ')) {
            continue // 忽略非数据行
          }

          const jsonData = line.slice(6)
          if (jsonData === '[DONE]') {
            callback(null, null)
            return
          }

          try {
            const parsedData = JSON.parse(jsonData)
            const content = parsedData.choices[0]?.delta?.content || ''
            result += content
            try {
              callback(content, null)
            } catch (callbackError) {
              console.error('回调函数执行错误:', callbackError)
            }
          } catch (error) {
            // 如果解析失败，不立即抛出错误，而是等待下次块传输补足剩余部分
            console.error('部分数据解析错误，等待补全:', error)
          }
        }
      }

      // 流结束后，检查缓冲区是否残留未处理的数据
      if (buffer.trim()) {
        try {
          const parsedData = JSON.parse(buffer)
          const content = parsedData.choices[0]?.delta?.content || ''
          result += content
          callback(content, null)
        } catch (error) {
          console.error('流结束时缓冲数据解析失败:', error)
          callback(null, '流结束时解析错误')
        }
      }

      callback(result, null)
    } catch (error) {
      if (error.name === 'AbortError') {
        callback(null, '请求已被取消')
      } else {
        callback(null, error.message)
      }
    }
  }

  /**
   * 取消正在进行的请求
   */
  function cancel() {
    controller.abort()
  }

  return { chat, cancel }
}

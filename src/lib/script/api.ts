/**
 * 创建聊天 API 的工厂函数
 * @returns 包含 chat 和 cancel 方法的对象
 */
export function createStreamChatApi() {
  const controller = new AbortController();
  const signal = controller.signal;

  /**
   * 发送聊天请求并处理流式响应
   * @param {string} baseUrl - API 基础 URL
   * @param {string} apiKey - API 密钥
   * @param {Object} body - 请求体
   * @param {function} callback - 处理响应的回调函数
   */
  async function chat(baseUrl: string, apiKey: string, body: object, callback: (content: string | null, error: string | null) => void) {
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
      });

      if (!response.ok) {
        console.error(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonData = line.slice(6);
            if (jsonData === '[DONE]') {
              callback(null, null);
              return;
            }

            try {
              const parsedData = JSON.parse(jsonData);
              const content = parsedData.choices[0]?.delta?.content || '';
              result += content;
              try {
                callback(content, null);
              } catch (callbackError) {
                console.error('回调函数执行错误:', callbackError);
              }
            } catch (error) {
              console.error('解析错误:', error);
              callback(null, '解析错误');
              console.log(line);
            }
          }
        }
      }

      callback(result, null);
    } catch (error) {
      if (error.name === 'AbortError') {
        callback(null, '请求已被取消');
      } else {
        callback(null, error.message);
      }
    }
  }

  /**
   * 取消正在进行的请求
   */
  function cancel() {
    controller.abort();
  }

  return { chat, cancel };
}


/**
 * 创建聊天 API 的工厂函数
 * @returns 包含 chat 和 cancel 方法的对象
 */
export function createChatApi() {
  const controller = new AbortController();
  const signal = controller.signal;

  /**
   * 发送聊天请求并返回完整响应
   * @param {string} baseUrl - API 基础 URL
   * @param {string} apiKey - API 密钥
   * @param {Object} body - 请求体
   * @returns {Promise<string>} 返回内容的Promise
   */
  async function chat(baseUrl: string, apiKey: string, body: object): Promise<string> {
    try {
      // 发送请求到指定的API
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal,
        cache: 'no-store'
      });

      // 检查响应是否成功
      if (!response.ok) {
        console.error(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 读取响应的整体内容
      const responseData = await response.json();

      // 如果响应中包含错误信息则处理
      if (!responseData || !responseData.choices || responseData.choices.length === 0) {
        throw new Error("无有效响应");
      }

      // 提取内容并返回
      return responseData.choices[0].text || '';

    } catch (error) {
      // 传播请求取消或其他错误信息
      if (error.name === 'AbortError') {
        throw new Error('请求已被取消');
      } else {
        throw new Error(error.message);
      }
    }
  }

  /**
   * 取消正在进行的请求
   */
  function cancel() {
    // 中止当前请求
    controller.abort();
  }

  return { chat, cancel };
}

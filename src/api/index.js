import { fetchEventSource } from "@microsoft/fetch-event-source"
import { showToast } from 'vant'

// 余额查询
export function getBalance() {
  const { baseUrl, key } = JSON.parse(localStorage.setting)

  const xhr = new XMLHttpRequest()

  xhr.open('GET', `${baseUrl}/dashboard/billing/credit_grants`, true)

  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Authorization', `Bearer ${key}`)

  xhr.send()

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        return resolve(JSON.parse(xhr.responseText))
      }
    }
  })
}

export async function send(messages, handleMessage) {
  const { baseUrl, key, model, temperature, maxToken } = JSON.parse(localStorage.setting)
  const controller = new AbortController()
  // 请求方式
  const method = 'POST'
  // 请求头
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
    'x-api2d-no-cache': 1
  }
  // 请求体
  const body = JSON.stringify({ model, messages, stream: true, temperature, max_tokens: maxToken })

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
      handleMessage(null, err, true, controller)
    }
  })
}

const config = {
  db_name: 'easegpt',
  store_name: 'history',
  db_version: 1,
  createStoreObj: null
}

// 初始化数据库
async function initDb() {
  if (config.createStoreObj != null) return
  // const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open(config.db_name, config.db_version)

    req.onerror = function () {
      showToast('你的浏览器不支持 indexedDB\n\n因此无法读取和储存聊天消息!')
      reject(null)
    }
    req.onsuccess = function (event) {
      resolve(event.target.result)
    }
    req.onupgradeneeded = function (event) {
      const database = event.target.result
      database.createObjectStore(config.store_name, { keyPath: "id" })
    }
  })
  config.createStoreObj = () => db.transaction([config.store_name], 'readwrite').objectStore(config.store_name)
}

// 初始化
await initDb()

// 根据会话的id更新会话记录
export async function httpUpdateSession(data) {
  // 获取数据库实例
  const store = config.createStoreObj()
  // 添加数据
  store.put(data)
  // 返回结果
  return await new Promise((resolve, reject) => {
    store.onsuccess = () => resolve(true)
    store.onerror = () => reject(false)
  })
}

// 删除一条会话
export async function httpDeleteSession(dataId) {
  // 获取数据库实例
  const store = config.createStoreObj()
  // 删除数据
  const res = store.delete(dataId)
  // 返回结果
  return await new Promise((resolve, reject) => {
    res.onsuccess = (e) => resolve(true)
    res.onerror = (err) => reject(false)
  })
}

// 创建一条会话
export async function httpCreateSession(data) {
  // 获取数据库实例
  const store = config.createStoreObj()
  // 删除数据
  const res = store.add(data)
  // 返回结果
  return await new Promise((resolve, reject) => {
    res.onsuccess = () => resolve(true)
    res.onerror = () => reject(false)
  })
}

// 获取历史记录列表
export async function httpHistorys() {
  // 获取数据库实例
  const store = config.createStoreObj()
  // 获取并返回数据
  return await new Promise((resolve, reject) => {
    const data = []
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result
      // 获取数据
      if (cursor) {
        data.push(cursor.value)
        cursor.continue()
      }
      // 返回数据
      else resolve(data)
    }
    store.onerror = () => reject([])
  })
}
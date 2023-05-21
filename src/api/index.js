import { createParser } from 'eventsource-parser'

export async function send(message) {
  const decoder = new TextDecoder('utf-8')

  const postData = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    stream: true
  }
  const baseUrl = ' https://openai.api2d.net'
  const path = '/v1/chat/completions'
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk189338-wmSuSBdJtOHylBQOrBqyYUKMaqdWdZm6'
  }

  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    headers, method: 'POST', body: JSON.stringify(postData)
  })

  if (res.status !== 200) {
    throw new Error('请求出错!')
  }

  const reader = res.body.getReader()
  let chunks = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    console.log(decoder.decode(value))
  }
  const buffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.length
  }

  const data = decoder.decode(buffer)
}

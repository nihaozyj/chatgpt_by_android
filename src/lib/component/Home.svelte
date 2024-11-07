<script module>
  /** 角色类型 */
  export const roleType = {
    /** 系统消息 */
    system: 'system',
    /** 用户自身 */
    user: 'user',
    /** 助手 */
    assistant: 'assistant',
  }
</script>

<script lang="ts">
  import { beforeUpdate, onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import db from '../script/db';
  import { marked } from 'marked';
  import Conversation from '../script/conversation';
  import { addLongPressListener, convertToBase64, createConversation, openAlertDialog } from '../script/util';
  import { getConfig } from './Setting.svelte';
  import { createStreamChatApi } from '../script/api';
  import 'highlight.js/styles/atom-one-dark.min.css';
  import hljs from 'highlight.js';

  // 声明返回选择图片的接口
  interface SelectedImage {
    file: File | null;
    url: string | null;
    base64: string | null;
  }

  // 存储获取到的图片
  let images: SelectedImage[] = [];

  let conversationId: string;
  let nowConversation: Conversation;
  let message = '';
  let chatApi: { chat: (baseUrl: string, apiKey: string, body: object, callback: (content: string | null, error: string | null) => void) => Promise<void>; cancel: () => void };
  let isSending = false;
  let contentDom: HTMLElement;
  let inputContainer: HTMLElement;
  let openVoiceInputPromptBox = false;
  let textBox: HTMLTextAreaElement;

  /** 语音识别输入 */
  let recognition: any; // 声明全局 recognition 变量
  let recognitionText: string = '';

  $: if (openVoiceInputPromptBox === false && recognitionText !== '') {
    message += recognitionText;
    recognitionText = '';
    setTimeout(() => {
      updateInputHeight({ target: textBox } as unknown as Event);
    });
  }

  // 当组件挂载完成时执行的函数
  onMount(async () => {
    setTimeout(() => {
      toBottom();
      hljs.highlightAll();
    }, 300);

    initData();

    addLongPressListener(inputContainer, 'textarea', (target) => {
        openVoiceInputPromptBox = true;
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
                handleVoiceInput(); // 在获得权限后调用
                recognitionText = ''; // 清空识别结果
                // 处理 touchend 事件
                const handleTouchEnd = (event: TouchEvent) => {
                    event.preventDefault(); // 阻止默认事件
                    openVoiceInputPromptBox = false;
                    stopVoiceInput(); // 停止识别
                    inputContainer.removeEventListener('touchend', handleTouchEnd); // 移除事件监听
                };
                inputContainer.addEventListener('touchend', handleTouchEnd);
            })
            .catch((err) => {
                console.error(err);
                openAlertDialog('提示', '获取麦克风权限失败，请在设置中允许使用麦克风');
                openVoiceInputPromptBox = false;
            });
    });
  });

  /**
   * 语音识别输入
   */
  function handleVoiceInput(): void {
    if ('webkitSpeechRecognition' in window) {
      if (recognition && recognition.abort()) {
        // 停止当前识别
        recognition.abort();
      }
      recognition = new (window as any).webkitSpeechRecognition();
      // 设置识别语言为中文
      recognition.lang = 'zh-CN';
      // 当识别到结果时的回调函数
      recognition.onresult = function (event: any) {
        const transcript = event.results[0][0].transcript;
        openVoiceInputPromptBox && handleVoiceInput();
        recognitionText += transcript;
      };
      recognition.onerror = function (event: any) {
        openVoiceInputPromptBox = false;
      };
      recognition.start();
    } else {
      openAlertDialog('提示', '你的浏览器不支持语音识别');
      openVoiceInputPromptBox = false;
    }
  }

  /** 停止语音识别 */
  function stopVoiceInput(): void {
    if (recognition) {
      recognition.stop(); // 停止识别
      recognition = null; // 清除识别实例
    }
  }

  let toBottomTimer: any;

  function toBottom() {
    if (toBottomTimer) return;
    toBottomTimer = setTimeout(() => {
      contentDom.scrollTop = contentDom.scrollHeight;
      toBottomTimer = null;
    }, 100);
  }

  async function initData() {
    try {
      conversationId = localStorage.conversationId;
      const init = () => {
        const conversation = createConversation();
        conversationId = conversation.id;
        localStorage.conversationId = conversationId;
        nowConversation = conversation;
      };

      if (!conversationId) {
        init();
      } else {
        nowConversation = await db.getConversationById(conversationId);
        if (!nowConversation) init();
      }
    } catch (error) {
      setTimeout(() => initData());
    }
  }

  function escapeHtml(html: string) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
  }

  function mdToHtml(md: string, role: string, item: any) {
    if (role === roleType.user) {
      let imgStr = '';
      if (item.images) {
        imgStr = item.images.map((img) => `<img src="${img.image_url.url}" alt="${img.name}">`);
        console.log(item.images);
      }
      return imgStr + escapeHtml(md.trim());
    } else {
      return marked(md.trim());
    }
  }

  function stop() {
    chatApi.cancel();
    isSending = false;
  }

  function send() {
    message = message.trim();
    const config = getConfig();
    const messages = [];
    const history = [];

    if (message === '') return;

    isSending = true;

    const prompt = { role: roleType.system, content: config.prompt, time: Date.now() - 20 };

    let nowMsg: any[];

    if (images.length > 0) {
      nowMsg = [
        { role: roleType.user, content: [{ type: 'text', text: message }], time: Date.now() },
        { role: roleType.assistant, content: '', time: Date.now() + 1 },
      ];

      images.forEach((img) => {
        nowMsg[0].content.push({ type: 'image_url', image_url: { url: img.base64 } });
      });

      images = [];
    } else {
      nowMsg = [
        { role: roleType.user, content: message, time: Date.now() },
        { role: roleType.assistant, content: '', time: Date.now() + 1 },
      ];
    }

    const index = Math.max(0, nowConversation.content.length - config.historyCount);
    history.push(...nowConversation.content.slice(index));

    if (nowConversation.content.length === 0) {
      nowConversation.title = message;
    }

    messages.push(prompt, ...history, nowMsg[0]);

    const body = { model: config.model, stream: true, top_p: config.top_p, messages };

    chatApi = createStreamChatApi();

    chatApi.chat(`${config.baseUrl}/chat/completions`, config.apiKey, body, handerReceiveMessage);

    if (typeof nowMsg[0].content != 'string') {
      const imgs = nowMsg[0].content.slice(1);
      nowMsg[0].content = message;
      (nowMsg[0] as any).images = imgs;
      nowConversation.content.push(...nowMsg);
    } else {
      nowConversation.content.push(...nowMsg);
    }

    console.log(nowConversation.content);

    nowConversation = nowConversation;

    message = '';
  }

  function handerReceiveMessage(content: string, err: string) {
    const msg = nowConversation.content[nowConversation.content.length - 1];

    // 请求出错
    if (err) {
      if (msg.content === '') {
        msg.content = '<span style="color:red;">' + err + '</span>';
      } else {
        msg.content = '<br/><span style="color:red;">' + err + '</span>';
      }
      chatApi.cancel();
      isSending = false;
      nowConversation.lastModifiedTime = Date.now();
      db.upsertConversation(nowConversation);
    }
    // 对话结束
    else if (content === null && err === null) {
      isSending = false;
      nowConversation.lastModifiedTime = Date.now();
      db.upsertConversation(nowConversation);
      setTimeout(() => hljs.highlightAll());
    } else {
      msg.content += content;
    }

    nowConversation = nowConversation;
    toBottom();
  }

  /** 截取字符串 */
  function cutString(str: string, len: number = 6) {
    if (str.length > len) {
      return str.slice(0, len) + '...';
    } else {
      return str;
    }
  }

  function handerCreate() {
    localStorage.conversationId = createConversation().id;
    initData();
  }

  /** 打开图片选择对话框，返回用户选择的图片 */
  function openImagePicker(): Promise<SelectedImage[]> {
    return new Promise((resolve) => {
      // 创建文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true; // 允许多选
      input.onchange = () => {
        const files = Array.from(input.files || []);
        const selectedImages: SelectedImage[] = files.map((file) => ({
          file,
          url: URL.createObjectURL(file),
          base64: null,
        }));
        resolve(selectedImages);
      };
      input.click();
    });
  }

  /** 添加新选择的图片到图像数组 */
  async function addImages(newImages: SelectedImage[]) {
    // 将新选择的图片添加到现有的图像数组中并去重
    images = [...images, ...newImages.filter((newImage) => !images.some((existingImage) => existingImage.file?.name === newImage.file?.name))];
    for (const img of images) {
      if (!img.base64) img.base64 = await convertToBase64(img.file!);
    }
  }

  async function handleImageUpload() {
    const imgs = await openImagePicker();
    addImages(imgs);
    console.log(images);
  }

  // 获取根元素的字体大小
  function getRootFontSize() {
    // 获取 <html> 元素
    const rootElement = document.documentElement; // 或者使用 document.body
    // 获取根元素的计算样式
    const fontSize = window.getComputedStyle(rootElement).fontSize;
    // 将字体大小从字符串转换为数字（移除单位）
    return parseFloat(fontSize); // 返回的单位为像素（px）
  }

  const maxLines = 5;
  const lineHeight = 1.5;
  const remSize = getRootFontSize();
  let inputHeight = `5.1em`;

  /** 更新文本框的高度 */
  function updateInputHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    // 设置 textarea 的高度为 auto，以便正确计算内容高度
    textarea.style.height = '5.1rem'; // 重置为 auto 以重新计算高度
    const newHeight = Math.min(textarea.scrollHeight, maxLines * lineHeight * remSize);
    textarea.style.height = `${newHeight - remSize * 0.8}px`; // 更新 textarea 的高度
    inputHeight = `${newHeight}px`; // 更新 inputHeight
  }
</script>

<main>
  <header>
    <button on:click={() => push('/history')} class="iconfont">&#xe61d;</button>
    <h1>{cutString(nowConversation?.title || '未命名对话')}</h1>
    <div class="right">
      <button on:click={() => handerCreate()} class="iconfont">&#xe65b;</button>
      <button on:click={() => push('/setting')} class="iconfont" style="margin-left: 10px;">&#xe626;</button>
    </div>
  </header>
  <div class="message-box">
    <div class="content" bind:this={contentDom}>
      {#if nowConversation && nowConversation.content.length > 0}
        {#each nowConversation.content as item, index}
          <div class="item" class:user={item.role === 'user'}>
            <div class="body">
              {@html mdToHtml(item.content, item.role, item)}{#if index === nowConversation.content.length - 1 && isSending && message.trim() === ''}<span class="loading-cursor">|</span>{/if}
            </div>
          </div>
        {/each}
      {:else}
        <div class="item">
          <div class="body">请告诉我你的问题吧 ~</div>
        </div>
      {/if}
    </div>
    <div class="input-box" bind:this={inputContainer}>
      <div>
        <button class="iconfont" on:click={handleImageUpload}>&#xe60a;</button>
        <div class="input">
          <div class="input-border" style="height: {inputHeight};">
            <textarea bind:this={textBox} on:input={updateInputHeight} placeholder="在此处输入消息，长按进行语音输入 .." bind:value={message}></textarea>
            {#if openVoiceInputPromptBox}
              <div class="prompt-box fadeIn">
                <span class="iconfont">&#xe68f; 松开结束输入</span>
                <span class="prompt-text">{recognitionText}</span>
              </div>
            {/if}
            {#if images.length > 0}
              <div class="imgs-view">
                {#each images as img}
                  <img src={img.url} alt={img.file.name} />
                {/each}
                <button class="iconfont" on:click={() => (images = [])}>&#xe600;</button>
              </div>
            {/if}
          </div>
        </div>
        <button on:click={() => (isSending ? stop() : send())} class="iconfont">{@html isSending ? '&#xe87a;' : '&#xe63b;'}</button>
      </div>
    </div>
  </div>
</main>

<style>
  .loading-cursor {
    animation: blink 1s step-start infinite;
  }

  /* 定义闪烁动画 */
  @keyframes blink {
    0%,
    100% {
      opacity: 1; /* 完全可见 */
    }
    50% {
      opacity: 0; /* 半透明 */
    }
  }

  main {
    height: 100vh;
    background-color: var(--color-bg);
    display: flex;
    flex-direction: column;
  }

  header {
    background-color: var(--color-bg-strong);
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 10px 0 10px;
  }

  header button {
    padding: 0.5rem;
    border-color: var(--color-border);
    background-color: var(--color-bg);
    border-width: 2px;
  }

  .message-box {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
  }

  .content {
    flex: 1;
    margin: 1rem 0.2rem;
    padding: 0 0.8rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .item {
    display: flex;
    margin-bottom: 1rem;
    max-width: 100%;
  }

  .item:last-child {
    margin-bottom: 10rem;
  }

  .item .body {
    display: inline-block;
    padding: 0.5rem;
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow-x: hidden;
  }

  .item.user .body {
    margin-left: auto;
    background-color: var(--color-bubble-bg);
    white-space: pre-wrap;
  }

  .content::before,
  .content::after {
    content: '';
    height: 20px;
    background: transparent;
  }

  .input-box {
    display: flex;
    width: 100%;
    height: 4.5rem;
    border-radius: 1rem 1rem 0 0;
    background-color: var(--color-bg-strong);
  }

  .input-box > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: end;
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .input-box .input {
    flex: 1;
    margin: 0 0.5rem;
    height: 4rem;
    position: relative;
  }

  .input-border {
    position: absolute;
    bottom: -0.5rem;
    padding: 0.5rem;
    width: 100%;
    border-radius: var(--radius);
    background-color: var(--color-bg-strong);
  }

  textarea {
    width: 100%;
    height: 100%;
    line-height: 1.5rem;
    user-select: none;
    border: 1px solid var(--color-border);
    padding: 0.5rem;
    border-radius: var(--radius);
  }

  .prompt-box {
    height: 100%;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    box-sizing: border-box;
    background-color: var(--color-bg-strong);
    border: 1px solid var(--color-border);
    text-align: center;
    border-radius: 0.2rem;
    user-select: none;
  }

  .imgs-view {
    position: absolute;
    height: 60px;
    width: 100%;
    top: -70px;
    left: 0;
    overflow-x: auto;
    padding: 5px;
    display: flex;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background-color: var(--color-bg-strong);
  }

  .imgs-view button {
    position: fixed;
    bottom: 6.7rem;
    right: 0.5rem;
  }

  .imgs-view img {
    height: 100%;
    margin-right: 5px;
    display: block;
    border-radius: 5px;
  }

  .imgs-view img:last-child {
    margin-right: 0;
  }

  .prompt-text {
    position: absolute;
    top: -120px;
    background-color: var(--color-bg-strong);
    width: 100%;
    left: 0;
    height: 100px;
    text-align: left;
    border: 1px solid var(--color-border);
    padding: 0.5rem;
    overflow-y: auto;
    border-radius: var(--radius);
  }
</style>

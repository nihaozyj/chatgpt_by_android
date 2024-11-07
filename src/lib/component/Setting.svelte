<script context="module">
  /** 对话模型列表*/
  export const models = [
    {
      label: 'openai',
      value: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini'],
    },
    {
      label: '质谱AI',
      value: ['GLM-4-Plus', 'GLM-4-Long', 'GLM-4-Air', 'GLM-4-FlashX', 'GLM-4-Flash', 'GLM-4V-Plus', 'ChatGLM-3'],
    },
    {
      label: '通义千问',
      value: ['qwen-max', 'qwen-plus', 'qwen-turbo', 'qwen-long'],
    },
  ];

  /** 获取应用配置信息 */
  export const getConfig = () => {
    return {
      theme: localStorage.theme || 'dark',
      fontSize: localStorage.fontSize || '16px',
      prompt: localStorage.prompt || '您是一个经过指令调优的自回归语言模型，致力于提供准确、基于事实的深思熟虑答案。您的用户是AI和伦理学领域的专家，对语言模型的能力和局限性有深入了解，且熟悉伦理问题。您的回答应尽量简短、使用较少的字数，除非用户明确要求详细回答，否则只需要回答问题的重点即可。回复时使用合理markdown，对不同知识点进行分类，提供良好的越度体验。',
      baseUrl: localStorage.baseUrl || 'https://api.openai-up.com/v1',
      apiKey: localStorage.apiKey || '',
      model: localStorage.model || models[0].value[0],
      historyCount: Number(localStorage.historyCount || 4),
      top_p: Number(localStorage.top_p || 0.7),
    };
  };
</script>

<script lang="ts">
  import { push } from 'svelte-spa-router';

  let config = getConfig();

  /** 主题 */
  let theme = config.theme;
  $: if (theme) {
    localStorage.theme = theme;
    document.body.className = theme;
  }

  /** 字体大小*/
  let fontSize = config.fontSize;
  $: if (fontSize) {
    localStorage.fontSize = fontSize;
    document.documentElement.style.fontSize = fontSize;
  }

  /** 提示词 */
  let prompt = config.prompt;
  $: if (prompt) {
    localStorage.prompt = prompt;
  }

  /** 代理地址 */
  let baseUrl = config.baseUrl;
  $: if (baseUrl) {
    localStorage.baseUrl = baseUrl;
  }

  /** 请求密钥 */
  let apiKey = config.apiKey;
  $: if (apiKey) {
    localStorage.apiKey = apiKey;
  }

  /** 对话模型 */
  let model = config.model;
  $: if (model) {
    localStorage.model = model;
  }

  /** 历史记录数量 */
  let historyCount = config.historyCount;
  $: if (historyCount > 0) {
    localStorage.historyCount = historyCount;
  } else {
    localStorage.historyCount = 0;
  }

  /** 采样值 */
  let topP = config.top_p;
  $: if (topP) {
    localStorage.top_p = topP;
  }

  function returnToThePreviousPage() {
    const cg = getConfig();
    let prompt, baseUrl, apiKey;
    if (cg.prompt !== config.prompt) {
      prompt = cg.prompt;
    }
    if (cg.baseUrl !== config.baseUrl) {
      baseUrl = cg.baseUrl;
    }
    if (cg.apiKey !== config.apiKey) {
      apiKey = cg.apiKey;
    }

    if (prompt || baseUrl || apiKey) {
      const lt = (localStorage.list && JSON.parse(localStorage.list)) || [];
      lt.unshift({ prompt, baseUrl, apiKey });
      localStorage.list = JSON.stringify(lt);
    }
    push('/');
  }
</script>

<main>
  <header>
    <button class="iconfont" on:click={returnToThePreviousPage}>&#xe601;</button>
    <h1>设置</h1>
    <button class="iconfont" style="line-height: .8rem; font-size: .8rem;" on:click={() => push('/historicalChanges')}>历史更改</button>
  </header>
  <div class="setting-container">
    <!-- 主题设置 -->
    <div class="item">
      <label for="theme">主题：</label>
      <select id="theme" bind:value={theme}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
    <!-- 字体大小设置 -->
    <div class="item">
      <label for="fontSize">字体大小：</label>
      <select id="fontSize" bind:value={fontSize}>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="22px">22px</option>
        <option value="24px">24px</option>
      </select>
    </div>

    <!-- 提示词 -->
    <div class="item">
      <label for="prompt">提示词：</label>
      <textarea id="prompt" bind:value={prompt}></textarea>
    </div>

    <!-- 代理地址 -->
    <div class="item">
      <label for="baseUrl">代理地址：</label>
      <input type="text" id="baseUrl" bind:value={baseUrl} />
    </div>

    <!-- 请求密钥 -->
    <div class="item">
      <label for="apiKey">密钥：</label>
      <input type="text" id="apiKey" bind:value={apiKey} />
    </div>

    <!-- 对话模型 -->
    <div class="item">
      <label for="model">对话模型：</label>
      <select id="model" bind:value={model}>
        {#each models as model}
          <optgroup label={model.label}>
            {#each model.value as value}
              <option {value}>{value}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
    </div>

    <!-- 历史记录数量 -->
    <div class="item">
      <label for="historyCount">历史记录数：</label>
      <input type="number" id="historyCount" bind:value={historyCount} />
    </div>

    <!-- 采样值 -->
    <div class="item">
      <label for="topP">采样值(top_p)：</label>
      <input type="number" id="topP" bind:value={topP} />
    </div>
  </div>
</main>

<style>
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

  .setting-container {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
    overflow-y: auto;
  }

  .item {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid var(--color-border);
    align-items: center;
  }

  .item:last-child {
    border-bottom: none;
  }

  label {
    width: 6rem;
  }

  input,
  select,
  optgroup,
  textarea {
    flex: 1;
    width: 0;
    border: 1px solid var(--color-border);
    background-color: var(--color-bg);
    margin-left: 20px;
    padding: 0.5rem;
    border-radius: var(--radius);
  }

  select {
    max-height: 300px;
    overflow-y: auto;
  }

  optgroup {
    color: var(--color-text-hint);
    font-size: 0.8rem;
  }

  option {
    background-color: var(--color-bg);
  }

  textarea {
    height: 10rem;
  }
</style>

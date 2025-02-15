<script lang="ts">
  import { onMount } from 'svelte';

  import { pop } from 'svelte-spa-router';
  import { getConfig } from './Setting.svelte';

  let list;
  let config = getConfig();

  onMount(() => {
    list = (localStorage.list && JSON.parse(localStorage.list)) || [];
    list.unshift({
      prompt: '您是一个经过指令调优的自回归语言模型，致力于提供准确、基于事实的深思熟虑答案。您的用户是AI和伦理学领域的专家，对语言模型的能力和局限性有深入了解，且熟悉伦理问题。您的回答应尽量简短。请使用合理markdown',
      baseUrl: '',
      apiKey: '',
    });
  });

  function handerActive(item) {
    if (item.baseUrl) {
      localStorage.baseUrl = item.baseUrl;

      if (item.apiKey) {
        localStorage.apiKey = item.apiKey;
      }
    }

    if (item.prompt) {
      localStorage.prompt = item.prompt;
    }

    pop();
  }
</script>

<main>
  <header>
    <button class="iconfont" on:click={() => pop()}>&#xe601;</button>
    <h1>设置</h1>
    <div style="width: 2rem;"></div>
  </header>
  <div class="setting-container">
    {#each list as item}
      {#if (item.baseUrl && item.baseUrl !== config.baseUrl) || (item.apiKey && item.apiKey !== config.apiKey) || (item.prompt && item.prompt !== config.prompt)}
        <div class="item">
          {#if item.baseUrl && item.baseUrl !== config.baseUrl}
            <p>{item.baseUrl}</p>
          {/if}
          {#if item.apiKey && item.apiKey !== config.apiKey}
            <p>{item.apiKey}</p>
          {/if}
          {#if item.prompt && item.prompt !== config.prompt}
            <p>{item.prompt}</p>
          {/if}
          <button on:click={() => handerActive(item)}>应用到当前配置</button>
        </div>
      {/if}
    {/each}
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
    padding-bottom: 3rem;
  }

  .item {
    padding: 1rem 1rem;
    border-bottom: 1px solid var(--color-border);
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
  }

  .item p {
    width: 100%;
    display: inline-block;
    overflow-wrap: break-word;
    margin-bottom: 0.5rem;
  }

  .item p:nth-child(3) {
    margin-bottom: 0;
  }

  .item button {
    position: absolute;
    right: 0;
    bottom: -1rem;
    font-size: 0.8rem;
    background-color: var(--color-bg-strong);
  }
</style>

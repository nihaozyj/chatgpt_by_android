<script context="module">
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import Conversation from '../script/conversation';
  import db from '../script/db';
  import { createConversation } from '../script/util';

  let cs: Conversation[] = [];

  onMount(async () => {
    cs = await db.getAllConversations();
  });

  function activeConversation(id: string) {
    localStorage.conversationId = id;
    push('/');
  }

  function handerCreate() {
    localStorage.conversationId = createConversation().id;
    push('/');
  }

  function handerClear() {
    if (!cs) return;

    try {
      cs.forEach((item) => db.deleteConversation(item.id));
    } catch (error) {
      console.log(error);
    }

    cs = [];
  }
</script>

<main>
  <header>
    <h1>角色列表</h1>
    <div>
      <button class="iconfont" on:click={() => handerClear()}>&#xe600; 清除所有</button>
      <button class="iconfont" on:click={() => handerCreate()}>&#xe65b; 创建对话</button>
    </div>
  </header>
  <div class="container">
    {#each cs as item}
      <button class="item" on:click={() => activeConversation(item.id)}>
        <h2>{item.title}</h2>
        <div>
          <span>{Conversation.contentSize(item)}条对话</span>
          <span>{Conversation.LastTime(item)}</span>
        </div>
      </button>
    {/each}

    {#if cs.length === 0}
      <div class="empty">
        <p>暂无对话记录，点击创建对话开始聊天吧！</p>
      </div>
    {/if}
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
    font-size: 0.7em;
  }

  .container {
    flex: 1;
    height: 0;
    overflow-y: auto;
  }

  .item {
    display: flex;
    justify-content: space-between;
    padding: 0.7rem 1rem;
    width: 100%;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--color-border);
    align-items: left;
    flex-direction: column;
  }

  .item > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .item > h2 {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .item > div span {
    font-size: 0.8rem;
    color: var(--color-text-hint);
  }

  .empty {
    width: 100%;
    text-align: center;
    margin-top: 30vh;
  }
</style>

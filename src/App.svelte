<script>
  // @ts-nocheck

  import Router from 'svelte-spa-router';
  import Home from './lib/component/Home.svelte';
  import Setting from './lib/component/Setting.svelte';
  import History from './lib/component/History.svelte';
  import autoAnimate from '@formkit/auto-animate';
  import HistoricalChanges from './lib/component/HistoricalChanges.svelte';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  // 定义路由映射
  const routes = {
    '/': Home,
    '/setting': Setting,
    '/history': History,
    '/historicalChanges': HistoricalChanges,
  };

  let mainDom;

  onMount(() => {
    autoAnimate(mainDom, {
      // Animation duration in milliseconds (default: 250)
      duration: 250,
      // Easing for motion (default: 'ease-in-out')
      easing: 'Ease-In',
      // When true, this will enable animations even if the user has indicated
      // they don’t want them via prefers-reduced-motion.
      disrespectUserMotionPreference: false,
    });
  });
</script>

<!-- 使用 Router 组件并添加 transition 属性 -->
<main bind:this={mainDom}>
  <Router {routes} />
</main>

import { mount } from 'svelte';
import './reset.css';
import './app.css';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app'),
});

// 初始化主题
setTimeout(() => {
  document.body.className = 'dark';
});

export default app;

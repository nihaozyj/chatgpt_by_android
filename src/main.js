import { createApp } from 'vue'
import App from './App.vue'
import registerComponents from './vant'
import router from '@/router'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import hljs from 'highlight.js'

import './assets/style/reset.css'
import './assets/style/border.css'
import 'vant/lib/index.css'
import './assets/style/global.scss'
import '@kangc/v-md-editor/lib/style/preview.css'

const app = createApp(App)

VMdPreview.use(githubTheme, { Hljs: hljs, })

app.use(VMdPreview)

app.use(router)

registerComponents(app)

app.mount('#app')

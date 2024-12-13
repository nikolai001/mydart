import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './index.css'
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App)
    .use(mdiVue, { icons: mdijs })
    .use(router)
    .use(pinia)
    .mount('#app')

import { createApp } from 'vue'
import VueTranslate from '@Voikyrioh/vue-translate'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VueTranslate, {
  availableLanguage: ['en-US', 'fr-FR'],
  translationFilesUrl: '/i18n',
  defaultLang: 'en-US'
})
app.mount('#app')

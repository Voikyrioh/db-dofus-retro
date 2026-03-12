import { createApp } from 'vue'
import VueTranslate from '@Voikyrioh/vue-translate'
import './style.css'
import App from './App.vue'

type Lang = `${string}-${string}`

const supportedLangs: Lang[] = ['en-US', 'fr-FR']
const browserLang = navigator.language
const browserLangPrefix = browserLang.split('-')[0] ?? browserLang
const defaultLang: Lang =
  supportedLangs.find(l => l === browserLang) ??
  supportedLangs.find(l => l.startsWith(browserLangPrefix)) ??
  'en-US'

const app = createApp(App)
app.use(VueTranslate, {
  availableLanguage: supportedLangs,
  translationFilesUrl: '/i18n',
  defaultLang
})
app.mount('#app')

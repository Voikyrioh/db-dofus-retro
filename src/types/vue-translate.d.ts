import type { Plugin, Ref } from 'vue'

type Lang = `${string}-${string}`

export interface I18nService {
  readonly languageRef: Ref<Lang | undefined>
  readonly availableLanguages: string[]
  activeLanguage: Lang
  getKey(key: string): Promise<string>
}

interface I18nOptions {
  availableLanguage: Lang[]
  translationFilesUrl: string
  defaultLang: Lang
}

declare const VueTranslate: Plugin<I18nOptions>
export default VueTranslate

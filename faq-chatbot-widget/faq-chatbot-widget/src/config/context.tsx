import { createContext } from 'preact/compat'
import { useContext } from 'preact/hooks'
import type { FAQCategory, FAQWithVideo, FAQVideo, ChatbotConfig } from '../components/types'
import {
  DEFAULT_CATEGORIES,
  DEFAULT_FAQS,
  DEFAULT_VIDEOS,
  DEFAULT_CONFIG,
} from './defaults'

export interface WidgetConfig {
  videoBasePath: string
  triggerVideoUrl?: string
  categories: FAQCategory[]
  faqs: FAQWithVideo[]
  videos: FAQVideo[]
  config: ChatbotConfig
}

const defaultWidgetConfig: WidgetConfig = {
  videoBasePath: '/videos/chatbot/',
  categories: DEFAULT_CATEGORIES,
  faqs: DEFAULT_FAQS,
  videos: DEFAULT_VIDEOS,
  config: DEFAULT_CONFIG,
}

const ChatbotConfigContext = createContext<WidgetConfig>(defaultWidgetConfig)

export const useChatbotConfig = () => useContext(ChatbotConfigContext)
export const ChatbotConfigProvider = ChatbotConfigContext.Provider
export { defaultWidgetConfig }

import { ChatbotConfigProvider, type WidgetConfig, defaultWidgetConfig } from './config/context'
import {
  DEFAULT_CATEGORIES,
  DEFAULT_FAQS,
  DEFAULT_VIDEOS,
  DEFAULT_CONFIG,
} from './config/defaults'
import FAQChatbot from './components/FAQChatbot'

interface FAQChatbotAppProps {
  config: Partial<WidgetConfig>
}

export default function FAQChatbotApp({ config }: FAQChatbotAppProps) {
  const mergedConfig: WidgetConfig = {
    videoBasePath: config.videoBasePath || defaultWidgetConfig.videoBasePath,
    triggerVideoUrl: config.triggerVideoUrl,
    categories: config.categories || DEFAULT_CATEGORIES,
    faqs: config.faqs || DEFAULT_FAQS,
    videos: config.videos || DEFAULT_VIDEOS,
    config: { ...DEFAULT_CONFIG, ...config.config },
  }

  return (
    <ChatbotConfigProvider value={mergedConfig}>
      <FAQChatbot />
    </ChatbotConfigProvider>
  )
}

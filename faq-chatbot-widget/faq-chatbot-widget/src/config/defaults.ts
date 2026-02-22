import type { FAQCategory, FAQWithVideo, FAQVideo, ChatbotConfig } from '../components/types'

export const DEFAULT_CATEGORIES: FAQCategory[] = []

export const DEFAULT_VIDEOS: FAQVideo[] = [
  {
    id: 'greeting',
    videoUrl: 'greeting.mp4',
    duration: 25,
    isPlaceholder: false,
  },
]

export const DEFAULT_FAQS: FAQWithVideo[] = []

export const DEFAULT_CONFIG: ChatbotConfig = {
  greetingVideoId: 'greeting',
  greetingMessage: 'この動画チャットボットも、研修で作れるようになります！',
  farewellMessage: 'ご覧いただきありがとうございました！',
  enableSound: false,
}

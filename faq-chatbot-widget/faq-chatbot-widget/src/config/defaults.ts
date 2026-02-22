import type { FAQCategory, FAQWithVideo, FAQVideo, ChatbotConfig, Subtitle } from '../components/types'

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

export const DEFAULT_SUBTITLES: Subtitle[] = [
  { start: 0, end: 3, text: 'やっぱり押しちゃいますよね' },
  { start: 3, end: 8, text: 'この動画チャットボット' },
  { start: 8, end: 13, text: '実は研修で作れるようになります' },
  { start: 13, end: 18, text: '御社のサイトにも実装できます' },
  { start: 18, end: 25, text: 'まずは無料でご相談ください' },
]

export const DEFAULT_CONFIG: ChatbotConfig = {
  greetingVideoId: 'greeting',
  greetingMessage: 'この動画チャットボット、実は研修で作れるようになります。御社のサイトにも実装してみませんか？',
  farewellMessage: 'ご視聴ありがとうございます！',
  enableSound: false,
  subtitles: DEFAULT_SUBTITLES,
}

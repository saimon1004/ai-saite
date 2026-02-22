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
  { start: 3, end: 8, text: '実はこのチャットボットも\n研修の中で作れるようになります' },
  { start: 8, end: 14, text: 'FAQの自動応答や\nサービスのアピールとしても活用できるので' },
  { start: 14, end: 19, text: '御社のサイトにも\nぜひ取り入れてみてください' },
  { start: 19, end: 25, text: '気になった方は\nお気軽に無料相談へどうぞ！' },
]

export const DEFAULT_CONFIG: ChatbotConfig = {
  greetingVideoId: 'greeting',
  greetingMessage: 'この動画チャットボット、実は研修で作れるようになります。御社のサイトにも実装してみませんか？',
  farewellMessage: 'ご視聴ありがとうございます！',
  enableSound: false,
  subtitles: DEFAULT_SUBTITLES,
}

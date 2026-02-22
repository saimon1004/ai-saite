import type { FAQCategory, FAQWithVideo, FAQVideo, ChatbotConfig, Subtitle } from '../components/types'

export const DEFAULT_CATEGORIES: FAQCategory[] = []

export const DEFAULT_VIDEOS: FAQVideo[] = [
  {
    id: 'greeting',
    videoUrl: 'greeting.mp4',
    duration: 16,
    isPlaceholder: false,
  },
]

export const DEFAULT_FAQS: FAQWithVideo[] = []

export const DEFAULT_SUBTITLES: Subtitle[] = [
  { start: 0, end: 2, text: 'やっぱり押しちゃいますよね' },
  { start: 2, end: 5.5, text: '実はこのチャットボットも\n研修の中で作れるようになります' },
  { start: 5.5, end: 9.5, text: 'FAQの自動応答や\nサービスのアピールとしても活用できるので' },
  { start: 9.5, end: 12.5, text: '御社のサイトにも\nぜひ取り入れてみてください' },
  { start: 12.5, end: 16, text: '気になった方は\nお気軽に無料相談へどうぞ！' },
]

export const DEFAULT_CONFIG: ChatbotConfig = {
  greetingVideoId: 'greeting',
  greetingMessage: 'この動画チャットボット、実は研修で作れるようになります。御社のサイトにも実装してみませんか？',
  farewellMessage: 'ご視聴ありがとうございます！',
  enableSound: false,
  subtitles: DEFAULT_SUBTITLES,
}

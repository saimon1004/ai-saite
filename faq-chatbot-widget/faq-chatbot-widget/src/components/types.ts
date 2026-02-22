// 字幕
export interface Subtitle {
  start: number
  end: number
  text: string
}

// 動画設定
export interface FAQVideo {
  id: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  isPlaceholder: boolean
}

// 動画付きFAQ
export interface FAQWithVideo {
  id: string
  category: string
  question: string
  answer: string
  videoId?: string
  order: number
}

// チャットボット設定
export interface ChatbotConfig {
  greetingVideoId: string
  greetingMessage: string
  farewellMessage: string
  enableSound: boolean
  subtitles?: Subtitle[]
}

// FAQカテゴリ
export interface FAQCategory {
  id: string
  name: string
  icon: string
}

// チャットメッセージ
export interface ChatMessageData {
  id: string
  type: 'bot' | 'user-selection'
  content: string
  timestamp: Date
  videoId?: string
}

// チャットボットの状態
export interface ChatbotState {
  isOpen: boolean
  currentView: 'greeting' | 'categories' | 'questions' | 'answer'
  selectedCategory: string | null
  selectedFAQ: FAQWithVideo | null
  chatHistory: ChatMessageData[]
  isVideoPlaying: boolean
  isVideoLoaded: boolean
  hasShownGreeting: boolean
}

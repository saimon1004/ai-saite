import { useRef, useEffect, useState } from 'preact/hooks'
import ChatbotHeader from './ChatbotHeader'
import VideoPlayer from './VideoPlayer'
import CategoryList from './CategoryList'
import QuestionList from './QuestionList'
import type { FAQCategory, FAQWithVideo } from './types'
import { useChatbotConfig } from '../config/context'

interface ChatbotWindowProps {
  isOpen: boolean
  currentView: 'greeting' | 'categories' | 'questions' | 'answer'
  selectedCategory: FAQCategory | null
  selectedFAQ: FAQWithVideo | null
  onClose: () => void
  onGreetingEnd: () => void
  onSelectCategory: (category: FAQCategory) => void
  onSelectQuestion: (faq: FAQWithVideo) => void
  onAnswerEnd: () => void
  onBackToCategories: () => void
}

export default function ChatbotWindow({
  isOpen,
  currentView,
  selectedCategory,
  selectedFAQ,
  onClose,
  onGreetingEnd,
  onSelectCategory,
  onSelectQuestion,
  onAnswerEnd,
  onBackToCategories,
}: ChatbotWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [isVideoEnded, setIsVideoEnded] = useState(false)

  const { faqs, videos, videoBasePath, config: chatbotConfig } = useChatbotConfig()

  const resolveVideoUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url
    }
    return videoBasePath + url
  }

  // 挨拶動画のURL解決
  const greetingVideo = videos.find(v => v.id === chatbotConfig.greetingVideoId)
  const greetingVideoUrl = greetingVideo
    ? resolveVideoUrl(greetingVideo.videoUrl)
    : ''

  // Escapeキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // フォーカストラップ
  useEffect(() => {
    if (isOpen && windowRef.current) {
      const focusableElements = windowRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && currentView === 'greeting') {
      setIsVideoLoading(true)
    }
  }, [isOpen, currentView])

  useEffect(() => {
    if (selectedFAQ) {
      setIsVideoEnded(false)
    }
  }, [selectedFAQ])

  const handleVideoEnded = () => {
    setIsVideoEnded(true)
    onAnswerEnd()
  }

  if (!isOpen) return null

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'greeting':
      default:
        return chatbotConfig.greetingMessage.split('！')[0] || 'FAQ'
      case 'categories':
        return '質問カテゴリ'
      case 'questions':
        return selectedCategory?.name || '質問を選択'
      case 'answer':
        return '回答'
    }
  }

  const showBackButton = currentView === 'questions' || currentView === 'answer'

  const handleBack = () => {
    if (currentView === 'answer') {
      onBackToCategories()
    } else if (currentView === 'questions') {
      onBackToCategories()
    }
  }

  return (
    <div
      ref={windowRef}
      id="faq-chatbot-window"
      role="dialog"
      aria-modal="true"
      aria-label="FAQ チャットボット"
      className={`
        fixed bg-white shadow-2xl overflow-hidden flex flex-col
        transition-all duration-300 ease-out
        chatbot-window-enter

        /* モバイル: フルスクリーン */
        inset-0

        /* デスクトップ: 右下に固定サイズ */
        md:inset-auto md:bottom-24 md:right-6
        md:w-[380px] md:h-[580px] md:max-h-[calc(100vh-120px)]
        md:rounded-2xl

        z-50
      `}
    >
      {currentView !== 'greeting' && (
        <ChatbotHeader
          title={getHeaderTitle()}
          onClose={onClose}
          onBack={handleBack}
          showBackButton={showBackButton}
        />
      )}

      <div className="flex-1 overflow-hidden bg-gray-50 relative">
        {/* 挨拶ビュー */}
        {currentView === 'greeting' && (
          <div className="absolute inset-0 flex flex-col">
            {isVideoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary-500/10 to-ocean/10 z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-ocean flex items-center justify-center shadow-lg mb-4">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-600">読み込み中...</p>
              </div>
            )}

            {/* 閉じるボタン（動画上に配置） */}
            <button
              onClick={onClose}
              aria-label="チャットを閉じる"
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <video
              src={greetingVideoUrl}
              autoPlay
              playsInline
              loop
              onCanPlay={() => setIsVideoLoading(false)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
            />

            <div className="absolute bottom-0 left-0 right-0 p-3 pb-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <a
                href="#contact"
                onClick={(e) => { onClose(); }}
                className="block w-full py-3 px-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-bold text-center transition-all shadow-lg"
              >
                無料で相談する →
              </a>
            </div>
          </div>
        )}

        {/* カテゴリ選択ビュー */}
        {currentView === 'categories' && (
          <CategoryList onSelectCategory={onSelectCategory} />
        )}

        {/* 質問選択ビュー */}
        {currentView === 'questions' && selectedCategory && (
          <QuestionList
            category={selectedCategory}
            onSelectQuestion={onSelectQuestion}
            onBack={onBackToCategories}
          />
        )}

        {/* 回答ビュー */}
        {currentView === 'answer' && selectedFAQ && (
          <div className="absolute inset-0 flex flex-col">
            <div className={`absolute inset-0 transition-all duration-500 ${isVideoEnded ? 'video-blur' : ''}`}>
              {selectedFAQ.videoId && (
                <VideoPlayer
                  videoId={selectedFAQ.videoId}
                  onEnded={handleVideoEnded}
                  autoPlay
                />
              )}
            </div>

            <div className={`
              absolute left-0 right-0 p-3 pb-4 overflow-hidden
              ${isVideoEnded
                ? 'top-0 bottom-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 pt-4 flex flex-col overlay-slide-up'
                : 'bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-500'
              }
            `}>
              {isVideoEnded ? (
                <>
                  <p className="text-white text-sm font-bold mb-1 text-center">
                    他の質問も見てみませんか？
                  </p>
                  <p className="text-white/70 text-xs mb-3 text-center">
                    {selectedFAQ.question}
                  </p>
                  <div className="space-y-1.5 mb-3">
                    {faqs.filter(f => f.id !== selectedFAQ.id).map(faq => (
                      <button
                        key={faq.id}
                        onClick={() => onSelectQuestion(faq)}
                        className="w-full py-2.5 px-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-medium transition-colors text-left shadow-lg video-ended-button"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={onBackToCategories}
                      className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      カテゴリに戻る
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      閉じる
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-white text-xs mb-2 opacity-90">{selectedFAQ.question}</p>
                  <p className="text-white text-xs mb-1.5 opacity-70">他の質問</p>
                  <div className="space-y-1.5 mb-3">
                    {faqs.filter(f => f.id !== selectedFAQ.id).map(faq => (
                      <button
                        key={faq.id}
                        onClick={() => onSelectQuestion(faq)}
                        className="w-full py-2 px-3 bg-white/95 hover:bg-white text-gray-800 rounded-lg text-xs font-medium transition-colors text-left shadow-sm"
                      >
                        {faq.question}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onBackToCategories}
                      className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      カテゴリに戻る
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      閉じる
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

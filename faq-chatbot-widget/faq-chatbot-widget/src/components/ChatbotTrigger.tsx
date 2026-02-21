import { useChatbotConfig } from '../config/context'

interface ChatbotTriggerProps {
  isOpen: boolean
  onClick: () => void
}

export default function ChatbotTrigger({ isOpen, onClick }: ChatbotTriggerProps) {
  const { triggerImageUrl } = useChatbotConfig()
  const hasImage = triggerImageUrl && !isOpen

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-center">
      {/* 吹き出しメッセージ */}
      {!isOpen && (
        <div className="chatbot-speech-bounce mb-2 relative">
          <div className="bg-white rounded-full px-4 py-1.5 shadow-lg text-sm font-bold text-gray-700 whitespace-nowrap">
            AI研修について聞く♪
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
        </div>
      )}
      <button
        onClick={onClick}
        aria-label={isOpen ? 'チャットを閉じる' : 'AI研修についてのご質問はこちら'}
        aria-expanded={isOpen}
        aria-controls="faq-chatbot-window"
        aria-haspopup="dialog"
        className={`
          ${isOpen ? 'w-14 h-14 md:w-16 md:h-16 border-2 border-white/80' : 'w-20 h-20 md:w-24 md:h-24'}
          rounded-full
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-105
          focus:outline-none
          overflow-hidden
          ${hasImage ? 'chatbot-trigger-image-pulse' : 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg hover:shadow-xl'}
          ${!hasImage && !isOpen ? 'chatbot-trigger-ring-pulse' : ''}
        `}
      >
        {isOpen ? (
          <svg
            className="w-7 h-7 md:w-8 md:h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : triggerImageUrl ? (
          <img
            src={triggerImageUrl}
            alt="チャットボット"
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-7 h-7 md:w-8 md:h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}

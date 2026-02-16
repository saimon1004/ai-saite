import { useChatbotConfig } from '../config/context'

interface ChatbotTriggerProps {
  isOpen: boolean
  onClick: () => void
}

export default function ChatbotTrigger({ isOpen, onClick }: ChatbotTriggerProps) {
  const { triggerImageUrl } = useChatbotConfig()
  const hasImage = triggerImageUrl && !isOpen

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'チャットを閉じる' : '採用についてのご質問はこちら'}
      aria-expanded={isOpen}
      aria-controls="faq-chatbot-window"
      aria-haspopup="dialog"
      className={`
        fixed bottom-4 right-4 md:bottom-6 md:right-6
        w-14 h-14 md:w-16 md:h-16
        rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110
        focus:outline-none
        z-50 overflow-hidden
        ${hasImage ? 'chatbot-trigger-image-pulse' : 'bg-gradient-to-br from-primary-500 to-ocean shadow-lg hover:shadow-xl'}
        ${!hasImage && !isOpen ? 'chatbot-trigger-ring-pulse' : ''}
      `}
    >
      {isOpen ? (
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-white"
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
  )
}

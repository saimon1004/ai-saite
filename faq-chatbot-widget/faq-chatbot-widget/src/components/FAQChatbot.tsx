import { useState, useCallback } from 'preact/hooks'
import ChatbotTrigger from './ChatbotTrigger'
import ChatbotWindow from './ChatbotWindow'
import type { FAQCategory, FAQWithVideo } from './types'

type ViewState = 'greeting' | 'categories' | 'questions' | 'answer'

export default function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewState>('greeting')
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQWithVideo | null>(null)
  const [hasShownGreeting, setHasShownGreeting] = useState(false)

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      setCurrentView('greeting')
    }
    setIsOpen(!isOpen)
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleGreetingEnd = useCallback(() => {
    setHasShownGreeting(true)
    setCurrentView('categories')
  }, [])

  const handleSelectCategory = useCallback((category: FAQCategory) => {
    setSelectedCategory(category)
    setCurrentView('questions')
  }, [])

  const handleSelectQuestion = useCallback((faq: FAQWithVideo) => {
    setSelectedFAQ(faq)
    setCurrentView('answer')
  }, [])

  const handleAnswerEnd = useCallback(() => {
  }, [])

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null)
    setSelectedFAQ(null)
    setCurrentView('categories')
  }, [])

  return (
    <>
      <ChatbotTrigger isOpen={isOpen} onClick={handleToggle} />
      <ChatbotWindow
        isOpen={isOpen}
        currentView={currentView}
        selectedCategory={selectedCategory}
        selectedFAQ={selectedFAQ}
        onClose={handleClose}
        onGreetingEnd={handleGreetingEnd}
        onSelectCategory={handleSelectCategory}
        onSelectQuestion={handleSelectQuestion}
        onAnswerEnd={handleAnswerEnd}
        onBackToCategories={handleBackToCategories}
      />
    </>
  )
}

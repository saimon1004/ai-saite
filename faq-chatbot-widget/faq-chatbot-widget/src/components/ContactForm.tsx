import { useState, useCallback } from 'preact/hooks'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface ContactFormProps {
  onClose: () => void
  onBackToGreeting: () => void
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [privacyAgree, setPrivacyAgree] = useState(false)

  const handleSubmit = useCallback(async (e: Event) => {
    e.preventDefault()
    if (!privacyAgree) return

    setStatus('submitting')

    const formData = new FormData()
    formData.append('company_name', company)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)
    formData.append('privacy_agree', 'on')
    formData.append('_subject', 'SAIMONウェブサイトからのお問い合わせ')
    formData.append('_captcha', 'false')
    formData.append('_template', 'table')
    formData.append('_honey', '')

    try {
      const response = await fetch('https://formsubmit.co/info@sai-mon.co.jp', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      setStatus(response.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }, [company, name, email, message, privacyAgree])

  // 送信完了
  if (status === 'success') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">送信完了</h3>
        <p className="text-sm text-gray-600 mb-6">
          お問い合わせありがとうございます。<br />
          担当者より折り返しご連絡いたします。
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
        >
          閉じる
        </button>
      </div>
    )
  }

  // 送信エラー
  if (status === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">送信失敗</h3>
        <p className="text-sm text-gray-600 mb-6">
          送信に失敗しました。<br />
          お手数ですが、もう一度お試しください。
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
        >
          もう一度試す
        </button>
      </div>
    )
  }

  // フォーム表示
  return (
    <form onSubmit={handleSubmit} className="absolute inset-0 flex flex-col">
      {/* スクロール領域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 会社名 */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            会社名
          </label>
          <input
            type="text"
            value={company}
            onInput={(e) => setCompany((e.target as HTMLInputElement).value)}
            placeholder="株式会社○○"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* お名前 */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            placeholder="山田 太郎"
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            placeholder="example@company.co.jp"
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* お問い合わせ内容 */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">
            お問い合わせ内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={message}
            onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
            placeholder="お問い合わせ内容をご記入ください"
            required
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none"
          />
        </div>

        {/* プライバシーポリシー同意 */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="chatbot-privacy"
            checked={privacyAgree}
            onChange={(e) => setPrivacyAgree((e.target as HTMLInputElement).checked)}
            required
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="chatbot-privacy" className="text-xs text-gray-600 leading-relaxed">
            <a
              href="/ai-saite/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-600"
            >
              プライバシーポリシー
            </a>
            に同意する
          </label>
        </div>

        {/* honeypot（スパム対策） */}
        <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} />
      </div>

      {/* 送信ボタン（固定フッター） */}
      <div className="shrink-0 p-4 pt-2 bg-white border-t border-gray-100">
        <button
          type="submit"
          disabled={status === 'submitting' || !privacyAgree}
          className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all ${
            status === 'submitting' || !privacyAgree
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_28px_rgba(239,68,68,0.6)]'
          }`}
        >
          {status === 'submitting' ? '送信中...' : '送信する'}
        </button>
      </div>
    </form>
  )
}

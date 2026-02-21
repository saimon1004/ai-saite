import type { FAQCategory, FAQWithVideo, FAQVideo, ChatbotConfig } from '../components/types'

export const DEFAULT_CATEGORIES: FAQCategory[] = [
  { id: 'training', name: '研修内容について', icon: '📚' },
  { id: 'pricing', name: '料金について', icon: '💰' },
  { id: 'intro', name: '導入について', icon: '🚀' },
  { id: 'results', name: '実績・効果について', icon: '📊' },
]

export const DEFAULT_VIDEOS: FAQVideo[] = [
  {
    id: 'greeting',
    videoUrl: 'greeting.mp4',
    duration: 15,
    isPlaceholder: false,
  },
  {
    id: 'faq-training-1',
    videoUrl: 'faq-training-1.mp4',
    duration: 25,
    isPlaceholder: true,
  },
  {
    id: 'faq-training-2',
    videoUrl: 'faq-training-2.mp4',
    duration: 20,
    isPlaceholder: true,
  },
  {
    id: 'faq-training-3',
    videoUrl: 'faq-training-3.mp4',
    duration: 25,
    isPlaceholder: true,
  },
  {
    id: 'faq-pricing-1',
    videoUrl: 'faq-pricing-1.mp4',
    duration: 20,
    isPlaceholder: true,
  },
  {
    id: 'faq-pricing-2',
    videoUrl: 'faq-pricing-2.mp4',
    duration: 25,
    isPlaceholder: true,
  },
  {
    id: 'faq-intro-1',
    videoUrl: 'faq-intro-1.mp4',
    duration: 20,
    isPlaceholder: true,
  },
  {
    id: 'faq-intro-2',
    videoUrl: 'faq-intro-2.mp4',
    duration: 25,
    isPlaceholder: true,
  },
  {
    id: 'faq-intro-3',
    videoUrl: 'faq-intro-3.mp4',
    duration: 20,
    isPlaceholder: true,
  },
  {
    id: 'faq-results-1',
    videoUrl: 'faq-results-1.mp4',
    duration: 20,
    isPlaceholder: true,
  },
  {
    id: 'faq-results-2',
    videoUrl: 'faq-results-2.mp4',
    duration: 20,
    isPlaceholder: true,
  },
]

export const DEFAULT_FAQS: FAQWithVideo[] = [
  {
    id: 'training-1',
    category: '研修内容について',
    question: 'どんなAIツールを学べますか？',
    answer: 'ChatGPT、Claude、Gemini、NotebookLM、Manus、Makeなど10種以上のAIツールを体験できます。講義30%・実習70%の実践重視カリキュラムで、LLMの基礎からAIエージェント、ノーコード自動化、クリエイティブAIまで4モジュールを習得します。',
    videoId: 'faq-training-1',
    order: 1,
  },
  {
    id: 'training-2',
    category: '研修内容について',
    question: 'IT知識がなくても受講できますか？',
    answer: 'はい、非エンジニアの方を対象に設計しています。基本的なPCスキルがあればどなたでも参加可能です。実際の受講者アンケートでも「分かりやすさ」の評価は5点満点中4.7を獲得しており、段階的にスキルアップできる設計になっています。',
    videoId: 'faq-training-2',
    order: 2,
  },
  {
    id: 'training-3',
    category: '研修内容について',
    question: '研修で実際にどんな成果物が作れますか？',
    answer: 'たとえばClaude Codeを使った採用サイトの制作実績があります。日本語で指示するだけで、エンジニアなしでプロ品質のWebサイトを環境構築から公開まで完成させられます。他にも業務フローの自動化、社内ナレッジBOT、広告バナーや動画など、幅広いアウトプットに対応しています。',
    videoId: 'faq-training-3',
    order: 3,
  },
  {
    id: 'pricing-1',
    category: '料金について',
    question: '研修費用はどのくらいですか？',
    answer: '10万円（税抜）からご利用いただけます。貴社の課題やレベル感に合わせて研修内容・時間・回数を柔軟にカスタマイズできます。受講人数は無制限で、1ヶ月単位での更新が可能です。まずは無料相談からお気軽にどうぞ。',
    videoId: 'faq-pricing-1',
    order: 4,
  },
  {
    id: 'pricing-2',
    category: '料金について',
    question: '助成金は使えますか？',
    answer: 'はい、人材開発支援助成金を活用できます。スマート助成金プランでは、助成金を活用することで実質月々2万円/人で10時間の研修と5ヶ月の伴走サポートが受けられます。助成金の申請手続きサポートも承りますので、お気軽にお問い合わせください。',
    videoId: 'faq-pricing-2',
    order: 5,
  },
  {
    id: 'intro-1',
    category: '導入について',
    question: '研修はオンラインで受講できますか？',
    answer: 'はい、オンラインと対面のどちらにも対応しています。スケジュールも貴社のご都合に合わせて柔軟に調整可能です。3日間・計11時間のプログラムを基本としていますが、カスタマイズもできます。',
    videoId: 'faq-intro-1',
    order: 6,
  },
  {
    id: 'intro-2',
    category: '導入について',
    question: '導入までの流れを教えてください',
    answer: 'まず無料相談でお話をお伺いし、貴社の状況に合わせた研修内容を協議します。ご提案内容をご検討いただいた後、ご契約・研修実施となります。研修後も伴走サポートとして継続的な業務改善支援を行います。最短2週間で開始できます。',
    videoId: 'faq-intro-2',
    order: 7,
  },
  {
    id: 'intro-3',
    category: '導入について',
    question: '自社の業種に合わせたカスタマイズは可能ですか？',
    answer: 'はい、可能です。貴社の業界・課題・社員のレベル感に合わせて、研修内容を柔軟にカスタマイズいたします。たとえば営業部門向けの事務自動化、マーケティング部門向けのコンテンツ量産化、人事部門向けのナレッジ管理など、部門別の活用に特化した研修も対応しています。',
    videoId: 'faq-intro-3',
    order: 8,
  },
  {
    id: 'results-1',
    category: '実績・効果について',
    question: '受講者の満足度はどのくらいですか？',
    answer: '受講者アンケートでは総合満足度4.8/5.0、業務活用度4.7/5.0という高い評価をいただいています。「すぐに業務で活かせる」との声を多数いただいており、研修で生まれた具体的な改善アイデアは50件以上にのぼります。',
    videoId: 'faq-results-1',
    order: 9,
  },
  {
    id: 'results-2',
    category: '実績・効果について',
    question: '研修後のサポートはありますか？',
    answer: 'はい、研修後も伴走サポートとして業務改善の定着支援を行います。AIを現場に定着させるためのフォローアップや、新たなツール活用の相談、追加研修のご要望にも対応いたします。スマート助成金プランでは5ヶ月間の伴走が含まれています。',
    videoId: 'faq-results-2',
    order: 10,
  },
]

export const DEFAULT_CONFIG: ChatbotConfig = {
  greetingVideoId: 'greeting',
  greetingMessage: 'こんにちは！AI IMPACT LABへようこそ。AI研修について気になることがあればお気軽にどうぞ！',
  farewellMessage: 'ご質問ありがとうございました。研修についてのご相談は、お問い合わせフォームからもお待ちしております！',
  enableSound: false,
}

import React, { useState, useEffect, useRef } from 'react'
import { askAI } from '@/services/blogService.js'
import { MessageCircle, X, Send } from 'lucide-react' // ✅ เพิ่มไอคอนหรูๆ

const STORAGE_KEY = 'ai_chat_history'

const AIChatModal = () => {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const toggleOpen = () => setOpen(!open)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await askAI(question)
      const newEntry = { question, answer: res.answer }
      setConversation((prev) => [...prev, newEntry])
      setQuestion('')
    } catch (err) {
      const newEntry = { question, answer: `❌ Error: ${err.message}` }
      setConversation((prev) => [...prev, newEntry])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation, open])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation))
  }, [conversation])

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-5 cursor-pointer right-5 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl z-50 hover:scale-110 transition-transform duration-300"
        title="AI Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 bg-neutral-900 text-white rounded-2xl shadow-2xl border border-neutral-700 z-50 flex flex-col overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-700 bg-neutral-800/80">
            <h3 className="font-semibold text-lg tracking-wide">AI Assistant</h3>
            <button
              onClick={toggleOpen}
              className="text-neutral-400 cursor-pointer hover:text-white transition"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conversation */}
          <div className="flex flex-col gap-3 px-4 py-3 flex-1 max-h-80 overflow-y-auto custom-scroll">
            {conversation.length === 0 ? (
              <div className="text-center text-neutral-500 text-sm italic">
                💬 เริ่มคุยกับผู้ช่วย AI ได้เลย
              </div>
            ) : (
              conversation.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="self-end bg-neutral-100 text-black p-2 rounded-xl max-w-[80%] ml-auto shadow-sm">
                    {item.question}
                  </div>
                  <div className="self-start bg-neutral-800 p-2 rounded-xl max-w-[85%] shadow-sm text-neutral-100">
                    {item.answer}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-neutral-700 bg-neutral-900">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="พิมพ์คำถาม..."
              className="flex-1 bg-neutral-800 text-white placeholder-neutral-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className={`p-2 rounded-lg transition cursor-pointer ${
                loading
                  ? 'bg-neutral-700 text-neutral-400'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {loading ? '...' : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatModal

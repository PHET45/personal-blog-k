import React, { useState, useEffect, useRef } from 'react'
import { askAI } from '@/services/blogService.js'

const STORAGE_KEY = 'ai_chat_history'

const AIChatModal = () => {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  
  // Lazy init conversation จาก localStorage
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

  // scroll ลงข้อความล่าสุด
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversation, open])

  // update localStorage ทุกครั้ง conversation เปลี่ยน
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation))
  }, [conversation])

  return (
    <>
      {/* ปุ่ม floating */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 hover:bg-blue-700"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-xl shadow-xl p-4 z-50 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">AI Assistant</h3>
            <button onClick={toggleOpen} className="text-gray-500 cursor-pointer  hover:text-gray-700">
              ✖
            </button>
          </div>

          {/* Conversation history */}
          <div className="flex flex-col gap-2 flex-1 max-h-64 overflow-y-auto mb-2">
            {conversation.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="bg-blue-100 p-2 rounded">💡 {item.question}</div>
                <div className="bg-gray-100 p-2 rounded">{item.answer}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="ถาม AI..."
              className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              className="bg-blue-600 text-white px-3 py-1 cursor-pointer rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? '...' : 'ส่ง'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatModal

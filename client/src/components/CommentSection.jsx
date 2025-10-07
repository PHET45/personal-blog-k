import { Trash2 } from 'lucide-react'

export const CommentSection = ({ comments, currentUser, onDelete }) => {
  return (
    <div className="flex flex-col w-full border-t border-gray-200 mt-6">
      {comments.length === 0 && (
        <p className="text-gray-500 text-sm py-3">No comments yet.</p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          className="flex flex-col w-full border-b border-gray-200 py-5"
        >
          <div className="flex gap-3">
            <div className="w-10 h-10">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.name || 'unknown'}`}
                alt={c.user?.name || 'Unknown'}
                className="w-10 h-10 object-cover rounded-full bg-amber-300"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {c.user?.name || 'Unknown'}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>

                {currentUser && currentUser.id === c.user_id && (
                  <button
                    onClick={() => onDelete(c.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {c.comment_text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

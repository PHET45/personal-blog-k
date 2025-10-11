import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { UploadService } from "@/services/upload";

export const CommentSection = ({ comments, currentUser, onDelete }) => {
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const fetchProfiles = async () => {
      const ids = [...new Set(comments.map(c => c.user_id))];
      const map = {};

      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await UploadService.getUserProfile(id);
            map[id] = res.profile || null; // ✅ เข้าถึง profile
          } catch {
            map[id] = null;
          }
        })
      );

      setUsersMap(map);
    };

    fetchProfiles();
  }, [comments]);

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="flex flex-col w-full border-t border-gray-200 mt-6">
      {sortedComments.length === 0 && (
        <p className="text-gray-500 text-sm py-3">No comments yet.</p>
      )}

      {sortedComments.map((c) => {
        const user = usersMap[c.user_id] || {};
        return (
          <div key={c.id} className="flex flex-col w-full border-b border-gray-200 py-5">
            <div className="flex gap-3">
              <div className="w-10 h-10">
                <img
                  src={
                    user.profile_pic ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "unknown"}`
                  }
                  alt={user.name || "Unknown"}
                  className="w-full h-full object-cover rounded-full bg-amber-300"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{user.name || "Unknown"}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(c.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
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
                <p className="text-sm text-gray-700 leading-relaxed">{c.comment_text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

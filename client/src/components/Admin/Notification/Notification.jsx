import { useEffect, useState } from "react";
import { Trash2, MessageCircle, Bell } from "lucide-react";
import SideBar from "../SideBar";
import { getNotifications, deleteComment } from "@/services/commentService";

const CommentNotification = ({ notification}) => {
  const { user, post, comment_text, created_at} = notification;

  return (
    <div className="flex gap-4 w-full border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white">
      {/* Profile Picture */}
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={
            user?.profile_pic ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "unknown"}`
          }
          alt={user?.name || "Unknown"}
          className="w-full h-full object-cover rounded-full bg-amber-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">{user?.name || "Unknown User"}</span>
              {" "}Commented on your article:{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">
                {post?.title || "your post"}
              </span>
            </p>
          </div>

          <button
            className="text-blue-600 hover:underline text-sm font-medium flex-shrink-0"
            title="View post"
          >
            View
          </button>
        </div>

        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
          "{comment_text}"
        </p>

        <p className="text-xs text-gray-400 mt-2">
          {(() => {
            const now = new Date();
            const commentDate = new Date(created_at);
            const diffMs = now - commentDate;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffHours < 1) {
              const diffMins = Math.floor(diffMs / (1000 * 60));
              return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
            } else if (diffHours < 24) {
              return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else if (diffDays < 7) {
              return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            } else {
              return commentDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            }
          })()}
        </p>
      </div>
    </div>
  );
};

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    getCurrentUserFromToken();
  }, []);

  const getCurrentUserFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );

        const user = JSON.parse(jsonPayload);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications. Please try again.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      setNotifications(prev => prev.filter(n => n.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}
      <div className="flex justify-between items-center px-15 border-b border-stone-200 h-[96px]">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-800" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Notifications
          </h1>
          {notifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
              {notifications.length}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="lg:w-[120px] lg:h-[48px] px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        <div className="bg-[#F9F8F6] rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="w-12 h-12 text-red-300 mb-3" />
              <p className="text-red-500 text-lg font-medium">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg font-medium">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">
                You're all caught up! No new comments to display.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {notifications.map((notification) => (
                <CommentNotification
                  key={notification.id}
                  notification={notification}
                  currentUser={currentUser}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
// import React, { useState, useContext, useEffect } from "react";
// import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { AuthDataContext } from "../context/AuthContext";
// import { setUserData } from "../redux/userSlice.js";
// import { useNavigate } from "react-router-dom";
// import { SocketDataContext } from "../context/SocketContext.jsx";
// const Post = ({ post }) => {
//   if (!post) return null;
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.user?.userData) || {};
//   const { serverUrl } = useContext(AuthDataContext);
//   const dispatch = useDispatch();

//   // const isFollowing = user.following?.includes(post.author?._id) || false;

//   // // FIX 1: Use local state with .some() for proper ObjectId comparison
//   // const [saved, setSaved] = useState(
//   //   user.saved?.some(
//   //     (savedPost) => String(savedPost._id) === String(post._id)
//   //   ) || false
//   // );

//   // const [liked, setLiked] = useState(post.likes?.includes(user._id) || false);
//   const isFollowing =
//     user.following?.some((id) => String(id) === String(post.author?._id)) ||
//     false;

//   const [saved, setSaved] = useState(
//     user.saved?.some(
//       (savedPost) => String(savedPost._id) === String(post._id)
//     ) || false
//   );
//   const [liked, setLiked] = useState(
//     (post.likes || []).some((id) => String(id) === String(user._id))
//   );
//   const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
//   const [comments, setComments] = useState(post.comments || []);
//   const [message, setMessage] = useState("");
//   const [showAllComments, setShowAllComments] = useState(false);
//   //includes compares strings in array and not Object
//   const { socket } = useContext(SocketDataContext);
//   // Debug logs
//   useEffect(() => {
//     if (!socket) return;
//     const onPostLiked = (data) => {
//       if (String(data.postId) !== String(post._id)) return;
//       // update count
//       if (typeof data.likesCount !== "undefined") {
//         setLikesCount(Number(data.likesCount) || 0);
//       } else if (Array.isArray(data.likes)) {
//         setLikesCount(data.likes.length);
//       }
//       // update liked status for current user (if server sent likes array)
//       if (Array.isArray(data.likes)) {
//         setLiked(data.likes.some((id) => String(id) === String(user._id)));
//       } else {
//         // fallback: if server didn't send array, keep current liked (or optionally fetch post)
//       }
//     };
//     socket.on("postLiked", onPostLiked);
//     return () => {
//       socket.off("postLiked", onPostLiked);
//     };
//   }, [socket, post._id, user._id]);
//   // FIX 2: Sync local state with Redux when user.saved changes
//   useEffect(() => {
//     const isSavedInRedux =
//       user.saved?.some(
//         (savedPost) => String(savedPost._id) === String(post._id)
//       ) || false;
//     setSaved(isSavedInRedux);
//   }, [user.saved, post._id]);

//   const handleFollow = async () => {
//     try {
//       const followUserId = post.author?._id;
//       const response = await axios.post(
//         `${serverUrl}/api/user/follow/${followUserId}`,
//         {},
//         { withCredentials: true }
//       );
//       if (response.data.currentUser) {
//         dispatch(setUserData(response.data.currentUser));
//       }
//     } catch (error) {
//       console.error("Error following/unfollowing user:", error);
//     }
//   };

//   const handleSave = async () => {
//     // FIX 3: Optimistic UI update (instant feedback)
//     const previousSaved = saved;
//     setSaved(!previousSaved);

//     try {
//       const postId = post._id;
//       const response = await axios.post(
//         `${serverUrl}/api/post/save/${postId}`,
//         {},
//         { withCredentials: true }
//       );

//       console.log("Save/Unsave response:", response.data.user);

//       // FIX 4: Dispatch the COMPLETE user object, not just saved array
//       if (response.data.user) {
//         dispatch(setUserData(response.data.user));
//       }
//     } catch (error) {
//       console.error("Error saving/unsaving post:", error);
//       // Revert on error
//       setSaved(previousSaved);
//     }
//   };

//   const handleLike = async () => {
//     const previousLiked = liked;
//     const previousLikesCount = likesCount;
//     setLiked(!previousLiked);
//     setLikesCount(
//       previousLiked ? previousLikesCount - 1 : previousLikesCount + 1
//     );

//     try {
//       const postId = post._id;
//       const res = await axios.post(
//         `${serverUrl}/api/post/like/${postId}`,
//         {},
//         { withCredentials: true }
//       );
//       const updatedPost = res.data.post;
//       if (updatedPost) {
//         setLikesCount(updatedPost.likes?.length || 0);
//         setLiked(
//           (updatedPost.likes || []).some(
//             (id) => String(id) === String(user._id)
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error liking/unliking post:", error);
//       setLiked(previousLiked);
//       setLikesCount(previousLikesCount);
//     }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) return;
//     try {
//       const result = await axios.post(
//         `${serverUrl}/api/post/comment/${post._id}`,
//         { comment: message },
//         { withCredentials: true }
//       );
//       const updatedPostData = result.data.post;
//       setComments(updatedPostData.comments || []);
//       setMessage("");
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl mb-6">
//       <div className="flex items-center justify-between p-3 sm:p-4">
//         <div
//           className="flex items-center gap-3"
//           onClick={() => navigate(`/profile/${post.author?.userName}`)}
//         >
//           <img
//             className="h-10 w-10 rounded-full object-cover"
//             src={post.author?.profileImage || "/image.png"}
//             alt={post.author?.name || "User"}
//           />
//           <div>
//             <p className="font-bold text-sm text-gray-800">
//               {post.author?.name || "Unknown"}
//             </p>
//             <p className="text-xs text-gray-500">
//               @{post.author?.userName || "unknown"}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           {user._id !== post.author?._id && (
//             <button
//               onClick={handleFollow}
//               className={`${
//                 isFollowing ? "text-red-500" : "text-purple-600"
//               } font-bold text-sm hover:${
//                 isFollowing ? "text-black" : "text-purple-800"
//               }`}
//             >
//               {isFollowing ? "Unfollow" : "Follow"}
//             </button>
//           )}
//           <button className="text-gray-500 hover:text-gray-800">
//             <MoreHorizontal size={20} />
//           </button>
//         </div>
//       </div>

//       {post.mediaType === "video" ? (
//         <video
//           className="w-full h-auto max-h-[70vh] object-cover"
//           src={post.media}
//           controls
//         />
//       ) : (
//         <img
//           className="w-full h-auto max-h-[70vh] object-cover"
//           src={post.media || "/image.png"}
//           alt="Post content"
//         />
//       )}

//       <div className="p-3 sm:p-4">
//         <div className="flex justify-between items-center mb-2">
//           <div className="flex items-center gap-4">
//             <button onClick={handleLike}>
//               {liked ? (
//                 <Heart
//                   size={24}
//                   className="text-red-500 fill-red-500 transition-transform duration-200 ease-in-out transform active:scale-125"
//                 />
//               ) : (
//                 <Heart
//                   size={24}
//                   className="text-gray-700 hover:text-red-500 transition-colors"
//                 />
//               )}
//             </button>
//             <button
//               onClick={() =>
//                 document.getElementById(`comment-input-${post._id}`)?.focus()
//               }
//             >
//               <MessageCircle
//                 size={24}
//                 className="text-gray-700 hover:text-gray-900 transition-colors"
//               />
//             </button>
//           </div>
//           <button onClick={handleSave}>
//             {saved ? (
//               <Bookmark
//                 size={24}
//                 className="text-purple-600 fill-purple-600 transition-transform duration-200 ease-in-out transform active:scale-125"
//               />
//             ) : (
//               <Bookmark
//                 size={24}
//                 className="text-gray-700 hover:text-purple-600 transition-colors"
//               />
//             )}
//           </button>
//         </div>

//         <p className="font-semibold text-sm text-gray-800 mb-1">
//           {likesCount} likes
//         </p>
//         <p className="text-sm text-gray-700 break-words">
//           <span className="font-semibold text-gray-800 mr-2">
//             {post.author?.userName || "user"}
//           </span>
//           {post.caption || ""}
//         </p>
//         {comments.length > 0 && (
//           <p
//             className="text-xs text-gray-500 hover:underline mt-1 block cursor-pointer"
//             onClick={() => setShowAllComments(!showAllComments)}
//           >
//             {showAllComments
//               ? "Hide comments"
//               : `View all ${comments.length} comments`}
//           </p>
//         )}
//       </div>

//       <div className="border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
//         <form className="flex items-center gap-2" onSubmit={handleComment}>
//           <input
//             id={`comment-input-${post._id}`}
//             type="text"
//             placeholder="Add a comment..."
//             className="w-full bg-transparent focus:outline-none text-sm"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button
//             type="submit"
//             disabled={!message.trim()}
//             className="text-purple-600 hover:text-purple-800 font-semibold text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
//           >
//             Post
//           </button>
//         </form>
//       </div>

//       {showAllComments && (
//         <div className="px-3 sm:px-4 pb-2 max-h-48 overflow-y-auto">
//           {comments.map((comment) => (
//             <div key={comment._id} className="flex items-start gap-3 py-2">
//               <img
//                 src={comment.author?.profileImage || "/image.png"}
//                 alt={comment.author?.name || "User"}
//                 className="h-8 w-8 rounded-full object-cover mt-1"
//               />
//               <div className="flex-1">
//                 <p className="text-sm break-words">
//                   <span className="font-semibold text-gray-800 mr-2">
//                     {comment.author?.userName || "Unknown"}
//                   </span>
//                   {comment.comment}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Post;
// ...existing code...
import React, { useState, useContext, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import { SocketDataContext } from "../context/SocketContext.jsx";

const Post = ({ post }) => {
  if (!post) return null;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.userData) || {};
  const { serverUrl } = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const { socket } = useContext(SocketDataContext);

  // local UI state
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  // sync with incoming post prop
  useEffect(() => {
    setSaved((user.saved || []).some((p) => String(p._id) === String(post._id)));
    setLiked((post.likes || []).some((id) => String(id) === String(user._id)));
    setLikesCount(post.likes?.length || 0);
    setComments(post.comments || []);
  }, [post, user._id, user.saved]);

  // realtime listeners for likes and comments
  useEffect(() => {
    if (!socket) return;
    const onPostLiked = (data) => {
      if (String(data.postId) !== String(post._id)) return;
      if (typeof data.likesCount !== "undefined") {
        setLikesCount(Number(data.likesCount) || 0);
      } else if (Array.isArray(data.likes)) {
        setLikesCount(data.likes.length);
      }
      if (Array.isArray(data.likes)) {
        setLiked(data.likes.some((id) => String(id) === String(user._id)));
      }
    };
    const onPostCommented = (data) => {
      if (String(data.postId) !== String(post._id)) return;
      // server may send full post or comments count; safest is to fetch updated post
      if (data.post) {
        setComments(data.post.comments || []);
      } else {
        // fetch single post to update comments
        axios
          .get(`${serverUrl}/api/post/${post._id}`, { withCredentials: true })
          .then((res) => {
            if (res.data?.post) setComments(res.data.post.comments || []);
          })
          .catch(() => {});
      }
    };
    socket.on("postLiked", onPostLiked);
    socket.on("postCommented", onPostCommented);
    return () => {
      socket.off("postLiked", onPostLiked);
      socket.off("postCommented", onPostCommented);
    };
  }, [socket, post._id, serverUrl, user._id]);

  const handleFollow = async () => {
    try {
      const followUserId = post.author?._id;
      const response = await axios.post(
        `${serverUrl}/api/user/follow/${followUserId}`,
        {},
        { withCredentials: true }
      );
      if (response.data.currentUser) dispatch(setUserData(response.data.currentUser));
    } catch (err) {
      console.error("follow error", err);
    }
  };

  const handleSave = async () => {
    if (saveLoading) return;
    setSaveLoading(true);
    const prev = saved;
    setSaved(!prev);
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/save/${post._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.user) dispatch(setUserData(res.data.user));
    } catch (err) {
      console.error("save error", err);
      setSaved(prev);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    const prevLiked = liked;
    const prevCount = likesCount;
    // optimistic
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );
      // sync from server response if provided
      const updatedPost = res.data.post || res.data.updatedPost;
      if (updatedPost) {
        setLikesCount(updatedPost.likes?.length || 0);
        setLiked((updatedPost.likes || []).some((id) => String(id) === String(user._id)));
      }
      // else socket will broadcast and correct state
    } catch (err) {
      console.error("like error", err);
      // rollback
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e?.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    const prev = commentText;
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { comment: commentText },
        { withCredentials: true }
      );
      // server returns updated post; update comments
      if (res.data?.post) {
        setComments(res.data.post.comments || []);
      } else {
        // rely on socket to update; clear input
      }
      setCommentText("");
    } catch (err) {
      console.error("comment error", err);
      setCommentText(prev);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6">
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.author?.userName}`)}
        >
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={post.author?.profileImage || "/image.png"}
            alt={post.author?.name || "User"}
          />
          <div>
            <p className="font-bold text-sm text-gray-800">
              {post.author?.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              @{post.author?.userName || "unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user._id !== post.author?._id && (
            <button
              onClick={handleFollow}
              className={`${
                (user.following || []).some((id) => String(id) === String(post.author?._id))
                  ? "text-red-500"
                  : "text-purple-600"
              } font-bold text-sm`}
            >
              {(user.following || []).some((id) => String(id) === String(post.author?._id))
                ? "Unfollow"
                : "Follow"}
            </button>
          )}
          <button className="text-gray-500 hover:text-gray-800">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {post.mediaType === "video" ? (
        <video className="w-full h-auto max-h-[70vh] object-cover" src={post.media} controls />
      ) : (
        <img className="w-full h-auto max-h-[70vh] object-cover" src={post.media || "/image.png"} alt="Post content" />
      )}

      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} disabled={likeLoading} aria-label="like">
              {liked ? (
                <Heart size={24} className="text-red-500 fill-red-500 transition-transform" />
              ) : (
                <Heart size={24} className="text-gray-700 hover:text-red-500 transition-colors" />
              )}
            </button>
            <button onClick={() => document.getElementById(`comment-input-${post._id}`)?.focus()}>
              <MessageCircle size={24} className="text-gray-700 hover:text-gray-900 transition-colors" />
            </button>
          </div>
          <button onClick={handleSave} disabled={saveLoading}>
            {saved ? (
              <Bookmark size={24} className="text-purple-600 fill-purple-600" />
            ) : (
              <Bookmark size={24} className="text-gray-700 hover:text-purple-600" />
            )}
          </button>
        </div>

        <p className="font-semibold text-sm text-gray-800 mb-1">{likesCount} likes</p>
        <p className="text-sm text-gray-700 break-words">
          <span className="font-semibold text-gray-800 mr-2">{post.author?.userName || "user"}</span>
          {post.caption || ""}
        </p>

        {comments.length > 0 && (
          <p className="text-xs text-gray-500 hover:underline mt-1 block cursor-pointer" onClick={() => setShowAllComments((v) => !v)}>
            {showAllComments ? "Hide comments" : `View all ${comments.length} comments`}
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
        <form className="flex items-center gap-2" onSubmit={handleComment}>
          <input
            id={`comment-input-${post._id}`}
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent focus:outline-none text-sm"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={commentLoading}
          />
          <button
            type="submit"
            disabled={!commentText.trim() || commentLoading}
            className="text-purple-600 hover:text-purple-800 font-semibold text-sm disabled:text-gray-400"
          >
            {commentLoading ? "…" : "Post"}
          </button>
        </form>
      </div>

      {showAllComments && (
        <div className="px-3 sm:px-4 pb-2 max-h-48 overflow-y-auto">
          {comments.map((c) => (
            <div key={c._id || `${c.author}-${c.comment}`} className="flex items-start gap-3 py-2">
              <img src={c.author?.profileImage || "/image.png"} alt={c.author?.name || "User"} className="h-8 w-8 rounded-full object-cover mt-1" />
              <div className="flex-1">
                <p className="text-sm break-words">
                  <span className="font-semibold text-gray-800 mr-2">{c.author?.userName || "Unknown"}</span>
                  {c.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
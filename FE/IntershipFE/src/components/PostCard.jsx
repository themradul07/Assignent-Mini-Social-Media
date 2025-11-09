import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Avatar,
  Box,
  CardMedia,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { Favorite, ChatBubbleOutline } from "@mui/icons-material";
import { postJSON } from "../api";

export default function PostCard({ post, token }) {
  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).id
    : null;

  const [liked, setLiked] = useState((post.likes || []).includes(userId));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState(false); // 👈 popup state

  // Toggle Like
  async function toggleLike() {
    try {
      setLiked((prev) => !prev);
      setLikesCount((prev) => prev + (liked ? -1 : 1));

      const res = await postJSON(`/posts/${post._id}/like`, {}, token);
      if (res.msg) {
        alert(res.msg);
        setLiked((prev) => !prev);
        setLikesCount(post.likes.length);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Add Comment
  async function addComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const tmp = commentText.trim();
    setCommentText("");
    setLoading(true);

    try {
      const res = await postJSON(`/posts/${post._id}/comment`, { text: tmp }, token);
      console.log(res);
      if (res.msg) return alert(res.msg);

      // Append comment locally
      if (res.newComment) setComments((prev) => [...prev, res.newComment]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* --- Post Card --- */}
      <Card
        sx={{
          maxWidth: 600,
          margin: "20px auto",
          borderRadius: "12px",
          transition: "0.3s",
          "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#1976d2" }}>
              {post.username?.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={post.username}
          subheader={new Date(post.createdAt).toLocaleString()}
        />

        <CardContent>
          {post.text && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              {post.text}
            </Typography>
          )}

          {post.imageUrl && (
            <CardMedia
              component="img"
              image={post.imageUrl}
              alt="Post"
              sx={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "8px",
                marginBottom: "10px",
              }}
            />
          )}

          <Box display="flex" alignItems="center" mb={1}>
            <Tooltip title="Like">
              <IconButton onClick={toggleLike}>
                <Favorite color={liked ? "error" : "action"} />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {likesCount} likes
            </Typography>

            <Tooltip title="Comments">
              <IconButton onClick={() => setOpenComments(true)}>
                <ChatBubbleOutline />
              </IconButton>
            </Tooltip>
            <Typography variant="body2">{comments.length} comments</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* --- Comments Popup --- */}
      <Dialog
        open={openComments}
        onClose={() => setOpenComments(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Comments</DialogTitle>
        <Divider />
        <DialogContent dividers sx={{ maxHeight: "400px" }}>
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>{c.username || "User"}:</strong> {c.text}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No comments yet. Be the first one!
            </Typography>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Box
            component="form"
            onSubmit={addComment}
            display="flex"
            gap={1}
            width="100%"
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !commentText.trim()}
            >
              Post
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

const express = require('express');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Create post
router.post('/', auth, async (req, res) => {
  const { text, imageUrl } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const post = new Post({
      userId: user._id,
      username: user.name,
      text: text || '',
      imageUrl: imageUrl || ''
    });
    await post.save();
    res.json(post);
  } catch(e){ res.status(500).json({ msg: e.message }); }
});

// Get feed with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = Math.min(parseInt(req.query.limit || '10'), 50);
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(limit)
      .lean();
    const total = await Post.countDocuments();
    res.json({ posts, page, limit, total });
  } catch(e){ res.status(500).json({ msg: e.message }); }
});

// Like/unlike
router.post('/:postId/like', auth, async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({ msg: 'Post not found' });
    const idx = post.likes.findIndex(id => id.equals(userId));
    if(idx === -1) post.likes.push(userId); else post.likes.splice(idx,1);
    await post.save();
    res.json({ likesCount: post.likes.length, liked: idx === -1 });
  } catch(e){ res.status(500).json({ msg: e.message }); }
});

// Add comment
router.post('/:postId/comment', auth, async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { text } = req.body;
  if(!text) return res.status(400).json({ msg:'Empty comment' });
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if(!post) return res.status(404).json({ msg:'Not found' });
    post.comments.push({ userId: user._id, username: user.name, text });
    await post.save();
    res.json({ commentsCount: post.comments.length, newComment: post.comments[post.comments.length-1] });
  } catch(e){ res.status(500).json({ msg: e.message }); }
});

module.exports = router;

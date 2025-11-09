import React, { useEffect, useState } from 'react';
import { getJSON } from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

export default function Feed({ token }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(6); // 👈 user-selected posts per page

  async function load(p = 1, l = limit) {
    const res = await getJSON(`/posts?page=${p}&limit=${l}`, token);
    setPosts(res.posts || []);
    setTotal(res.total || 0);
    setPage(res.page || p);
  }

  useEffect(() => {
    load(1, limit);
  }, [limit]); // 👈 reload when limit changes

  function onPosted(newPost) {
    setPosts((prev) => [newPost, ...prev]);
  }

  return (
    <div>
      <CreatePost token={token} onPost={onPosted} />
      {posts.map((p) => (
        <PostCard
          key={p._id}
          post={p}
          token={token}
          onUpdate={() => load(page, limit)}
        />
      ))}

      <div className="pagination">
        {page > 1 && (
          <button className="btn" onClick={() => load(page - 1, limit)}>
            Prev
          </button>
        )}
        {page * limit < total && (
          <button className="btn" onClick={() => load(page + 1, limit)}>
            Next
          </button>
        )}

        {/* 👇 Dropdown for items per page */}
        <select
          className="limit-select"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={6}>6 per page</option>
          <option value={10}>10 per page</option>
          <option value={15}>15 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>
    </div>
  );
}

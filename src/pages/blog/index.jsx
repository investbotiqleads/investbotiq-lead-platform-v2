import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error) setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      {loading ? (
        <div>Laden...</div>
      ) : posts.length === 0 ? (
        <div>Geen blogposts gevonden.</div>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.id} className="border-b pb-4">
              <Link to={`/blog/${post.id}`} className="text-xl font-semibold text-blue-700 hover:underline">
                {post.title}
              </Link>
              <div className="text-gray-500 text-sm mt-1">
                {post.author ? `Door ${post.author}` : ''} {post.published_at ? `· ${new Date(post.published_at).toLocaleDateString()}` : ''}
              </div>
              <div className="text-xs text-gray-400 mt-1">Status: {post.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;

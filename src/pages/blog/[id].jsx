import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto py-10 px-4">Laden...</div>;
  if (!post) return <div className="max-w-2xl mx-auto py-10 px-4">Blogpost niet gevonden.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link to="/blog" className="text-blue-600 hover:underline text-sm">← Terug naar blogoverzicht</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{post.title}</h1>
      <div className="text-gray-500 text-sm mb-4">
        {post.author ? `Door ${post.author}` : ''} {post.published_at ? `· ${new Date(post.published_at).toLocaleDateString()}` : ''}
      </div>
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogDetail;

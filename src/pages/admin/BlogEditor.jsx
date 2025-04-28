import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const emptyPost = {
  title: '',
  content: '',
  author: '',
  status: 'draft',
};

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(emptyPost);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (data) setPost(data);
          setError(error?.message || null);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    if (!post.title || !post.content) {
      setError('Titel en inhoud zijn verplicht.');
      setLoading(false);
      return;
    }
    let result;
    if (id) {
      result = await supabase
        .from('blog_posts')
        .update({ ...post, updated_at: new Date().toISOString() })
        .eq('id', id);
    } else {
      result = await supabase
        .from('blog_posts')
        .insert([{ ...post, created_at: new Date().toISOString() }]);
    }
    if (result.error) {
      setError(result.error.message);
    } else {
      navigate('/blog');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      navigate('/blog');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Bewerk blogpost' : 'Nieuwe blogpost'}</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block font-medium mb-1">Titel</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Auteur</label>
        <input
          type="text"
          name="author"
          value={post.author}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={post.status}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          disabled={loading}
        >
          <option value="draft">Concept</option>
          <option value="published">Gepubliceerd</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Inhoud (Markdown ondersteund)</label>
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded font-mono"
          rows={10}
          disabled={loading}
        />
      </div>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          {preview ? 'Bewerken' : 'Preview'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {id ? 'Opslaan' : 'Aanmaken'}
        </button>
        {id && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            disabled={loading}
          >
            Verwijderen
          </button>
        )}
      </div>
      {preview && (
        <div className="prose prose-blue max-w-none border-t pt-4 mt-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;

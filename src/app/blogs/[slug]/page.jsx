"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const BlogPost = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.slug}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setBlog(data.data.blog);
        } else if (response.status === 404) {
          notFound();
        } else {
          setError(data.message || 'Failed to fetch blog post');
        }
      } catch (err) {
        setError('An error occurred while fetching the blog post');
        console.error('Fetch blog error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  // Render blog sections (content/code)
  const renderSections = (sections, fallbackContent) => {
    if (Array.isArray(sections) && sections.length > 0) {
      return sections.map((section, idx) => {
        if (section.type === 'code') {
          return (
            <div key={idx} className="my-6">
              <SyntaxHighlighter language="javascript" style={oneDark} customStyle={{ borderRadius: '0.5rem', fontSize: '1rem', padding: '1.2em' }}>
                {section.value}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          return (
            <div key={idx} className="mb-6 prose prose-invert prose-lg max-w-none">
              <ReactMarkdown>{section.value}</ReactMarkdown>
            </div>
          );
        }
      });
    } else if (fallbackContent) {
      // fallback for old blogs
      return (
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{fallbackContent}</ReactMarkdown>
        </div>
      );
    } else {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Loading blog post..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Blog Post</h2>
            <p className="text-red-300">{error}</p>
            <Link href="/blogs" className="mt-4 inline-block px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300">
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-400 transition-colors duration-300 mb-8 group"
          >
            <svg 
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to Blogs
          </Link>

          {/* Header */}
          <header className="mb-12">
            {blog?.featured && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-300/10 text-emerald-300 text-sm font-medium rounded-full mb-6">
                ⭐ Featured Post
              </div>
            )}

            {/* Tags */}
            {blog?.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-300 text-sm font-medium rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {blog?.title}
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {blog?.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>By {blog?.author}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(blog?.publishedAt || blog?.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{blog?.readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
              <div className="text-lg">
                {renderSections(blog?.sections, blog?.content)}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-gray-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-gray-400 mb-2">
                  Thanks for reading! Found this helpful?
                </p>
                <p className="text-gray-500 text-sm">
                  Share it with others who might benefit from it.
                </p>
              </div>
              
              <Link 
                href="/blogs"
                className="px-6 py-3 bg-emerald-300 text-gray-900 font-medium rounded-lg hover:bg-emerald-400 transition-colors duration-300"
              >
                Read More Posts
              </Link>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </article>
  );
};

export default BlogPost;

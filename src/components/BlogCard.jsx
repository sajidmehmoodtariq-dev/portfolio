"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const BlogCard = ({ blog, index = 0 }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-emerald-300/50 transition-all duration-300 group"
    >
      {blog.featured && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-300/10 text-emerald-300 text-sm font-medium rounded-full mb-4">
          ⭐ Featured
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags?.slice(0, 3).map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="px-3 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
        <Link href={`/blogs/${blog.slug}`}>
          {blog.title}
        </Link>
      </h2>
      
      <p className="text-gray-400 mb-6 leading-relaxed">
        {blog.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-4">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{blog.readTime} min read</span>
        </div>
      </div>
      
      <Link 
        href={`/blogs/${blog.slug}`}
        className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-400 transition-colors duration-300 font-medium group"
      >
        Read More
        <svg 
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </motion.article>
  );
};

export default BlogCard;

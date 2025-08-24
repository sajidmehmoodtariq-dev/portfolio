"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const BlogForm = ({ initialData = {}, onSubmit, isLoading = false, submitText = "Create Blog" }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    excerpt: initialData.excerpt || '',
    tags: initialData.tags?.join(', ') || '',
    featured: initialData.featured || false,
    published: initialData.published !== undefined ? initialData.published : true,
    imageUrl: initialData.imageUrl || ''
  });

  // Blog content and code blocks as an array of {type: 'content'|'code', value: string}
  const [sections, setSections] = useState(
    initialData.sections || [
      { type: 'content', value: initialData.content || '' }
    ]
  );
  const [activeSection, setActiveSection] = useState(sections.length - 1);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    // At least one content section must have non-empty value
    if (!sections.some(s => s.value.trim())) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSectionChange = (idx, value) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, value } : s));
  };

  const handleAddCodeSnippet = () => {
    // Insert a code section after the current active section, then a new content section
    setSections(prev => {
      const newSections = [...prev];
      newSections.splice(activeSection + 1, 0, { type: 'code', value: '' }, { type: 'content', value: '' });
      return newSections;
    });
    setActiveSection(activeSection + 1); // Focus on the new code section
  };

  const handleTabClick = (idx) => {
    setActiveSection(idx);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const submitData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      sections,
      content: sections.map(s => s.value).join('\n\n') // fallback for old content
    };
    await onSubmit(submitData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-3xl p-8 border border-gray-700"
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Blog Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-300"
            placeholder="Enter blog title..."
          />
          {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
            Excerpt * <span className="text-gray-500">(Brief description)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-300 resize-none"
            placeholder="Brief description of your blog post..."
          />
          <div className="flex justify-between mt-1">
            {errors.excerpt && <p className="text-sm text-red-400">{errors.excerpt}</p>}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.excerpt.length}/200 characters
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
            Tags <span className="text-gray-500">(comma-separated)</span>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-300"
            placeholder="react, javascript, web development"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
            Featured Image URL <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-300"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a URL for the blog post's featured image. Leave empty if no image is needed.
          </p>
          {formData.imageUrl && (
            <div className="mt-3">
              <p className="text-sm text-gray-300 mb-2">Preview:</p>
              <img 
                src={formData.imageUrl} 
                alt="Featured image preview" 
                className="w-32 h-20 object-cover rounded-lg border border-gray-600"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Content & Code Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Blog Content & Code Snippets *
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {sections.map((section, idx) => (
              <button
                key={idx}
                type="button"
                className={`px-3 py-1 rounded-t-lg border-b-2 ${activeSection === idx ? 'bg-emerald-300 text-gray-900 border-emerald-300' : 'bg-gray-700 text-gray-300 border-transparent'} transition-colors duration-200`}
                onClick={() => handleTabClick(idx)}
              >
                {section.type === 'content' ? `Content ${Math.floor(idx/2)+1}` : `Code Snippet ${Math.ceil(idx/2)}`}
              </button>
            ))}
          </div>
          <div className="mb-2">
            {sections[activeSection].type === 'content' ? (
              <textarea
                value={sections[activeSection].value}
                onChange={e => handleSectionChange(activeSection, e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-300 resize-y"
                placeholder="Write your blog content here... (Markdown supported)"
              />
            ) : (
              <textarea
                value={sections[activeSection].value}
                onChange={e => handleSectionChange(activeSection, e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-emerald-300 font-mono focus:outline-none focus:border-emerald-300 transition-colors duration-300 resize-y"
                placeholder="Paste your code snippet here..."
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleAddCodeSnippet}
            className="mb-2 px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors duration-200"
          >
            + Add Code Snippet
          </button>
          {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors duration-300 ${
              formData.featured 
                ? 'bg-emerald-300 border-emerald-300' 
                : 'border-gray-600'
            }`}>
              {formData.featured && (
                <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-gray-300">Featured Post</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors duration-300 ${
              formData.published 
                ? 'bg-emerald-300 border-emerald-300' 
                : 'border-gray-600'
            }`}>
              {formData.published && (
                <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-gray-300">Publish Immediately</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-emerald-300 text-gray-900 font-medium rounded-lg hover:bg-emerald-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-300 inline-flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Saving...' : submitText}
          </button>
        </div>
      </div>
    </motion.form>
  );
};

export default BlogForm;

import React, { useState } from 'react';
import {  Image } from 'lucide-react';
import SideBar from '../SideBar.jsx';

const CreateArticle = () => {
  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Select category');
  const [tags, setTags] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAsDraft = () => {
    console.log('Save as draft');
  };

  const handleSaveAndPublish = () => {
    console.log('Save and publish');
  };

  return (
    <div className="min-h-screen ml-[280px] bg-gray-50">
        <SideBar />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-semibold text-gray-800">Create article</h1>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveAsDraft}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              Save as draft
            </button>
            <button 
              onClick={handleSaveAndPublish}
              className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
            >
              Save and publish
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Thumbnail Image */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg">
            <div className="text-xs text-gray-500 mb-2 px-4 pt-3">Thumbnail Image</div>
            <div className="p-4">
              {thumbnailPreview ? (
                <div className="relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => setThumbnailPreview(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg h-48 flex flex-col items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400 mb-4" />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Upload thumbnail image
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
            <label className="text-xs text-gray-500 mb-2 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Select category</option>
              <option>Cat</option>
              <option>General</option>
              <option>Inspiration</option>
            </select>
          </div>

          {/* Tags */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
            <label className="text-xs text-gray-500 mb-2 block">Tags</label>
            <input
              type="text"
              placeholder="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Article Title */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
            <label className="text-xs text-gray-500 mb-2 block">Article title</label>
            <input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Introduction */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
            <label className="text-xs text-gray-500 mb-2 block">Introduction (max 150 letters)</label>
            <textarea
              placeholder="Introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              maxLength={150}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {introduction.length}/150
            </div>
          </div>

          {/* Content */}
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
            <label className="text-xs text-gray-500 mb-2 block">Content</label>
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
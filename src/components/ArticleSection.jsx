import React from 'react';

const ArticleSection = () => {
  return (
    <div className='flex flex-col gap-6 px-4 md:px-15'>
      <div className='font-Poppins font-semibold text-2xl leading-8 text-gray-800'>
        <h3>Latest articles</h3>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between w-full mx-auto p-4 px-16 rounded-lg bg-stone-100 shadow-sm">
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 hover:bg-gray-200 focus:bg-gray-300 text-gray-700 rounded-lg font-medium">Highlight</button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 focus:bg-gray-300 rounded-lg transition-colors">Cat</button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 focus:bg-gray-300 rounded-lg transition-colors">Inspiration</button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-200 focus:bg-gray-300 rounded-lg transition-colors">General</button>
        </div>
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search" 
                className="w-64 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-4 w-full mx-auto p-4 rounded-lg bg-stone-100 shadow-sm">
        <div className="relative">
          <input 
              type="text" 
              placeholder="Search" 
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex flex-col space-y-2 ">
          <label className="text-gray-600 text-sm font-medium font-Poppins ">Category</label>
          <div className="relative">
            <select className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option>Highlight</option>
              <option>Cat</option>
              <option>Inspiration</option>
              <option>General</option>
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleSection
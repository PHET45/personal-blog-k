import React, { useState } from 'react'
import { Image } from 'lucide-react'
import SideBar from '../SideBar.jsx'

const CreateArticle = () => {
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Select category')
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setThumbnailPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAsDraft = () => {
    console.log('Save as draft')
  }

  const handleSaveAndPublish = () => {
    console.log('Save and publish')
  }

  return (
    <div className="min-h-screen ml-[280px] bg-[#F9F8F6]">
      <SideBar />

      {/* Header */}

      <div className="flex justify-between items-center px-15 border-b-1 border-stone-200 h-[96px]">
        <h1 className="text-2xl font-semibold text-gray-800">Create article</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveAsDraft}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors hover:cursor-pointer"
          >
            Save as draft
          </button>
          <button
            onClick={handleSaveAndPublish}
            className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors hover:cursor-pointer"
          >
            Save and publish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-15 w-full">
        <div className="space-y-6">
          {/* Thumbnail Image */}
          <div className="bg-[#F9F8F6] w-[771px] h-[300px] flex items-end gap-x-10">
            <div className="flex flex-col">
              <div className="h-[40px] font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
                Thumbnail Image
              </div>
              <div
                className="bg-[#EFEEEB] w-[460px] h-[260px] flex flex-col items-center justify-center rounded-lg shadow-sm border border-[#DAD6D1] border-dashed cursor-pointer"
                onClick={() =>
                  document.getElementById('thumbnailInput').click()
                } // คลิกกล่องเลือกไฟล์
              >
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-[771px] h-[260px] object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation() // ป้องกันไม่ให้ trigger เลือกไฟล์
                        setThumbnailPreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg h-48 flex flex-col items-center justify-center ">
                    <Image
                      className="w-12 h-12 text-gray-400 mb-4"
                      onClick={(e) => {
                        e.stopPropagation() // ป้องกัน parent onClick
                        document.getElementById('thumbnailInput').click()
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <label className="cursor-pointer">
              <input
                id="thumbnailInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors hover:cursor-pointer"
                onClick={() =>
                  document.getElementById('thumbnailInput').click()
                }
              >
                Upload thumbnail image
              </button>
            </label>
          </div>

          {/* Category */}
          <div className="rounded-lg  w-[480px] h-[76px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Category
            </label>
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
          {/*Author name*/ }
          <div className='flex flex-col w-[480px] h-[76px]'>
                <div className='font-poppins font-medium text-[#75716B] leading-6 tracking-normal'>Author name</div>
                <input className='file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex  w-full min-w-0 bg-[#EFEEEB] text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  border rounded-md px-3 py-2 border-gray-300 text-black placeholder-gray-400 h-[48px]'></input>
          </div>
         

          {/* Article Title */}
          <div className=" w-[1,040px] h-[76px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Title
            </label>
            <input
              type="text"
              placeholder="Article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border-gray-200 bg-white rounded-lg focus:outline-none  "
            />
          </div>

          {/* Introduction */}
          <div className="flex flex-col w-[1,040px] h-[171px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">
              Introduction (max 120 letters)
            </label>
            <textarea
              placeholder="Introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              maxLength={150}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {introduction.length}/120
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col w-[1,040px] h-[600px]">
            <label className="font-poppins font-medium text-[#75716B] leading-6 tracking-normal">Content</label>
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
  )
}

export default CreateArticle

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    const getPageNumbers = () => {
      const pages = []
      const maxVisible = 5 // จำนวนหน้าที่แสดงสูงสุด
  
      if (totalPages <= maxVisible) {
        // ถ้าหน้าน้อย แสดงทั้งหมด
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // แสดงแบบมี ellipsis
        if (currentPage <= 3) {
          // อยู่ช่วงต้น
          pages.push(1, 2, 3, 4, '...', totalPages)
        } else if (currentPage >= totalPages - 2) {
          // อยู่ช่วงท้าย
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
          // อยู่ตรงกลาง
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
        }
      }
  
      return pages
    }
  
    const handlePageClick = (page) => {
      if (page !== '...' && page !== currentPage && !isLoading) {
        onPageChange(page)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  
    if (totalPages <= 1) return null
  
    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
  
        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page === '...' || isLoading}
            className={`
              min-w-[40px] px-3 py-2 rounded-lg border transition-all
              ${
                page === currentPage
                  ? 'bg-black text-white border-black font-semibold'
                  : page === '...'
                  ? 'border-transparent cursor-default'
                  : 'border-gray-300 hover:bg-gray-100'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {page}
          </button>
        ))}
  
        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    )
  }
  
  export default Pagination
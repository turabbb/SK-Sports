import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 5 
}) => {
  
  // Calculate which pages to show
  const getVisiblePages = () => {
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      const start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2));
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className='mt-8 sm:mt-10 flex justify-center items-center gap-1 sm:gap-2 flex-wrap'>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-sm sm:text-base font-medium
          ${currentPage === 1 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary shadow-sm'
          }`}
        disabled={currentPage === 1}
      >
        <span className='hidden sm:inline'>Previous</span>
        <span className='sm:hidden'>←</span>
      </button>

      {/* Page Numbers */}
      <div className='flex gap-1 sm:gap-2 mx-2'>
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className='px-2 py-2 text-gray-500 text-sm sm:text-base'>...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 text-sm sm:text-base font-medium border
                  ${currentPage === page
                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 shadow-sm'
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-sm sm:text-base font-medium
          ${currentPage === totalPages 
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary shadow-sm'
          }`}
        disabled={currentPage === totalPages}
      >
        <span className='hidden sm:inline'>Next</span>
        <span className='sm:hidden'>→</span>
      </button>

      {/* Quick Jump to Last Page (for large page counts) */}
      {totalPages > 10 && currentPage < totalPages - 5 && (
        <>
          <span className='text-gray-400 mx-2'>|</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className='px-2 sm:px-3 py-2 rounded-lg border bg-white text-gray-600 border-gray-300 hover:bg-gray-50 transition-all duration-300 text-xs sm:text-sm'
          >
            Last ({totalPages})
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
import { Button, Typography } from '@acid-info/lsd-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  showingText: string
  previousText: string
  nextText: string
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showingText,
  previousText,
  nextText,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const start = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="border-primary border-t px-4 py-4 sm:px-6">
      <div className="flex flex-col items-center gap-3 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Typography variant="body2" className="text-center text-xs sm:text-left sm:text-sm">
          {showingText
            .replace('{start}', start.toString())
            .replace('{end}', end.toString())
            .replace('{total}', totalItems.toString())}
        </Typography>
        <div className="flex w-full flex-col items-center space-y-3 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="flex items-center justify-center gap-2 sm:hidden">
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="!h-9 !px-3 !text-sm"
            >
              {previousText}
            </Button>
            <span className="px-3 py-2 text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="!h-9 !px-3 !text-sm"
            >
              {nextText}
            </Button>
          </div>

          <div className="hidden sm:flex sm:flex-row sm:space-x-2">
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="!h-10"
            >
              {previousText}
            </Button>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1
                const isCurrentPage = pageNum === currentPage
                const isNearCurrent = Math.abs(pageNum - currentPage) <= 2
                const isFirstOrLast = pageNum === 1 || pageNum === totalPages

                if (isFirstOrLast || isNearCurrent) {
                  return (
                    <Button
                      key={pageNum}
                      variant={isCurrentPage ? 'filled' : 'outlined'}
                      onClick={() => onPageChange(pageNum)}
                      className="!h-10 !w-10 !p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return (
                    <span key={pageNum} className="px-2 py-2">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>
            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="!h-10"
            >
              {nextText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

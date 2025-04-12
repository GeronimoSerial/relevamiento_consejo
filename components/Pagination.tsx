"use client"

import { memo } from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
}

// Optimizado con memo para evitar re-renders innecesarios
const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Mostrar un número limitado de páginas para mejorar la UX con muchas páginas
  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Siempre mostrar la primera página
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:border-verde hover:text-verde transition-colors"
        >
          1
        </button>,
      )

      // Mostrar elipsis si hay páginas ocultas
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        )
      }
    }

    // Páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            i === currentPage
              ? "bg-verde text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:border-verde hover:text-verde"
          } transition-colors`}
        >
          {i}
        </button>,
      )
    }

    // Siempre mostrar la última página
    if (endPage < totalPages) {
      // Mostrar elipsis si hay páginas ocultas
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:border-verde hover:text-verde transition-colors"
        >
          {totalPages}
        </button>,
      )
    }

    return pageNumbers
  }

  return (
    <div className="flex justify-center mt-8 items-center flex-wrap gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-verde hover:text-verde transition-colors"
      >
        Anterior
      </button>

      <div className="flex items-center space-x-1 mx-2">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-verde hover:text-verde transition-colors"
      >
        Siguiente
      </button>
    </div>
  )
})

export default Pagination

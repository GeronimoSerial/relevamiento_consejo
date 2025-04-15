"use client"

import { memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
          aria-label="Ir a la página 1"
        >
          1
        </button>,
      )

      // Mostrar elipsis si hay páginas ocultas
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="px-2" aria-hidden="true">
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
          aria-label={`Ir a la página ${i}`}
          aria-current={i === currentPage ? "page" : undefined}
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
          <span key="ellipsis2" className="px-2" aria-hidden="true">
            ...
          </span>,
        )
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:border-verde hover:text-verde transition-colors"
          aria-label={`Ir a la página ${totalPages}`}
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
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-verde hover:text-verde transition-colors flex items-center"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Anterior
      </button>

      <div className="flex items-center space-x-1 mx-2" role="navigation" aria-label="Paginación">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-verde hover:text-verde transition-colors flex items-center"
        aria-label="Página siguiente"
      >
        Siguiente
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  )
})

export default Pagination

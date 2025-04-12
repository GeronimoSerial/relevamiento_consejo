"use client"

import { Search } from "lucide-react"

interface NoResultsProps {
  searchTerm: string
  onReset: () => void
}

export default function NoResults({ searchTerm, onReset }: NoResultsProps) {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-xl p-8 mt-4">
      <div className="text-gray-400 mb-3">
        <Search className="h-12 w-12 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron escuelas</h3>
      <p className="text-gray-600 mb-4">
        No hay resultados para "<span className="font-medium">{searchTerm}</span>".
      </p>
      <p className="text-gray-500 text-sm mb-4">Intente con otros términos o verifique la ortografía.</p>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-verde text-white rounded-lg hover:bg-verde/90 transition-colors"
      >
        Ver todas las escuelas
      </button>
    </div>
  )
}

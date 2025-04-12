"use client"

import { memo, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (term: string) => void
  initialTerm?: string
}

// Optimizado con memo y debounce para evitar búsquedas excesivas
const SearchBar = memo(function SearchBar({ onSearch, initialTerm = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm)
  const [isFocused, setIsFocused] = useState(false)

  // Implementar debounce para evitar búsquedas excesivas mientras el usuario escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300) // 300ms de retraso

    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

  // Limpiar el campo de búsqueda
  const handleClear = useCallback(() => {
    setSearchTerm("")
    onSearch("")
  }, [onSearch])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-2xl mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className={`h-5 w-5 ${isFocused ? "text-verde" : "text-gray-500"} transition-colors`} />
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre, CUE, director, localidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 pl-12 pr-10 rounded-2xl border ${
            isFocused ? "border-verde ring-2 ring-verde/20" : "border-gray-300"
          } focus:outline-none focus:ring-2 ring-verde focus:border-transparent text-gray-700 placeholder-gray-500 shadow-md transition-all`}
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-xs text-gray-500">Busque por nombre, CUE, director, localidad o departamento</p>

        {searchTerm && <p className="text-xs text-verde font-medium">Buscando: "{searchTerm}"</p>}
      </div>
    </motion.div>
  )
})

export default SearchBar

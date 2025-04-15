"use client"

import { memo, useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, X, UserCheck, Info, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/escuela"

interface SearchBarProps {
  onSearch: (term: string) => void
  onSupervisorChange: (supervisor: string) => void
  initialTerm?: string
  initialSupervisor?: string
  isLoading?: boolean
  error?: string | null
}

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Optimizado con memo y debounce para evitar búsquedas excesivas
const SearchBar = memo(function SearchBar({
  onSearch,
  onSupervisorChange,
  initialTerm = "",
  initialSupervisor = "",
  isLoading = false,
  error = null,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm)
  const [supervisor, setSupervisor] = useState(initialSupervisor)
  const [isFocused, setIsFocused] = useState(false)
  
  // Usar el hook de debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Memoizar la lista de supervisores ordenada
  const sortedSupervisors = useMemo(() => [...todosSupervisores].sort(), [])

  useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  // Manejar cambio de supervisor
  const handleSupervisorChange = useCallback(
    (value: string) => {
      const newValue = value === "all" ? "" : value
      setSupervisor(newValue)
      onSupervisorChange(newValue)
    },
    [onSupervisorChange],
  )

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
      className="max-w-2xl mx-auto space-y-4"
    >
      {/* Mensaje de error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 p-3 rounded-lg border border-red-200"
        >
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Campo de búsqueda por texto */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-verde animate-spin" />
          ) : (
            <Search className={`h-5 w-5 ${isFocused ? "text-verde" : "text-gray-500"} transition-colors`} />
          )}
        </div>

        <input
          type="text"
          aria-label="Buscar escuelas"
          placeholder="Buscar por nombre, CUE, director, localidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClear()
            }
          }}
          disabled={isLoading}
          className={`w-full px-4 py-3 pl-12 pr-10 rounded-2xl border ${
            isFocused ? "border-verde ring-2 ring-verde/20" : "border-gray-300"
          } focus:outline-none focus:ring-2 ring-verde focus:border-transparent text-gray-700 placeholder-gray-500 shadow-md transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        {searchTerm && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filtro por supervisor */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-gray-500" />
          <Select value={supervisor} onValueChange={handleSupervisorChange} disabled={isLoading}>
            <SelectTrigger className={`w-full bg-white border-gray-300 rounded-xl shadow-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}>
              <SelectValue placeholder="Filtrar por supervisor" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todos los supervisores</SelectItem>
              {sortedSupervisors.map((supervisor) => (
                <SelectItem key={supervisor} value={supervisor}>
                  {supervisor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mensaje de información */}
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <Info className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
          <p className="text-xs text-amber-800">
            La funcionalidad de filtrado por supervisores (En todas las secciones) está en proceso y se irá corrigiendo a medida que los datos sean cargados.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-xs text-gray-500">Busque por nombre, CUE, director, localidad o supervisor</p>

        {(searchTerm || supervisor) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && <p className="text-xs text-verde font-medium">Texto: "{searchTerm}"</p>}
            {supervisor && <p className="text-xs text-verde font-medium">Supervisor: {supervisor}</p>}
          </div>
        )}
      </div>
    </motion.div>
  )
})

export default SearchBar

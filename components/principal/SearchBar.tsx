/* eslint-disable react/react-in-jsx-scope */
"use client"

import { memo, useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, X, UserCheck, Info, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/iEscuela"

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
      className="max-w-4xl mx-auto space-y-4"
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

      {/* Contenedor de búsqueda y filtro */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Campo de búsqueda por texto */}
        <div className="relative w-full sm:flex-1">
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
            className={`w-full h-12 px-4 pl-12 pr-10 rounded-2xl border ${
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
        <div className="w-full sm:w-64">
          <Select 
            value={supervisor} 
            onValueChange={handleSupervisorChange} 
            disabled={isLoading}
            aria-label="Filtrar por supervisor"
          >
            <SelectTrigger 
              className={`h-12 w-full bg-white border-gray-300 rounded-xl shadow-md transition-all duration-200
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                hover:border-verde hover:ring-2 hover:ring-verde/20
                focus:border-verde focus:ring-2 focus:ring-verde/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde/20
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300
              `}
              aria-disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-gray-600" aria-hidden="true" />
                <SelectValue placeholder="Filtrar por supervisor" />
              </div>
            </SelectTrigger>
            <SelectContent 
              className="bg-white border-gray-200 shadow-lg rounded-xl"
              position="popper"
            >
              <SelectItem 
                value="all"
                aria-label="Todos los supervisores"
                className="focus:bg-verde/10 focus:text-verde data-[state=checked]:bg-verde/10 data-[state=checked]:text-verde"
              >
                Todos los supervisores
              </SelectItem>
              {sortedSupervisors.map((supervisor) => (
                <SelectItem 
                  key={supervisor} 
                  value={supervisor}
                  aria-label={`Supervisor ${supervisor}`}
                  className="focus:bg-verde/10 focus:text-verde data-[state=checked]:bg-verde/10 data-[state=checked]:text-verde"
                >
                  {supervisor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mensaje de información */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 bg-amber-50 p-2 sm:p-3 rounded-lg border border-amber-200 text-xs text-amber-800 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
        <span>
          La funcionalidad de filtrado por supervisores (En todas las secciones) está en proceso y se irá corrigiendo a medida que los datos sean cargados.
        </span>
      </motion.div>

      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-xs text-gray-500">Busque por nombre, CUE, director, localidad o supervisor</p>

        {(searchTerm || supervisor) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && <p className="text-xs text-verde font-medium">Texto: &quot;{searchTerm}&quot;</p>}
            {supervisor && <p className="text-xs text-verde font-medium">Supervisor: {supervisor}</p>}
          </div>
        )}
      </div>
    </motion.div>
  )
})

export default SearchBar

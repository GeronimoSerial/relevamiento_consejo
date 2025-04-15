"use client"

import { memo, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X, UserCheck, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/escuela"

interface SearchBarProps {
  onSearch: (term: string) => void
  onSupervisorChange: (supervisor: string) => void
  initialTerm?: string
  initialSupervisor?: string
}

// Optimizado con memo y debounce para evitar búsquedas excesivas
const SearchBar = memo(function SearchBar({
  onSearch,
  onSupervisorChange,
  initialTerm = "",
  initialSupervisor = "",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm)
  const [supervisor, setSupervisor] = useState(initialSupervisor)
  const [isFocused, setIsFocused] = useState(false)

  // Implementar debounce para evitar búsquedas excesivas mientras el usuario escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300) // 300ms de retraso

    return () => clearTimeout(timer)
  }, [searchTerm, onSearch])

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
      {/* Campo de búsqueda por texto */}
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

      {/* Filtro por supervisor */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-gray-500" />
          <Select value={supervisor} onValueChange={handleSupervisorChange}>
            <SelectTrigger className="w-full bg-white border-gray-300 rounded-xl shadow-md">
              <SelectValue placeholder="Filtrar por supervisor" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Todos los supervisores</SelectItem>
              {todosSupervisores.sort().map((supervisor) => (
                <SelectItem key={supervisor} value={supervisor}>
                  {supervisor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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

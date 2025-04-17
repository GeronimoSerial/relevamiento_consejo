"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import SearchBar from "@/components/principal/SearchBar"
import SchoolCard from "@/components/principal/SchoolCard"
import Pagination from "@/components/principal/Pagination"
import NoResults from "@/components/NoResults"
import { filtrarEscuelas, paginarEscuelas } from "@/lib/escuelas"
import type { Escuela } from "@/types/iEscuela"

// Importar el modal de forma dinámica para reducir el bundle inicial
const SchoolModal = dynamic(() => import("@/components/principal/SchoolModal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">Cargando detalles...</div>
    </div>
  ),
  ssr: false, // No necesitamos SSR para el modal
})

interface EscuelasClientProps {
  initialEscuelas: Escuela[]
}

export default function EscuelasClient({ initialEscuelas }: EscuelasClientProps) {
  const searchParams = useSearchParams()

  // Obtener parámetros de URL
  const initialSearchTerm = searchParams.get("q") || ""
  const initialSupervisor = searchParams.get("supervisor") || ""
  const initialPage = Number.parseInt(searchParams.get("page") || "1", 10)

  const [escuelas] = useState<Escuela[]>(initialEscuelas)
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [supervisor, setSupervisor] = useState(initialSupervisor)
  const [selectedEscuela, setSelectedEscuela] = useState<Escuela | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isSearching, setIsSearching] = useState(false)
  const itemsPerPage = 6 // Cambiado de 5 a 6 escuelas por página

  // Actualizar la URL cuando cambian los filtros o la página
  useEffect(() => {
    // Crear un nuevo objeto URLSearchParams
    const params = new URLSearchParams()

    // Añadir parámetros solo si tienen valor
    if (searchTerm) params.set("q", searchTerm)
    if (supervisor) params.set("supervisor", supervisor)
    if (currentPage > 1) params.set("page", currentPage.toString())

    // Actualizar la URL sin recargar la página
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
    window.history.replaceState({}, "", newUrl)
  }, [searchTerm, supervisor, currentPage])

  // Filtrar escuelas con useMemo para evitar recálculos innecesarios
  const filteredEscuelas = useMemo(() => {
    return filtrarEscuelas(escuelas, searchTerm, supervisor)
  }, [escuelas, searchTerm, supervisor])

  // Añadir este useEffect después de la definición de filteredEscuelas
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, supervisor])

  // Paginación con useMemo
  const { escuelasPaginadas, totalPaginas } = useMemo(
    () => paginarEscuelas(filteredEscuelas, currentPage, itemsPerPage),
    [filteredEscuelas, currentPage, itemsPerPage],
  )

  // Resetear la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, supervisor])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSupervisorChange = useCallback((value: string) => {
    setSupervisor(value)
  }, [])

  const handleOpenModal = useCallback((escuela: Escuela) => {
    setSelectedEscuela(escuela)
    setIsModalOpen(true)
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden"
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedEscuela(null)
    // Restaurar scroll del body
    document.body.style.overflow = "auto"
  }, [])

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll al inicio para mejor UX
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleReset = useCallback(() => {
    setSearchTerm("")
    setSupervisor("")
    setCurrentPage(1)
  }, [])

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SearchBar
          onSearch={handleSearch}
          onSupervisorChange={handleSupervisorChange}
          initialTerm={searchTerm}
          initialSupervisor={supervisor}
        />

        {/* Información de resultados */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-gray-600">
            {isSearching ? (
              <p>Buscando...</p>
            ) : searchTerm || supervisor ? (
              <p>
                Se encontraron <span className="font-semibold text-verde">{filteredEscuelas.length}</span> resultados
                {searchTerm && (
                  <span>
                    {" "}
                    para "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
                {supervisor && (
                  <span>
                    {" "}
                    con supervisor <span className="font-medium">{supervisor}</span>
                  </span>
                )}
              </p>
            ) : (
              <p>Mostrando todas las escuelas ({escuelas.length})</p>
            )}
          </div>
        </div>

        {filteredEscuelas.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {escuelasPaginadas.map((escuela, index) => (
                <motion.div
                  key={`${escuela.cue}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
                >
                  <SchoolCard escuela={escuela} onVerMas={() => handleOpenModal(escuela)} />
                </motion.div>
              ))}
            </motion.div>

            <Pagination currentPage={currentPage} totalPages={totalPaginas} onPageChange={handlePageChange} />

            {/* Información de paginación */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredEscuelas.length)} de {filteredEscuelas.length} escuelas
              </p>
            </div>
          </>
        ) : (
          <NoResults searchTerm={searchTerm} supervisor={supervisor} onReset={handleReset} />
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedEscuela && <SchoolModal escuela={selectedEscuela} onClose={handleCloseModal} />}
      </AnimatePresence>
    </>
  )
}

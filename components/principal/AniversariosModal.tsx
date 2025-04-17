"use client"

import { memo, useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, PartyPopper, Calendar } from "lucide-react"
import { getAllEscuelas } from "@/lib/escuelas"
import type { Escuela } from "@/types/iEscuela"

interface AniversariosModalProps {
  onClose: () => void
}

// Función para calcular los años desde la fundación
function calcularAniosFundacion(fechaFundacion: string): number {
  const fundacion = new Date(fechaFundacion)
  const hoy = new Date()
  let anios = hoy.getFullYear() - fundacion.getFullYear()
  const mesActual = hoy.getMonth()
  const mesFundacion = fundacion.getMonth()
  
  if (mesActual < mesFundacion || (mesActual === mesFundacion && hoy.getDate() < fundacion.getDate())) {
    anios--
  }
  
  return anios
}

// Función para formatear la fecha
function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Función para obtener las escuelas que cumplen aniversario hoy
function obtenerEscuelasAniversario(escuelas: Escuela[]): Escuela[] {
  const hoy = new Date()
  const diaHoy = hoy.getDate()
  const mesHoy = hoy.getMonth() + 1 // Los meses en JS van de 0 a 11

  // Primero filtramos las escuelas que cumplen aniversario hoy y coinciden en años
  const escuelasHoy = escuelas.filter(escuela => {
    const [mes, dia, anio] = escuela.fechaFundacion.split('/').map(Number)
    const anioFundacion2 = escuela.fechaFundacion2
    
    // Verificamos que coincidan el día y mes actual, y que los años sean iguales
    return dia === diaHoy && 
           mes === mesHoy && 
           anio === anioFundacion2
  })

  // Luego eliminamos duplicados basándonos en CUE y nombre
  const escuelasUnicas = escuelasHoy.reduce((acc, escuela) => {
    const key = `${escuela.cue}-${escuela.nombre}`
    if (!acc.has(key)) {
      acc.set(key, escuela)
    }
    return acc
  }, new Map())

  return Array.from(escuelasUnicas.values())
}

const AniversariosModal = memo(function AniversariosModal({ onClose }: AniversariosModalProps) {
  const [escuelasAniversario, setEscuelasAniversario] = useState<Escuela[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleOpen = async () => {
    setIsLoading(true)
    try {
      // Simulamos una pequeña demora para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 500))
      const escuelasHoy = obtenerEscuelasAniversario(getAllEscuelas())
      // Cargamos las escuelas que cumplen aniversario hoy
      setEscuelasAniversario(escuelasHoy)
    } catch (error) {
      console.error("Error al cargar aniversarios:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar los datos cuando se abre el modal
  useEffect(() => {
    handleOpen()
  }, [])

  // Manejar clic fuera del modal y tecla Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Barra de estado fija */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-verde" />
            <h2 className="text-xl font-semibold text-gray-800">Aniversarios de hoy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde"></div>
            </div>
          ) : escuelasAniversario.length > 0 ? (
            <div className="space-y-4">
              {escuelasAniversario.map((escuela) => {
                const anios = calcularAniosFundacion(escuela.fechaFundacion)
                const key = `${escuela.cue}-${escuela.nombre}`
                return (
                  <div
                    key={key}
                    className="p-4 bg-verde/5 rounded-lg border border-verde/10"
                  >
                    <h3 className="font-medium text-gray-800">{escuela.nombre}</h3>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p><b>CUE</b>: {escuela.cue}</p>

                      <p><b>Departamento</b>: {escuela.departamento}</p>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-verde/10">
                        <Calendar className="h-4 w-4 text-verde" />
                        <div>
                          <p className="font-medium text-verde">Fecha de fundación:</p>
                          <p>{formatearFecha(escuela.fechaFundacion)}</p>
                          <p className="mt-1 font-medium text-verde">
                            ¡Cumple {anios} {anios === 1 ? 'año' : 'años'}!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay escuelas que cumplan aniversario hoy
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
})

export default AniversariosModal 
"use client"

import { memo, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { Escuela } from "@/types/iEscuela"
import { supervisoresPorDepartamento } from "@/types/iEscuela"

interface SchoolModalProps {
  escuela: Escuela
  onClose: () => void
}

const SchoolModal = memo(function SchoolModal({ escuela, onClose }: SchoolModalProps) {
  // Función para renderizar un campo con su valor (si existe)
  const renderField = useCallback((label: string, value: any) => {
    if (value === undefined || value === null || value === "") return null

    // Para valores booleanos
    if (typeof value === "boolean") {
      value = value ? "Sí" : "No"
    }

    return (
      <div className="py-2 border-b border-gray-100">
        <span className="font-medium text-gray-700">{label}:</span> <span className="text-gray-800">{value}</span>
      </div>
    )
  }, [])

  // Obtener los supervisores del departamento
  const getSupervisores = () => {
    return supervisoresPorDepartamento[escuela.departamento.trim()] || []
  }

  const supervisores = getSupervisores()

  // Agrupar campos por secciones
  const secciones = useMemo(
    () => ({
      "Información General": [
        { label: "CUE", value: escuela.cue },
        { label: "Categoría", value: escuela.categoria },
        { label: "Director/a", value: escuela.director },
        { label: "Zona", value: escuela.zona },
        { label: "Situación de Revista", value: escuela.situacionRevistaDirector},
        { label: "Supervisor/a", value: supervisores.join(", ") },
        { label: "Fecha de fundación", value: escuela.fechaFundacion },
        { label: "Es centenaria", value: escuela.esCentenaria },
        { label: "Tipo de escuela", value: escuela.tipoEscuela },
      ],
      "Contacto y Ubicación": [
        { label: "Teléfono", value: escuela.telefono },
        { label: "Correo", value: escuela.mail },
        { label: "Departamento", value: escuela.departamento },
        { label: "Localidad", value: escuela.localidad },
        { label: "Ubicación", value: escuela.ubicacion },
      ],
      Organización: [
        { label: "Turno", value: escuela.turno },
        { label: "Cabecera", value: escuela.cabecera },
        { label: "Matrícula 2025", value: escuela.matricula2025 },
        { label: "Matrícula 2024", value: escuela.matricula2024 },
      ],
      Infraestructura: [
        { label: "Comparte edificio", value: escuela.comparteEdificio },
        { label: "Tiene edificio propio", value: escuela.tieneEdificioPropio },
        { label: "Empresa de limpieza", value: escuela.empresaLimpieza },
        { label: "Conexión a internet", value: escuela.conexionInternet },
      ],
      Personal: [
        { label: "Cantidad docentes de grado", value: escuela.cantidadDocenGrado },
        { label: "Cantidad docentes doble turno", value: escuela.cantidadDocenDobleTurno },
        { label: "Tiene profesionales de salud", value: escuela.tieneProfesionalesSalud },
        { label: "Docentes especiales", value: escuela.DocenEspeciales },
        { label: "Cantidad administrativos", value: escuela.cantidadAdministrativos },
        { label: "Cantidad porteros", value: escuela.cantidadPorteros },
      ],
      "Programas y Servicios": [
        { label: "Tiene copa de leche/almuerzo", value: escuela.tieneCopaLecheAlmuerzo },
        { label: "Programas de acompañamiento", value: escuela.programasAcompañamiento },
        { label: "Problemáticas", value: escuela.problematicas },
      ],
    }),
    [escuela, supervisores],
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-verde/5">
          <h2 className="text-xl font-bold text-gray-800">{escuela.nombre}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 ring-verde"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {Object.entries(secciones).map(([seccion, campos]) => {
            // Filtrar campos que tienen valor
            const camposConValor = campos.filter(
              (campo) => campo.value !== undefined && campo.value !== null && campo.value !== "",
            )

            // Solo mostrar secciones que tienen al menos un campo con valor
            if (camposConValor.length === 0) return null

            return (
              <div key={seccion} className="mb-6">
                <h3 className="text-lg font-semibold text-verde mb-3 pb-2 border-b border-gray-200">{seccion}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                  {camposConValor.map((campo, index) => (
                    <div key={index}>{renderField(campo.label, campo.value)}</div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-verde text-white rounded-xl hover:bg-verde/90 transition-colors duration-300 font-medium"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
})

export default SchoolModal

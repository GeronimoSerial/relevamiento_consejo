/* eslint-disable react/react-in-jsx-scope */
"use client"

import { memo } from "react"
import { School, User, Users, MapPin, Phone, UserCheck } from "lucide-react"
import type { Escuela } from "@/types/iEscuela"
import { supervisoresPorDepartamento } from "@/types/iEscuela"

interface SchoolCardProps {
  escuela: Escuela
  onVerMas: () => void
}

// Usando memo para evitar re-renders innecesarios cuando las props no cambian
const SchoolCard = memo(function SchoolCard({ escuela, onVerMas }: SchoolCardProps) {
  // Obtener los supervisores del departamento
  const getSupervisores = () => {
    return supervisoresPorDepartamento[escuela.departamento.trim()] || []
  }

  const supervisores = getSupervisores()

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover h-full border border-verde/20">
      <div className="p-5 flex flex-col h-full">
        <div className="border-l-4 border-verde pl-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{escuela.nombre}</h2>
        </div>

        <div className="space-y-3 text-sm text-gray-700 flex-grow">
          <div className="flex items-start">
            <School className="h-4 w-4 text-verde mr-2 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-medium">CUE:</span> {escuela.cue}
            </p>
          </div>

          <div className="flex items-start">
            <User className="h-4 w-4 text-verde mr-2 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-medium">Director/a:</span> {escuela.director}
            </p>
          </div>

          {escuela.telefono && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 text-verde mr-2 mt-0.5 flex-shrink-0" />
              <p>
                <span className="font-medium">Teléfono:</span> {escuela.telefono}
              </p>
            </div>
          )}

          <div className="flex items-start">
            <Users className="h-4 w-4 text-verde mr-2 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-medium">Matrícula 2025:</span> {escuela.matricula2025}
            </p>
          </div>

          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-verde mr-2 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-medium">Ubicación:</span> {escuela.departamento}, {escuela.localidad}
            </p>
          </div>
          {supervisores.length > 0 && (
            <div className="flex items-start">
              <UserCheck className="h-4 w-4 text-verde mr-2 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">
                <span className="font-medium">Supervisor/a:</span> {supervisores.join(", ")}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onVerMas}
            className="px-4 py-2 bg-verde text-white rounded-xl hover:bg-verde/90 transition-colors duration-300 text-sm font-medium shadow-sm"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  )
})

export default SchoolCard

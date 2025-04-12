import { NextResponse } from "next/server"
import escuelasData from "@/data/escuelas.json"
import type { Escuela } from "@/types/escuela"
import { normalizarTexto } from "@/lib/escuelas"

// Esta API route permite obtener las escuelas con paginación y filtrado
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Parámetros de paginación
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const search = searchParams.get("q") || ""

  // Filtrar escuelas si hay término de búsqueda
  let filteredEscuelas: Escuela[] = [...escuelasData]

  if (search) {
    const searchNormalizado = normalizarTexto(search)
    filteredEscuelas = filteredEscuelas.filter((escuela) => {
      // Buscar en múltiples campos para mejorar los resultados
      const nombreNormalizado = normalizarTexto(escuela.nombre)
      const cueString = escuela.cue.toString()
      const directorNormalizado = escuela.director ? normalizarTexto(escuela.director) : ""
      const localidadNormalizada = escuela.localidad ? normalizarTexto(escuela.localidad) : ""
      const departamentoNormalizado = escuela.departamento ? normalizarTexto(escuela.departamento) : ""

      // Verificar si el término de búsqueda está en cualquiera de los campos
      return (
        nombreNormalizado.includes(searchNormalizado) ||
        cueString.includes(searchNormalizado) ||
        directorNormalizado.includes(searchNormalizado) ||
        localidadNormalizada.includes(searchNormalizado) ||
        departamentoNormalizado.includes(searchNormalizado)
      )
    })
  }

  // Calcular paginación
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  // Obtener resultados paginados
  const results = filteredEscuelas.slice(startIndex, endIndex)

  // Información de paginación
  const pagination = {
    total: filteredEscuelas.length,
    pages: Math.ceil(filteredEscuelas.length / limit),
    currentPage: page,
    limit,
  }

  return NextResponse.json({
    success: true,
    pagination,
    data: results,
  })
}

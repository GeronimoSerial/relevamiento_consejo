import type { Escuela } from "@/types/escuela"
import { supervisoresPorDepartamento } from "@/types/escuela"
import escuelasData from "@/data/escuelas.json"

// Función para obtener todas las escuelas (usado en getStaticProps)
export function getAllEscuelas(): Escuela[] {
  // Asignar supervisores a cada escuela basado en su departamento
  const escuelasConSupervisores = escuelasData.map((escuela: Escuela) => {
    // Obtener los supervisores para el departamento de la escuela
    const supervisores = supervisoresPorDepartamento[escuela.departamento] || []

    // Asignar el primer supervisor como supervisor principal (simplificación)
    // En un caso real, esto podría ser más complejo y requerir datos adicionales
    return {
      ...escuela,
      supervisor: supervisores.length > 0 ? supervisores[0] : undefined,
    }
  })

  return escuelasConSupervisores
}

// Función para normalizar texto (eliminar acentos, convertir a minúsculas)
export function normalizarTexto(texto: unknown): string {
  if (texto === null || texto === undefined) return ""
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .trim()
}

// Función mejorada para filtrar escuelas por término de búsqueda y supervisor
export function filtrarEscuelas(escuelas: Escuela[], termino: string, supervisor = ""): Escuela[] {
  let escuelasFiltradas = [...escuelas]

  // Filtrar por término de búsqueda si existe
  if (termino.trim()) {
    const terminoNormalizado = normalizarTexto(termino)

    escuelasFiltradas = escuelasFiltradas.filter((escuela) => {
      // Buscar en múltiples campos para mejorar los resultados
      const nombreNormalizado = normalizarTexto(escuela.nombre)
      const cueString = escuela.cue.toString()
      const directorNormalizado = escuela.director ? normalizarTexto(escuela.director) : ""
      const localidadNormalizada = escuela.localidad ? normalizarTexto(escuela.localidad) : ""
      const departamentoNormalizado = escuela.departamento ? normalizarTexto(escuela.departamento) : ""

      // Verificar si el término de búsqueda está en cualquiera de los campos
      return (
        nombreNormalizado.includes(terminoNormalizado) ||
        cueString.includes(terminoNormalizado) ||
        directorNormalizado.includes(terminoNormalizado) ||
        localidadNormalizada.includes(terminoNormalizado) ||
        departamentoNormalizado.includes(terminoNormalizado)
      )
    })
  }

  // Filtrar por supervisor si se ha seleccionado uno
  if (supervisor) {
    escuelasFiltradas = escuelasFiltradas.filter((escuela) => {
      // Verificar si la escuela tiene el supervisor seleccionado
      // Primero verificamos el supervisor principal
      if (escuela.supervisor === supervisor) {
        return true
      }

      // También verificamos en la lista de supervisores del departamento
      const supervisoresDepartamento = supervisoresPorDepartamento[escuela.departamento] || []
      return supervisoresDepartamento.includes(supervisor)
    })
  }

  return escuelasFiltradas
}

// Función para paginar escuelas
export function paginarEscuelas(
  escuelas: Escuela[],
  pagina: number,
  porPagina: number,
): {
  escuelasPaginadas: Escuela[]
  totalPaginas: number
} {
  const inicio = (pagina - 1) * porPagina
  const fin = pagina * porPagina

  return {
    escuelasPaginadas: escuelas.slice(inicio, fin),
    totalPaginas: Math.ceil(escuelas.length / porPagina),
  }
}

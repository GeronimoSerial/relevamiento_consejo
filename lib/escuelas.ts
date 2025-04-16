import type { Escuela } from "@/types/escuela"
import { supervisoresPorDepartamento } from "@/types/escuela"
import escuelasData from "@/data/escuelas.json"

// Función para obtener todas las escuelas (usado en getStaticProps)
export function getAllEscuelas(): Escuela[] {
  // Asignar supervisores a cada escuela basado en su departamento
  const escuelasConSupervisores = escuelasData.map((escuela: any) => {
    // Normalizar DocenEspeciales
    const escuelaNormalizada = {
      ...escuela,
      DocenEspeciales: escuela.DocenEspeciales === 0 ? "No tiene" : escuela.DocenEspeciales?.toString() || undefined,
    }

    // Obtener los supervisores para el departamento de la escuela
    const supervisores = supervisoresPorDepartamento[escuela.departamento] || []

    // Asignar el primer supervisor como supervisor principal (simplificación)
    // En un caso real, esto podría ser más complejo y requerir datos adicionales
    return {
      ...escuelaNormalizada,
      supervisor: supervisores.length > 0 ? supervisores[0] : undefined,
    }
  })

  return escuelasConSupervisores
}

// Función para normalizar texto (eliminar acentos, convertir a minúsculas, normalizar espacios)
export function normalizarTexto(texto: unknown): string {
  if (texto === null || texto === undefined) return ""
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/\s+/g, " ") // Normalizar espacios múltiples a uno solo
    .trim()
}

// Función mejorada para filtrar escuelas por término de búsqueda y supervisor
export function filtrarEscuelas(escuelas: Escuela[], termino: string, supervisor = ""): Escuela[] {
  let escuelasFiltradas = [...escuelas]

  // Filtrar por término de búsqueda si existe
  if (termino.trim()) {
    const terminoNormalizado = normalizarTexto(termino)
    const terminosBusqueda = terminoNormalizado.split(/\s+/).filter(Boolean) // Dividir en palabras y eliminar vacíos

    escuelasFiltradas = escuelasFiltradas.filter((escuela) => {
      // Normalizar todos los campos de búsqueda
      const nombreNormalizado = normalizarTexto(escuela.nombre)
      const cueString = escuela.cue.toString()
      const directorNormalizado = escuela.director ? normalizarTexto(escuela.director) : ""
      const localidadNormalizada = escuela.localidad ? normalizarTexto(escuela.localidad) : ""
      const departamentoNormalizado = escuela.departamento ? normalizarTexto(escuela.departamento) : ""

      // Verificar si todos los términos de búsqueda están en cualquiera de los campos
      return terminosBusqueda.every(termino => 
        nombreNormalizado.includes(termino) ||
        cueString.includes(termino) ||
        directorNormalizado.includes(termino) ||
        localidadNormalizada.includes(termino) ||
        departamentoNormalizado.includes(termino)
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

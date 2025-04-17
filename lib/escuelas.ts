import type { Escuela } from "@/types/iEscuela"
import { supervisoresPorDepartamento } from "@/types/iEscuela"
import escuelasData from "@/data/escuelas.json"

// Función para obtener todas las escuelas (usado en getStaticProps)
export function getAllEscuelas(): Escuela[] {
  // Asignar supervisores a cada escuela basado en su departamento
  const escuelasConSupervisores = escuelasData.map((escuela) => {
    // Normalizar DocenEspeciales (puede venir como string, number o undefined)
    let docenEspeciales: string | undefined
    if (escuela.DocenEspeciales === 0 || escuela.DocenEspeciales === "0") {
      docenEspeciales = "No tiene"
    } else if (escuela.DocenEspeciales !== undefined && escuela.DocenEspeciales !== null) {
      docenEspeciales = escuela.DocenEspeciales.toString()
    } else {
      docenEspeciales = undefined
    }

    // Normalizar fechaFundacion2 si existe y es string
    let fechaFundacion2: number | undefined = undefined
    if (typeof escuela.fechaFundacion2 === "string") {
      const parsed = parseInt(escuela.fechaFundacion2, 10)
      fechaFundacion2 = isNaN(parsed) ? undefined : parsed
    } else if (typeof escuela.fechaFundacion2 === "number") {
      fechaFundacion2 = escuela.fechaFundacion2
    }

    // Obtener los supervisores para el departamento de la escuela
    const supervisores = supervisoresPorDepartamento[escuela.departamento] || []

    return {
      ...escuela,
      DocenEspeciales: docenEspeciales,
      fechaFundacion2,
      supervisor: supervisores.length > 0 ? supervisores[0] : undefined,
    } as Escuela
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

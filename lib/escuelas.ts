import type { Escuela } from "@/types/escuela"
import escuelasData from "@/data/escuelas.json"

// Función para obtener todas las escuelas (usado en getStaticProps)
export function getAllEscuelas(): Escuela[] {
  return escuelasData
}

// Función para normalizar texto (eliminar acentos, convertir a minúsculas)
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .trim()
}

// Función mejorada para filtrar escuelas por término de búsqueda
export function filtrarEscuelas(escuelas: Escuela[], termino: string): Escuela[] {
  if (!termino.trim()) {
    return escuelas
  }

  const terminoNormalizado = normalizarTexto(termino)

  return escuelas.filter((escuela) => {
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

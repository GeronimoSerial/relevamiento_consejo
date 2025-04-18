import type { Escuela } from "@/types/iEscuela"
import { supervisoresPorDepartamento } from "@/types/iEscuela"
import escuelasData from "@/data/escuelas.json"
import { normalizarTexto } from "@/lib/utils"

/**
 * Función para normalizar texto (eliminar acentos, convertir a minúsculas, normalizar espacios)
 * @param texto Texto a normalizar
 * @returns Texto normalizado
 */


interface GetEscuelasOptions {
  termino?: string
  supervisor?: string
  pagina?: number
  porPagina?: number
}

interface GetEscuelasResult {
  escuelas: Escuela[]
  totalPaginas?: number
  totalEscuelas: number
}

/**
 * Función centralizada para obtener y procesar datos de escuelas
 * @param options Opciones para filtrar y paginar los resultados
 * @returns Objeto con las escuelas procesadas y metadatos
 */
export async function getEscuelas(options: GetEscuelasOptions = {}): Promise<GetEscuelasResult> {
  try {
    console.log("Datos de escuelas cargados:", escuelasData.length)
    // Verificar que los datos de escuelas estén disponibles
    if (!escuelasData || !Array.isArray(escuelasData)) {
      throw new Error("Los datos de escuelas no están disponibles o no tienen el formato correcto")
    }

    // Verificar que los supervisores estén disponibles
    if (!supervisoresPorDepartamento || typeof supervisoresPorDepartamento !== "object") {
      throw new Error("Los datos de supervisores no están disponibles o no tienen el formato correcto")
    }

    // Procesar datos base de escuelas
    const escuelasProcesadas = escuelasData.map((escuela) => {
      try {
        // Normalizar DocenEspeciales
        let docenEspeciales: string | undefined
        if (escuela.DocenEspeciales === 0 || escuela.DocenEspeciales === "0") {
          docenEspeciales = "No tiene"
        } else if (escuela.DocenEspeciales !== undefined && escuela.DocenEspeciales !== null) {
          docenEspeciales = escuela.DocenEspeciales.toString()
        }

        // Normalizar fechaFundacion2
        let fechaFundacion2: number | undefined = undefined
        if (typeof escuela.fechaFundacion2 === "string") {
          const parsed = parseInt(escuela.fechaFundacion2, 10)
          fechaFundacion2 = isNaN(parsed) ? undefined : parsed
        } else if (typeof escuela.fechaFundacion2 === "number") {
          fechaFundacion2 = escuela.fechaFundacion2
        }

        // Asignar supervisor
        const supervisores = supervisoresPorDepartamento[escuela.departamento] || []

        return {
          ...escuela,
          DocenEspeciales: docenEspeciales,
          fechaFundacion2,
          supervisor: supervisores.length > 0 ? supervisores[0] : undefined,
        } as Escuela
      } catch (error) {
        console.error(`Error procesando escuela ${escuela.cue}:`, error)
        throw new Error(`Error procesando escuela ${escuela.cue}: ${error instanceof Error ? error.message : String(error)}`)
      }
    })

    // Aplicar filtros si se especifican
    let escuelasFiltradas = [...escuelasProcesadas]

    if (options.termino && typeof options.termino === 'string' && options.termino.trim()) {
      const terminoNormalizado = normalizarTexto(options.termino)
      const terminosBusqueda = terminoNormalizado.split(/\s+/).filter(Boolean)

      escuelasFiltradas = escuelasFiltradas.filter((escuela) => {
        const nombreNormalizado = normalizarTexto(escuela.nombre)
        const cueString = escuela.cue.toString()
        const directorNormalizado = escuela.director ? normalizarTexto(escuela.director) : ""
        const localidadNormalizada = escuela.localidad ? normalizarTexto(escuela.localidad) : ""
        const departamentoNormalizado = escuela.departamento ? normalizarTexto(escuela.departamento) : ""

        return terminosBusqueda.every(termino =>
          nombreNormalizado.includes(termino) ||
          cueString.includes(termino) ||
          directorNormalizado.includes(termino) ||
          localidadNormalizada.includes(termino) ||
          departamentoNormalizado.includes(termino)
        )
      })
    }

    if (options.supervisor) {
      escuelasFiltradas = escuelasFiltradas.filter((escuela) => {
        if (escuela.supervisor === options.supervisor) {
          return true
        }
        const supervisoresDepartamento = supervisoresPorDepartamento[escuela.departamento] || []
        return supervisoresDepartamento.includes(options.supervisor!)
      })
    }

    // Aplicar paginación si se especifica
    if (options.pagina && options.porPagina) {
      const inicio = (options.pagina - 1) * options.porPagina
      const fin = options.pagina * options.porPagina
      
      return {
        escuelas: escuelasFiltradas.slice(inicio, fin),
        totalPaginas: Math.ceil(escuelasFiltradas.length / options.porPagina),
        totalEscuelas: escuelasFiltradas.length
      }
    }

    return {
      escuelas: escuelasFiltradas,
      totalEscuelas: escuelasFiltradas.length
    }
  } catch (error) {
    console.error("Error al cargar datos de escuelas:", error)
    throw new Error(`Error al cargar datos de escuelas: ${error instanceof Error ? error.message : String(error)}`)
  }
} 
import { supabase } from './supabase'
import type { Escuela } from '@/types/iEscuela'
import { normalizarTexto } from '@/lib/utils'

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

export async function getEscuelasDB(options: GetEscuelasOptions = {}): Promise<GetEscuelasResult> {
  // 1. Traer todas las escuelas (con ids)
  let query = supabase
    .from('escuelas')
    .select('*', { count: 'exact' })
    .order('cue')
    .range(0, 9999)

  const { data, error } = await query
  if (error) {
    throw new Error(`Error al consultar escuelas en Supabase: ${error.message}`)
  }

  // 2. Traer catálogos y tablas relacionadas para mapear ids a nombres/datos
  const [
    localidadesRes, 
    departamentosRes, 
    tiposEscuelaRes, 
    categoriasRes, 
    directoresRes,
    supervisoresRes
  ] = await Promise.all([
    supabase.from('localidades').select('id, nombre, departamento_id'),
    supabase.from('departamentos').select('id, nombre'),
    supabase.from('tipos_escuela').select('id, nombre'),
    supabase.from('categorias').select('id, numero, descripcion'),
    supabase.from('director').select('escuela_id, nombre, telefono, mail, situacion_revista'),
    supabase.from('supervisores').select('id, nombre, telefono, escuela_id')
  ])

  // Verificar errores en las consultas
  const consultasErrores = [
    { nombre: 'localidades', res: localidadesRes },
    { nombre: 'departamentos', res: departamentosRes },
    { nombre: 'tipos_escuela', res: tiposEscuelaRes },
    { nombre: 'categorias', res: categoriasRes },
    { nombre: 'director', res: directoresRes },
    { nombre: 'supervisores', res: supervisoresRes }
  ].filter(c => c.res.error);

  if (consultasErrores.length > 0) {
    throw new Error(`Error al consultar tablas: ${consultasErrores.map(c => c.nombre).join(', ')}`)
  }

  // Mapas id → nombre/objeto
  const localidadesMap = new Map((localidadesRes.data || []).map(l => [l.id, l]))
  const departamentosMap = new Map((departamentosRes.data || []).map(d => [d.id, d.nombre]))
  const tiposEscuelaMap = new Map((tiposEscuelaRes.data || []).map(t => [t.id, t.nombre]))
  const categoriasMap = new Map((categoriasRes.data || []).map(c => [c.id, { numero: c.numero, descripcion: c.descripcion }]))
  const directoresMap = new Map((directoresRes.data || []).map(d => [d.escuela_id, d]))
  
  // Mapa para supervisores (por escuela_id)
  const supervisoresMap = new Map()
  if (supervisoresRes.data) {
    for (const supervisor of supervisoresRes.data) {
      supervisoresMap.set(supervisor.escuela_id, {
        nombre: supervisor.nombre,
        telefono: supervisor.telefono
      })
    }
  }

  let escuelasProcesadas = (data || []).map((escuela: any) => {
    // Obtener localidad y departamento
    const localidad = localidadesMap.get(escuela.localidad_id)
    const departamentoNombre = localidad ? departamentosMap.get(localidad.departamento_id) : undefined
    const localidadNombre = localidad ? localidad.nombre : undefined
    
    // Obtener tipo de escuela
    const tipoEscuelaNombre = tiposEscuelaMap.get(escuela.tipo_escuela_id)
    
    // Obtener categoría
    const categoriaObj = categoriasMap.get(escuela.categoria_id)
    const categoriaNumero = categoriaObj ? categoriaObj.numero : undefined
    
    // Obtener datos del director
    const directorObj = directoresMap.get(escuela.id)
    const director = directorObj ? directorObj.nombre : ""
    const directorTelefono = directorObj ? directorObj.telefono : undefined
    const directorMail = directorObj ? directorObj.mail : undefined
    const directorSituacionRevista = directorObj ? directorObj.situacion_revista : undefined

    // Obtener supervisor asignado a la escuela
    const supervisorObj = supervisoresMap.get(escuela.id)
    const supervisorNombre = supervisorObj ? supervisorObj.nombre : undefined
    
    // Formatear campos específicos según tu interfaz
    let docenEspeciales: string | undefined = undefined
    if (escuela.docentes_especiales === "0") {
      docenEspeciales = "No tiene"
    } else if (escuela.docentes_especiales !== undefined && escuela.docentes_especiales !== null) {
      docenEspeciales = escuela.docentes_especiales.toString()
    }
    
    // Formatear fecha de fundación año
    let fechaFundacion2: number | undefined = undefined
    if (typeof escuela.fecha_fundacion_anio === "string") {
      const parsed = parseInt(escuela.fecha_fundacion_anio, 10)
      fechaFundacion2 = isNaN(parsed) ? undefined : parsed
    } else if (typeof escuela.fecha_fundacion_anio === "number") {
      fechaFundacion2 = escuela.fecha_fundacion_anio
    }

    // Asumiendo que matricula2024 y matricula2025 están en la tabla de escuelas
    // o en una relación que no está definida en el esquema proporcionado
    // Si estos campos no existen, asignaremos 0 como valor predeterminado
    const matricula2024 = escuela.matricula2024 || 0
    const matricula2025 = escuela.matricula2025 || 0

    // Construir objeto ajustado a la interfaz Escuela
    const escuelaFormateada: Escuela = {
      nombre: escuela.nombre,
      cue: escuela.cue,
      director: director || "",
      departamento: departamentoNombre || "",
      localidad: localidadNombre || "",
      fechaFundacion: escuela.fecha_fundacion || "",
      fechaFundacion2: fechaFundacion2,
      categoria: categoriaNumero,
      tipoEscuela: tipoEscuelaNombre,
      matricula2024: matricula2024,
      matricula2025: matricula2025,
      
      // Información de contacto
      mail: directorMail,
      correo: directorMail,
      telefono: directorTelefono,
      
      // Campos adicionales
      zona: escuela.zona,
      turno: escuela.turno,
      cabecera: escuela.cabecera,
      esCentenaria: escuela.es_centenaria ? "Sí" : "No",
      situacionRevistaDirector: directorSituacionRevista,
      ubicacion: escuela.ubicacion,
      comparteEdificio: escuela.comparte_edificio,
      tieneEdificioPropio: escuela.edificio_propio ? "Sí" : "No",
      empresaLimpieza: escuela.empresa_limpieza,
      cantidadDocenGrado: escuela.cantidad_docentes_grado,
      cantidadDocenDobleTurno: escuela.cantidad_docentes_doble_turno,
      DocenEspeciales: docenEspeciales,
      tieneProfesionalesSalud: escuela.profesionales_salud ? "Sí" : "No",
      cantidadAdministrativos: escuela.cantidad_administrativos,
      cantidadPorteros: escuela.cantidad_porteros,
      tieneCopaLecheAlmuerzo: escuela.copa_leche_almuerzo ? "Sí" : "No",
      programasAcompañamiento: escuela.programas_acompanamiento,
      conexionInternet: escuela.conexion_internet,
      problematicas: escuela.problematicas,
      supervisor: supervisorNombre
    }

    return escuelaFormateada
  })

  // Filtros locales (por término de búsqueda)
  if (options.termino && typeof options.termino === 'string' && options.termino.trim()) {
    const terminoNormalizado = normalizarTexto(options.termino)
    const terminosBusqueda = terminoNormalizado.split(/\s+/).filter(Boolean)

    escuelasProcesadas = escuelasProcesadas.filter((escuela) => {
      const nombreNormalizado = normalizarTexto(escuela.nombre.toString())
      const cueString = escuela.cue.toString()
      const directorNormalizado = escuela.director ? normalizarTexto(escuela.director.toString()) : ""
      const localidadNormalizada = escuela.localidad ? normalizarTexto(escuela.localidad) : ""
      const departamentoNormalizado = escuela.departamento ? normalizarTexto(escuela.departamento) : ""
      const mailNormalizado = escuela.mail ? normalizarTexto(escuela.mail.toString()) : ""
      const telefonoString = escuela.telefono ? escuela.telefono.toString() : ""
      const supervisorNormalizado = escuela.supervisor ? normalizarTexto(escuela.supervisor.toString()) : ""

      return terminosBusqueda.every(termino =>
        nombreNormalizado.includes(termino) ||
        cueString.includes(termino) ||
        directorNormalizado.includes(termino) ||
        localidadNormalizada.includes(termino) ||
        departamentoNormalizado.includes(termino) ||
        mailNormalizado.includes(termino) ||
        telefonoString.includes(termino) ||
        supervisorNormalizado.includes(termino)
      )
    })
  }

  // Filtro por supervisor
  if (options.supervisor) {
    const supervisorNormalizado = normalizarTexto(options.supervisor)
    escuelasProcesadas = escuelasProcesadas.filter((escuela) => {
      const escuelaSupervisorNormalizado = escuela.supervisor ? 
        normalizarTexto(escuela.supervisor.toString()) : ""
      return escuelaSupervisorNormalizado.includes(supervisorNormalizado)
    })
  }

  // Paginación
  if (options.pagina && options.porPagina) {
    const inicio = (options.pagina - 1) * options.porPagina
    const fin = inicio + options.porPagina
    return {
      escuelas: escuelasProcesadas.slice(inicio, fin),
      totalPaginas: Math.ceil(escuelasProcesadas.length / options.porPagina),
      totalEscuelas: escuelasProcesadas.length
    }
  }

  return {
    escuelas: escuelasProcesadas,
    totalEscuelas: escuelasProcesadas.length
  }
}
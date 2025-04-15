export interface Escuela {
  mail?: string
  nombre: string | number
  cue: number
  categoria?: number
  director: string
  telefono?: number | string
  correo?: string
  departamento: string
  localidad: string
  fechaFundacion: string
  zona?: string
  turno?: string
  cabecera?: string | number
  esCentenaria?: string
  tipoEscuela?: string
  situacionRevistaDirector?: string
  matricula2025: number
  matricula2024?: number
  ubicacion?: string
  comparteEdificio?: string
  tieneEdificioPropio?: string
  empresaLimpieza?: string
  cantidadDocenGrado?: number
  cantidadDocenDobleTurno?: number
  tieneProfesionalesSalud?: string
  DocenEspeciales?: string
  cantidadAdministrativos?: number
  cantidadPorteros?: number
  tieneCopaLecheAlmuerzo?: string
  programasAcompañamiento?: string
  conexionInternet?: string
  problematicas?: string
  supervisor?: string
}

// Mapeo de supervisores por departamento
export const supervisoresPorDepartamento: Record<string, string[]> = {
  "Berón de Astrada": ["Virginia Coronel"],
  "San Cosme": ["Virginia Coronel", "Patricia Ponce (Nivel Inicial)"],
  Ituzaingó: ["Virginia Coronel", "Patricia Ponce (Nivel Inicial)"],
  "San Miguel": ["Virginia Coronel", "Patricia Ponce (Nivel Inicial)"],
  "San Roque": ["Sandra Esquivel", "Norma Briend (Nivel Inicial)"],
  Mercedes: ["Gonzales, Milagros", "Claudia Fonseca (Nivel Inicial)"],
  "San Martín": ["Gonzales, Milagros", "Claudia Fonseca (Nivel Inicial)"],
  Esquina: ["Edith Sanchez", "Norma Briend (Nivel Inicial)"],
  Goya: ["Edith Sanchez", "Norma Monzon", "Norma Briend (Nivel Inicial)"],
  "Curuzú Cuatiá": ["Leyes Edid", "Claudia Fonseca (Nivel Inicial)"],
  Sauce: ["Leyes Edid", "Norma Briend (Nivel Inicial)"],
  Capital: [
    "Leyes Edid",
    "Fernandez Juan Carlos",
    "Daniel Alberto Gomez",
    "Monica Beatriz Esquivel",
    "Claudia Fonseca (Nivel Inicial)",
    "Patricia Ponce (Nivel Inicial)",
    "Norma Briend (Nivel Inicial)",
  ],
  "Gral. Alvear": ["Nancy Aguilar Rivero", "Claudia Fonseca (Nivel Inicial)"],
  "Santo Tomé": ["Nancy Aguilar Rivero", "Patricia Ponce (Nivel Inicial)"],
  Concepción: ["Blanca Gutierrez", "Patricia Ponce (Nivel Inicial)"],
  Mburucuyá: ["Blanca Gutierrez", "Patricia Ponce (Nivel Inicial)"],
  "San Luis del Palmar": ["Fernandez Juan Carlos", "Claudia Fonseca (Nivel Inicial)"],
  Itatí: ["Daniel Alberto Gomez", "Patricia Ponce (Nivel Inicial)"],
  Saladas: ["Daniel Alberto Gomez", "Patricia Ponce (Nivel Inicial)"],
  Empedrado: ["Silvia Zabala", "Norma Briend (Nivel Inicial)"],
  "Bella Vista": ["Silvia Zabala", "Norma Briend (Nivel Inicial)"],
  "Gral. Paz": ["Monica Beatriz Esquivel", "Patricia Ponce (Nivel Inicial)"],
  "Paso de los Libres": ["Dora Liliana Peñalber", "Claudia Fonseca (Nivel Inicial)"],
  "Monte Caseros": ["Dora Liliana Peñalber", "Claudia Fonseca (Nivel Inicial)"],
  Lavalle: ["Norma Briend (Nivel Inicial)"],
}

// Lista de todos los supervisores para el filtro
export const todosSupervisores = [
  "Virginia Coronel",
  "Sandra Esquivel",
  "Gonzales, Milagros",
  "Edith Sanchez",
  "Leyes Edid",
  "Nancy Aguilar Rivero",
  "Blanca Gutierrez",
  "Fernandez Juan Carlos",
  "Daniel Alberto Gomez",
  "Silvia Zabala",
  "Norma Monzon",
  "Monica Beatriz Esquivel",
  "Dora Liliana Peñalber",
  "Claudia Fonseca (Nivel Inicial)",
  "Patricia Ponce (Nivel Inicial)",
  "Norma Briend (Nivel Inicial)",
]

// Datos de escuelas esperadas por localidad
export const escuelasEsperadas: Record<string, number> = {
  "Bella Vista": 35,
  "Berón de Astrada": 6,
  Capital: 86,
  Concepción: 40,
  "Curuzú Cuatiá": 51,
  Empedrado: 40,
  Esquina: 59,
  "Gral. Alvear": 14,
  "Gral. Paz": 34,
  Goya: 95,
  Itatí: 11,
  Ituzaingó: 37,
  Lavalle: 43,
  Mburucuyá: 18,
  Mercedes: 42,
  "Monte Caseros": 39,
  "Paso de los Libres": 33,
  "San Luis del Palmar": 45,
  Saladas: 30,
  "San Cosme": 23,
  "San Martín": 29,
  "San Miguel": 19,
  "San Roque": 29,
  "Santo Tomé": 49,
  Sauce: 20,
}

import { Escuela } from "@/types/escuela";

interface ResultadoValidacion {
  cumple: boolean;
  ratio: number;
  minimoEsperado: number | [number, number];
  mensaje: string;
}

export function validarRatio(escuela: Escuela): ResultadoValidacion {
  // Validar campos requeridos
  if (!escuela.categoria || !escuela.zona || !escuela.cantidadDocenGrado) {
    return {
      cumple: false,
      ratio: 0,
      minimoEsperado: 0,
      mensaje: "Faltan datos requeridos (categoría, zona o cantidad de docentes)"
    };
  }

  // Validar que docentesGrado > 0
  if (escuela.cantidadDocenGrado <= 0) {
    return {
      cumple: false,
      ratio: 0,
      minimoEsperado: 0,
      mensaje: "La cantidad de docentes debe ser mayor a 0"
    };
  }

  // Calcular ratio
  const ratio = escuela.matricula2025 / escuela.cantidadDocenGrado;
  const zonaNormalizada = escuela.zona.toUpperCase();

  // Determinar mínimo esperado según categoría y zona
  let minimoEsperado: number | [number, number];
  let cumple: boolean;
  let mensaje: string;

  switch (escuela.categoria) {
    case 1:
      if (zonaNormalizada === 'A' || zonaNormalizada === 'B') {
        minimoEsperado = 20;
        cumple = ratio >= 20;
      } else if (zonaNormalizada === 'C' || zonaNormalizada === 'D') {
        minimoEsperado = 15;
        cumple = ratio >= 15;
      } else if (zonaNormalizada === 'E') {
        minimoEsperado = 8;
        cumple = ratio >= 8;
      } else {
        return {
          cumple: false,
          ratio,
          minimoEsperado: 0,
          mensaje: "Zona no válida para categoría 1"
        };
      }
      break;

    case 2:
      if (zonaNormalizada === 'A' || zonaNormalizada === 'B') {
        minimoEsperado = 15;
        cumple = ratio >= 15;
      } else if (['C', 'D', 'E'].includes(zonaNormalizada)) {
        minimoEsperado = 12;
        cumple = ratio >= 12;
      } else {
        return {
          cumple: false,
          ratio,
          minimoEsperado: 0,
          mensaje: "Zona no válida para categoría 2"
        };
      }
      break;

    case 3:
      if (['A', 'B', 'C', 'D', 'E'].includes(zonaNormalizada)) {
        minimoEsperado = 12;
        cumple = ratio >= 12;
      } else {
        return {
          cumple: false,
          ratio,
          minimoEsperado: 0,
          mensaje: "Zona no válida para categoría 3"
        };
      }
      break;

    case 4:
      if (['A', 'B', 'C', 'D', 'E'].includes(zonaNormalizada)) {
        minimoEsperado = [3, 24];
        cumple = ratio >= 3 && ratio <= 24;
      } else {
        return {
          cumple: false,
          ratio,
          minimoEsperado: 0,
          mensaje: "Zona no válida para categoría 4"
        };
      }
      break;

    default:
      return {
        cumple: false,
        ratio,
        minimoEsperado: 0,
        mensaje: "Categoría no válida"
      };
  }

  // Generar mensaje descriptivo
  if (Array.isArray(minimoEsperado)) {
    mensaje = cumple
      ? `Cumple con el ratio requerido (${ratio.toFixed(2)} alumnos/docente) para categoría ${escuela.categoria} zona ${zonaNormalizada} (mínimo ${minimoEsperado[0]}, máximo ${minimoEsperado[1]})`
      : `No cumple con el ratio requerido (${ratio.toFixed(2)} alumnos/docente) para categoría ${escuela.categoria} zona ${zonaNormalizada} (mínimo ${minimoEsperado[0]}, máximo ${minimoEsperado[1]})`;
  } else {
    mensaje = cumple
      ? `Cumple con el ratio requerido (${ratio.toFixed(2)} alumnos/docente) para categoría ${escuela.categoria} zona ${zonaNormalizada} (mínimo ${minimoEsperado})`
      : `No cumple con el ratio requerido (${ratio.toFixed(2)} alumnos/docente) para categoría ${escuela.categoria} zona ${zonaNormalizada} (mínimo ${minimoEsperado})`;
  }

  return {
    cumple,
    ratio,
    minimoEsperado,
    mensaje
  };
} 
import { Escuela } from "@/types/iEscuela";

interface ResultadoValidacion {
  estado: 'debajo' | 'cerca' | 'minimo' | 'arriba';
  ratio: number;
  minimoEsperado: number | [number, number];
  mensaje: string;
}

export function validarRatio(escuela: Escuela): ResultadoValidacion {
  // Verificar si tenemos los datos necesarios
  if (!escuela.cantidadDocenGrado || escuela.cantidadDocenGrado === 0) {
    return {
      estado: 'debajo',
      ratio: 0,
      minimoEsperado: 20,
      mensaje: "No hay datos de docentes disponibles"
    };
  }

  // Convertir a número (funciona tanto para números como para strings numéricos)
  const matricula = Number(escuela.matricula2025) || 0;
  const docentes = Number(escuela.cantidadDocenGrado);

  // Si la conversión falla, retornar como debajo del mínimo
  if (isNaN(matricula) || isNaN(docentes) || docentes === 0) {
    return {
      estado: 'debajo',
      ratio: 0,
      minimoEsperado: 20,
      mensaje: "Datos inválidos para el cálculo del ratio"
    };
  }

  const ratio = matricula / docentes;
  const zonaNormalizada = escuela.zona?.toUpperCase() || '';

  // Determinar el mínimo esperado según la categoría y zona
  let minimoEsperado: number | [number, number] = 20; // Por defecto categoría 1 zonas A y B
  let mensaje: string;

  switch (escuela.categoria) {
    case 1:
      if (zonaNormalizada === 'A' || zonaNormalizada === 'B') {
        minimoEsperado = 20;
      } else if (zonaNormalizada === 'C' || zonaNormalizada === 'D') {
        minimoEsperado = 15;
      } else if (zonaNormalizada === 'E') {
        minimoEsperado = 8;
      }
      break;

    case 2:
      if (zonaNormalizada === 'A' || zonaNormalizada === 'B') {
        minimoEsperado = 15;
      } else if (['C', 'D', 'E'].includes(zonaNormalizada)) {
        minimoEsperado = 12;
      }
      break;

    case 3:
      minimoEsperado = 12;
      break;

    case 4:
      minimoEsperado = [3, 24];
      break;

    default:
      return {
        estado: 'debajo',
        ratio,
        minimoEsperado: 20,
        mensaje: "Categoría no válida"
      };
  }

  // Determinar el estado
  let estado: 'debajo' | 'cerca' | 'minimo' | 'arriba';

  if (matricula === 0) {
    estado = 'debajo';
    mensaje = "La matrícula es 0";
  } else if (Array.isArray(minimoEsperado)) {
    // Para categoría 4 que tiene rango
    if (ratio < minimoEsperado[0]) {
      estado = 'debajo';
      mensaje = `Ratio por debajo del mínimo (${ratio.toFixed(2)} < ${minimoEsperado[0]})`;
    } else if (ratio > minimoEsperado[1]) {
      estado = 'arriba';
      mensaje = `Ratio por encima del máximo (${ratio.toFixed(2)} > ${minimoEsperado[1]})`;
    } else {
      estado = 'minimo';
      mensaje = `Ratio dentro del rango esperado (${minimoEsperado[0]} - ${minimoEsperado[1]})`;
    }
  } else {
    // Para otras categorías con mínimo único
    if (ratio < minimoEsperado) {
      const diferencia = minimoEsperado - ratio;
      const porcentajeDiferencia = (diferencia / minimoEsperado) * 100;
      estado = porcentajeDiferencia <= 10 ? 'cerca' : 'debajo';
      mensaje = `Ratio por debajo del mínimo (${ratio.toFixed(2)} < ${minimoEsperado})`;
    } else if (Math.abs(ratio - minimoEsperado) < 0.1) {
      estado = 'minimo';
      mensaje = `Ratio en el mínimo esperado (${minimoEsperado})`;
    } else {
      estado = 'arriba';
      mensaje = `Ratio por encima del mínimo (${ratio.toFixed(2)} > ${minimoEsperado})`;
    }
  }

  return {
    estado,
    ratio,
    minimoEsperado,
    mensaje
  };
}

function determinarEstado(ratio: number, minimo: number): 'debajo' | 'cerca' | 'minimo' | 'arriba' {
  const diferencia = Math.abs(ratio - minimo);
  const porcentajeDiferencia = (diferencia / minimo) * 100;

  if (ratio < minimo) {
    if (porcentajeDiferencia <= 10) {
      return 'cerca';
    }
    return 'debajo';
  } else if (ratio === minimo) {
    return 'minimo';
  } else {
    return 'arriba';
  }
}

function determinarEstadoRango(ratio: number, minimo: number, maximo: number): 'debajo' | 'cerca' | 'minimo' | 'arriba' {
  if (ratio < minimo) {
    const diferencia = minimo - ratio;
    const porcentajeDiferencia = (diferencia / minimo) * 100;
    return porcentajeDiferencia <= 10 ? 'cerca' : 'debajo';
  } else if (ratio > maximo) {
    const diferencia = ratio - maximo;
    const porcentajeDiferencia = (diferencia / maximo) * 100;
    return porcentajeDiferencia <= 10 ? 'cerca' : 'arriba';
  } else {
    return 'minimo';
  }
} 
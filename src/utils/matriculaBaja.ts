import { Escuela } from "@/types/escuela";

interface ResultadoValidacion {
  estado: 'debajo' | 'cerca' | 'minimo' | 'arriba';
  ratio: number;
  minimoEsperado: number;
}

export function validarRatio(escuela: Escuela): ResultadoValidacion {
  // Verificar si tenemos los datos necesarios
  if (!escuela.matricula2025 || !escuela.cantidadDocenGrado || escuela.cantidadDocenGrado === 0) {
    return {
      estado: 'debajo',
      ratio: 0,
      minimoEsperado: 20
    };
  }

  const matricula = Number(escuela.matricula2025);
  const docentes = Number(escuela.cantidadDocenGrado);
  const ratio = matricula / docentes;

  // Determinar el mínimo esperado según la categoría y zona
  let minimoEsperado = 20; // Por defecto categoría 1 zonas A y B

  if (escuela.categoria === 1) {
    if (escuela.zona === 'C' || escuela.zona === 'D') {
      minimoEsperado = 15;
    } else if (escuela.zona === 'E') {
      minimoEsperado = 8;
    }
  } else if (escuela.categoria === 2) {
    if (escuela.zona === 'A' || escuela.zona === 'B') {
      minimoEsperado = 15;
    } else if (['C', 'D', 'E'].includes(escuela.zona || '')) {
      minimoEsperado = 12;
    }
  } else if (escuela.categoria === 3) {
    minimoEsperado = 12;
  } else if (escuela.categoria === 4) {
    minimoEsperado = 3;
  }

  // Determinar el estado
  let estado: 'debajo' | 'cerca' | 'minimo' | 'arriba' = 'debajo';
  
  if (ratio < minimoEsperado) {
    const diferencia = minimoEsperado - ratio;
    const porcentajeDiferencia = (diferencia / minimoEsperado) * 100;
    estado = porcentajeDiferencia <= 10 ? 'cerca' : 'debajo';
  } else if (Math.abs(ratio - minimoEsperado) < 0.1) {
    estado = 'minimo';
  } else {
    estado = 'arriba';
  }

  return {
    estado,
    ratio,
    minimoEsperado
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
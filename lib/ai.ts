import type { Escuela } from "@/types/iEscuela"
import { limpiarTexto, normalizarTexto } from "@/lib/utils"
import { getAllEscuelas } from "@/lib/utils"
import { supervisoresPorDepartamento } from "@/types/iEscuela"

interface ProblematicaEscuela {
    nombre: string | number
    problematicas: string | undefined
}

function obtenerProblematicasPorSupervisor(escuelas: Escuela[], supervisor: string): ProblematicaEscuela[] {
    // Normalizar el nombre del supervisor una sola vez
    const supervisorNormalizado = supervisor.toLowerCase().trim();
    
    // Encontrar los departamentos que supervisa
    const departamentosSupervisados = Object.entries(supervisoresPorDepartamento)
        .filter(([,supervisores]) => 
            supervisores.some(s => s.toLowerCase().trim() === supervisorNormalizado)
        )
        .map(([depto]) => depto);
    
    return escuelas
      .filter(escuela => {
        if (supervisor === "all") return true;
        
        const departamentoNormalizado = normalizarTexto(escuela.departamento);
        
        // Verificar si el departamento de la escuela está en los departamentos supervisados
        return departamentosSupervisados.some(depto => 
            normalizarTexto(depto) === departamentoNormalizado
        );
      })
      .map(escuela => ({
        nombre: escuela.nombre,
        problematicas: escuela.problematicas
      }))
}

export async function generateGeminiInsight(supervisor: string) {
  try {
    // Si es análisis general, usar el endpoint diario
    if (supervisor === "all") {
      const response = await fetch('/api/gemini/general')
      if (!response.ok) {
        throw new Error('Error en la llamada a la API')
      }
      const data = await response.json()
      return limpiarTexto(data.text)
    }

    // Para análisis específico de supervisor, usar el endpoint normal
    const problematicas = obtenerProblematicasPorSupervisor(await getAllEscuelas(), supervisor)
    
    console.log("Datos enviados a la API:", {
      supervisor,
      cantidadEscuelas: problematicas.length,
      escuelas: problematicas
    });
    
    const prompt = `Analiza las problemáticas específicas para las escuelas del supervisor ${supervisor} y genera un análisis conciso con el siguiente formato:

<u>ESCUELAS CON PROBLEMÁTICAS CRÍTICAS:</u>

1. <strong>Nombre de la escuela</strong>
  - <b>Problemática principal</b>
  - <b>Impacto</b>

2. <strong>Nombre de la escuela</strong>
  - <b>Problemática principal</b>
  - <b>Impacto</b>

(Continuar con máximo 5 escuelas)

${JSON.stringify(problematicas, null, 2)}

Requisitos:
- Máximo 5 escuelas
- Enfócate en los problemas más urgentes
- Usa lenguaje claro y directo
- Incluye solo la información más relevante
- NO uses asteriscos (**) para el formato
- Usa <strong> SOLO para los nombres de las escuelas
- NO uses <strong> en las problemáticas o impactos, utiliza <b> en su lugar
- Los nombres de escuelas deben estar en negrita usando <strong>`

    const response = await fetch('/api/gemini/specific', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, supervisor })
    })

    if (!response.ok) {
      throw new Error('Error en la llamada a la API')
    }

    const data = await response.json()
    return limpiarTexto(data.text)
  } catch (error) {
    console.error('Error al generar insight:', error)
    return 'Lo sentimos, hubo un error al generar el análisis. Por favor, intente nuevamente.'
  }
}
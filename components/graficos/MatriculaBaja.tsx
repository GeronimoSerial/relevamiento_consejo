'use client';

import { useMemo, memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Escuela } from '@/types/escuela';
import { validarRatio } from '@/lib/matriculaBaja';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MatriculaBajaProps {
  escuelas: Escuela[];
}

// Componente para la leyenda de mínimos esperados
const LeyendaMinimos = memo(() => (
  <div className="sticky top-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
    <h4 className="font-semibold text-sm mb-3">Mínimos esperados por categoría:</h4>
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-medium">Categoría 1:</p>
        <ul className="ml-4 space-y-1 text-gray-600">
          <li>• Zonas A y B: 20 alumnos por grado</li>
          <li>• Zonas C y D: 15 alumnos por grado</li>
          <li>• Zona E: 8 alumnos por grado</li>
        </ul>
      </div>
      <div>
        <p className="font-medium">Categoría 2:</p>
        <ul className="ml-4 space-y-1 text-gray-600">
          <li>• Zonas A y B: 15 alumnos por grado</li>
          <li>• Zonas C, D y E: 12 alumnos por grado</li>
        </ul>
      </div>
      <div>
        <p className="font-medium">Categoría 3:</p>
        <ul className="ml-4 space-y-1 text-gray-600">
          <li>• Todas las zonas: 12 alumnos por grado</li>
        </ul>
      </div>
      <div>
        <p className="font-medium">Categoría 4:</p>
        <ul className="ml-4 space-y-1 text-gray-600">
          <li>• Todas las zonas: Sección única: Hasta 24 alumnos por grado</li>
        </ul>
      </div>
    </div>
  </div>
));

LeyendaMinimos.displayName = 'LeyendaMinimos';

// Componente para la tarjeta de escuela
const EscuelaCard = memo(({ escuela }: { escuela: Escuela & { ratio: number; minimoEsperado: number; porcentaje: number; id: string } }) => (
  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex flex-col gap-2">
        <p className="text-gray-800 font-medium break-words">
          {escuela.nombre} <span className="text-gray-500 font-normal">(CUE: {escuela.cue})</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {escuela.categoria && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-medium">
              Categoria: {escuela.categoria}
            </span>
          )}
          {escuela.zona && (
            <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-xs font-medium">
              Zona: {escuela.zona}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-sm">
          <span className="text-red-500 font-medium">Promedio {Math.round(escuela.ratio)} alumnos</span>
          <span className="text-gray-500"> de </span>
          <span className="text-green-600 font-medium">{escuela.minimoEsperado}</span>
          <span className="text-gray-500"> esperados</span>
        </p>
        <p className="text-xs text-gray-500">
          ({escuela.matricula2025} alumnos / {escuela.cantidadDocenGrado} docente(s) = {escuela.ratio.toFixed(1)})
        </p>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
      <div 
        className="h-2.5 rounded-full transition-all duration-500"
        style={{
          width: `${escuela.porcentaje}%`,
          backgroundColor: escuela.porcentaje < 50 ? '#ef4444' : '#f97316'
        }}
      />
    </div>
    <p className="text-sm text-gray-500 break-words">
      {escuela.departamento} - {escuela.localidad}
    </p>
  </div>
));

EscuelaCard.displayName = 'EscuelaCard';

// Componente principal memoizado
function MatriculaBaja({ escuelas }: MatriculaBajaProps) {
  const { data, escuelasDebajoMinimo } = useMemo(() => {
    const escuelasDebajoMinimo = escuelas
      .map((escuela, index) => {
        const resultado = validarRatio(escuela);
        if (!escuela.cantidadDocenGrado) return null;
        
        // Calcular porcentaje según la categoría
        let porcentaje: number;
        if (Array.isArray(resultado.minimoEsperado)) {
          // Para categoría 4, calcular el porcentaje basado en el rango
          const [min, max] = resultado.minimoEsperado;
          if (resultado.ratio < min) {
            porcentaje = (resultado.ratio / min) * 100;
          } else if (resultado.ratio > max) {
            porcentaje = 100 + ((resultado.ratio - max) / max) * 100;
          } else {
            porcentaje = 100;
          }
        } else {
          // Para otras categorías, calcular normalmente
          porcentaje = resultado.ratio > 0 
            ? (resultado.ratio / resultado.minimoEsperado) * 100 
            : 0;
        }
        
        return {
          ...escuela,
          ratio: resultado.ratio,
          minimoEsperado: resultado.minimoEsperado,
          estado: resultado.estado,
          porcentaje: Math.min(porcentaje, 200), // Permitir hasta 200% para casos extremos
          id: `${escuela.cue}-${index}`
        };
      })
      .filter((escuela): escuela is NonNullable<typeof escuela> => 
        escuela !== null && escuela.estado === 'debajo'
      )
      .sort((a, b) => {
        // Primero ordenar por matrícula 0
        if (a.matricula2025 === 0 && b.matricula2025 !== 0) return -1;
        if (a.matricula2025 !== 0 && b.matricula2025 === 0) return 1;
        // Luego por porcentaje (de menor a mayor)
        return a.porcentaje - b.porcentaje;
      });

    // Calcular estadísticas incluyendo escuelas con matrícula 0
    const estadisticas = escuelas.reduce((acc, escuela) => {
      if (!escuela.cantidadDocenGrado) return acc;
      const resultado = validarRatio(escuela);
      acc[resultado.estado] = (acc[resultado.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: [
        { name: 'Por debajo del mínimo', value: estadisticas['debajo'] || 0, color: '#ef4444' },
        { name: 'Cerca del mínimo', value: estadisticas['cerca'] || 0, color: '#eab308' },
        { name: 'En el mínimo', value: estadisticas['minimo'] || 0, color: '#22c55e' },
        { name: 'Por encima del mínimo', value: estadisticas['arriba'] || 0, color: '#3b82f6' }
      ],
      escuelasDebajoMinimo
    };
  }, [escuelas]);

  return (
    <div className="space-y-6">
      <div className="w-full bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value: number) => [`${value} escuelas`, 'Cantidad']}
                  labelStyle={{ color: '#000' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3fa038"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <rect key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-4">
            <LeyendaMinimos />
          </div>
        </div>
      </div>

      {escuelasDebajoMinimo.length > 0 && (
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <h3 className="text-lg font-semibold mb-4">
            Escuelas por debajo del mínimo ({escuelasDebajoMinimo.length})
          </h3>
          <div className="max-h-[400px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {escuelasDebajoMinimo.map((escuela) => {
              const escuelaWithNumberMinimo = {
                ...escuela,
                minimoEsperado: Array.isArray(escuela.minimoEsperado) 
                  ? escuela.minimoEsperado[0] 
                  : escuela.minimoEsperado
              };
              return <EscuelaCard key={escuela.id} escuela={escuelaWithNumberMinimo} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MatriculaBaja); 
import { BarChart3 } from "lucide-react"

export default function LoadingEstadisticas() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-verde/20 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <BarChart3 className="h-16 w-16 text-verde animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-700">Cargando estadísticas...</h2>
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-verde animate-pulse" style={{ width: "70%" }}></div>
          </div>
          <p className="text-sm text-gray-500">Preparando visualizaciones y análisis de datos</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 h-64">
              <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse mb-4"></div>
              <div className="h-full bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

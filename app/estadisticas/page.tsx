/* eslint-disable react/react-in-jsx-scope */
import { Suspense } from "react"
import { getAllEscuelas } from "@/lib/utils"
import Header from "@/components/Header"
import EstadisticasContent from "@/components/estadisticas/EstadisticasContent"
import LoadingEstadisticas from "@/components/LoadingEstadisticas"

export default async function EstadisticasPage() {
  // Obtener todas las escuelas en tiempo de build
  const escuelas = await getAllEscuelas()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Suspense fallback={<LoadingEstadisticas />}>
          <EstadisticasContent escuelas={escuelas} />
        </Suspense>
      </div>
    </main>
  )
}

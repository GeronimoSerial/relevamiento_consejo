import { Suspense } from "react"
import { getAllEscuelas } from "@/lib/escuelas"
import Header from "@/components/Header"
import EstadisticasContent from "@/components/EstadisticasContent"
import LoadingEstadisticas from "@/components/LoadingEstadisticas"
import BackToHome from "@/components/BackToHome"

export default async function EstadisticasPage() {
  // Obtener todas las escuelas en tiempo de build
  const escuelas = getAllEscuelas()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <BackToHome />
        <Suspense fallback={<LoadingEstadisticas />}>
          <EstadisticasContent escuelas={escuelas} />
        </Suspense>
      </div>
    </main>
  )
}

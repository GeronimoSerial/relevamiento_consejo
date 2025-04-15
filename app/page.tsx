import { Suspense } from "react"
import { getAllEscuelas } from "@/lib/escuelas"
import Header from "@/components/Header"
import EscuelasClient from "@/components/EscuelasClient"
import LoadingEscuelas from "@/components/LoadingEscuelas"
import StatsNavButton from "@/components/StatsNavButton"

// Esta página ahora es un Server Component que pre-renderiza los datos
export default async function Home() {
  // Obtener todas las escuelas en tiempo de build
  const escuelas = getAllEscuelas()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <StatsNavButton />
      <Suspense fallback={<LoadingEscuelas />}>
        <EscuelasClient initialEscuelas={escuelas} />
      </Suspense>
    </main>
  )
}

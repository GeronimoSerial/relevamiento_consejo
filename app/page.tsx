import { Suspense } from "react"
import { getAllEscuelas } from "@/lib/escuelas"
import EscuelasClient from "@/components/EscuelasClient"
import LoadingEscuelas from "@/components/LoadingEscuelas"

// Esta página ahora es un Server Component que pre-renderiza los datos
export default async function Home() {
  // Obtener todas las escuelas en tiempo de build
  const escuelas = getAllEscuelas()

  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<LoadingEscuelas />}>
        <EscuelasClient initialEscuelas={escuelas} />
      </Suspense>
    </main>
  )
}

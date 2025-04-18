/* eslint-disable react/react-in-jsx-scope */
import { Suspense } from "react"
import { getAllEscuelas } from "@/lib/utils"
import Header from "@/components/Header"
import EscuelasClient from "@/components/principal/EscuelasClient"
import LoadingEscuelas from "@/components/LoadingEscuelas"

// Esta página ahora es un Server Component que pre-renderiza los datos
export default async function Home() {
  // Obtener todas las escuelas en tiempo de build
  const escuelas = await getAllEscuelas()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<LoadingEscuelas />}>
        <EscuelasClient initialEscuelas={escuelas} />
      </Suspense>
    </main>
  )
}

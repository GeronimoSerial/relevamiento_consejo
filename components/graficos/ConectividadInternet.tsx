"use client"

import { useMemo, useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Escuela } from "@/types/iEscuela"

interface ConectividadInternetProps {
  escuelas: Escuela[]
}

export default function ConectividadInternet({ escuelas }: ConectividadInternetProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Comprobar al cargar
    checkIfMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Procesar datos para el gráfico
  const data = useMemo(() => {
    // Si hay escuelas, usar datos reales
    if (escuelas && escuelas.length > 0) {
      // Agrupar por tipo de conexión
      const conexiones = escuelas.reduce(
        (acc, escuela) => {
          const conexion = escuela.conexionInternet || "Sin datos"
          if (!acc[conexion]) {
            acc[conexion] = 0
          }
          acc[conexion]++
          return acc
        },
        {} as Record<string, number>,
      )

      // Convertir a array y ordenar por cantidad (descendente)
      return (
        Object.entries(conexiones)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          // Limitar a 5 tipos de conexión en móvil para mejor visualización
          .slice(0, isMobile ? 5 : undefined)
      )
    }

    // Si no hay escuelas, usar datos ficticios
    return [
      { name: "Fibra óptica 100MB", value: 35 },
      { name: "ADSL 20MB", value: 25 },
      { name: "Satelital 10MB", value: 15 },
      { name: "Fibra óptica 200MB", value: 10 },
      { name: "ADSL 50MB", value: 10 },
    ]
  }, [escuelas, isMobile])

  // En móvil, acortar los nombres de las conexiones para mejor visualización
  const processedData = useMemo(() => {
    if (!isMobile) return data

    return data.map((item) => ({
      ...item,
      name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    }))
  }, [data, isMobile])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processedData}
        layout="vertical"
        margin={{ top: 5, right: 10, left: isMobile ? 70 : 150, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 12 }} />
        <YAxis dataKey="name" type="category" width={isMobile ? 70 : 150} tick={{ fontSize: isMobile ? 10 : 12 }} />
        <Tooltip formatter={(value: number) => [`${value} escuelas`, "Cantidad"]} />
        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
        <Bar dataKey="value" name="Escuelas" fill="#3fa038" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

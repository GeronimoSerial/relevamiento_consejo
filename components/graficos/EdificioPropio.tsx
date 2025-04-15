"use client"

import { useMemo, useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Escuela } from "@/types/escuela"

interface EdificioPropioProps {
  escuelas: Escuela[]
}

export default function EdificioPropio({ escuelas }: EdificioPropioProps) {
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

  // Colores para el gráfico
  const COLORS = ["#3fa038", "#f44336", "#9e9e9e"]

  // Procesar datos para el gráfico
  const data = useMemo(() => {
    // Si hay escuelas, usar datos reales
    if (escuelas && escuelas.length > 0) {
      // Contar escuelas con y sin edificio propio
      let conEdificioPropio = 0
      let sinEdificioPropio = 0
      let sinDatos = 0

      escuelas.forEach((escuela) => {
        if (escuela.tieneEdificioPropio === "Sí") {
          conEdificioPropio++
        } else if (escuela.tieneEdificioPropio === "No") {
          sinEdificioPropio++
        } else {
          sinDatos++
        }
      })

      const result = [
        { name: "Con edificio propio", value: conEdificioPropio },
        { name: "Sin edificio propio", value: sinEdificioPropio },
      ]

      // Solo incluir "Sin datos" si hay escuelas sin esta información
      if (sinDatos > 0) {
        result.push({ name: "Sin datos", value: sinDatos })
      }

      return result
    }

    // Si no hay escuelas, usar datos ficticios
    return [
      { name: "Con edificio propio", value: 75 },
      { name: "Sin edificio propio", value: 20 },
      { name: "Sin datos", value: 5 },
    ]
  }, [escuelas])

  // Calcular porcentajes para mostrar en el centro
  const totalEscuelas = escuelas.length || 100 // Valor por defecto para datos ficticios
  const porcentajeConEdificio = useMemo(() => {
    const conEdificio = data.find((item) => item.name === "Con edificio propio")?.value || 0
    return Math.round((conEdificio / totalEscuelas) * 100)
  }, [data, totalEscuelas])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={!isMobile}
          outerRadius={isMobile ? 80 : 120}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={isMobile ? undefined : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${value} escuelas (${((value / totalEscuelas) * 100).toFixed(1)}%)`,
            "Cantidad",
          ]}
        />
        <Legend
          layout={isMobile ? "horizontal" : "vertical"}
          verticalAlign={isMobile ? "bottom" : "middle"}
          align={isMobile ? "center" : "right"}
          wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

"use client"

import Link from "next/link"
import { BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

export default function StatsNavButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex justify-center mt-4 mb-6"
    >
      <Link
        href="/estadisticas"
        className="inline-flex items-center px-5 py-2.5 bg-verde text-white rounded-xl hover:bg-verde/90 transition-colors shadow-md hover:shadow-lg"
      >
        <BarChart3 className="h-5 w-5 mr-2" />
        Estadísticas y Gráficos
      </Link>
    </motion.div>
  )
}

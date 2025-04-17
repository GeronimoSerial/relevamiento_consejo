"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function BackToHome() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Link href="/" className="inline-flex items-center text-verde hover:text-verde/80 font-medium transition-colors">
        <ChevronLeft className="h-5 w-5 mr-1" />
        Volver al listado de escuelas
      </Link>
    </motion.div>
  )
}

"use client"

import { memo } from "react"
import { motion } from "framer-motion"

const Header = memo(function Header() {
  return (
    <header className="bg-white shadow-sm py-6 border-b border-verde">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Sistema de Relevamiento Escolar</h1>
          <p className="text-sm text-neutral-600 text-center mt-1">
            Consejo General de Educación -{" "}
            <span className="text-verde font-medium">Diseñado por el Centro de Cómputos</span>
          </p>
        </motion.div>
      </div>
    </header>
  )
})

export default Header

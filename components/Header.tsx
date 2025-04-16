"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { PartyPopper } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Sistema de Relevamiento Escolar</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 hover:bg-verde/10 rounded-full transition-colors">
                    <PartyPopper className="h-5 w-5 text-verde" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Escuelas que cumplen aniversario hoy</p>
                  <ul className="mt-2 text-xs space-y-1">
                    <li>• Escuela Primaria N°1</li>
                    <li>• Escuela Secundaria N°5</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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

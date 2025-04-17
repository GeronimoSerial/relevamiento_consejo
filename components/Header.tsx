"use client"

import { memo, useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, ChevronLeft, Menu, X, PartyPopper } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import AniversariosModal from "./principal/AniversariosModal"

// Componente para el botón de navegación
const NavButton = memo(function NavButton({
  onClick,
  icon: Icon,
  label,
  className,
}: {
  onClick: () => void
  icon: React.ElementType
  label: string
  className: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ delay: 0.1 }}
    >
      <button
        onClick={onClick}
        className={className}
      >
        <Icon className="h-4 w-4 mr-1.5" />
        <span className="font-medium">{label}</span>
      </button>
    </motion.div>
  )
})

// Componente para el logo
const Logo = memo(function Logo() {
  return (
    <Link href="/" className="group relative z-10">
      <div className="flex items-center gap-2">
        <Image
          src="/SIRE_logo.png"
          alt="SIRE Logo"
          width={40}
          height={40}
          className="h-10 w-10"
          priority
        />
        <div>
          <span className="font-bold text-gray-800 text-lg block">CGE</span>
          <span className="text-xs text-gray-600">Corrientes</span>
          <div className="h-0.5 w-0 bg-verde group-hover:w-full transition-all duration-300"></div>
        </div>
      </div>
    </Link>
  )
})

// Componente para el título central
const CentralTitle = memo(function CentralTitle() {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-verde/10 -z-10"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-verde/10 -z-10"></div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
          Sistema de Relevamiento Escolar
        </h1>
        <div className="flex items-center justify-center mt-1">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-verde/50"></div>
          <p className="text-xs text-gray-600 px-2">Diseñado por el <strong>Centro de Cómputos</strong></p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-verde/50"></div>
        </div>
      </div>
    </div>
  )
})

const Header = memo(function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isStatsPage = pathname === "/estadisticas"
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [showAniversariosModal, setShowAniversariosModal] = useState(false)

  // Determinar si estamos en una pantalla pequeña
  const isSmallScreen = useMemo(() => windowWidth > 0 && windowWidth < 640, [windowWidth])
  // Determinar si debemos mostrar el título central (solo en pantallas XL)
  const showCentralTitle = useMemo(() => windowWidth >= 1280, [windowWidth])

  // Detectar scroll y tamaño de ventana
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Inicializar el ancho de la ventana
    handleResize()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleAniversariosClick = useCallback(() => {
    setShowAniversariosModal(true)
    setMobileMenuOpen(false)
  }, [])

  const handleCloseAniversarios = useCallback(() => {
    setShowAniversariosModal(false)
  }, [])

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  return (
    <>
      <header
        className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-r from-verde/10 via-white to-verde/5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between relative">
            {/* Logo y título lateral */}
            <div className="flex items-center">
              <Logo />

              {/* Título lateral - Visible en pantallas MD-LG */}
              {!showCentralTitle && !isSmallScreen && (
                <div className="hidden md:block ml-6 border-l border-gray-200 pl-6">
                  <h1 className="text-base lg:text-lg font-bold text-gray-800">Sistema de Relevamiento Escolar</h1>
                </div>
              )}
            </div>

            {/* Título central - Solo visible en pantallas XL */}
            {showCentralTitle && <CentralTitle />}

            {/* Botones de navegación - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {isStatsPage ? (
                <NavButton
                  onClick={() => router.push("/")}
                  icon={ChevronLeft}
                  label="Volver al listado"
                  className="flex items-center px-4 py-2 bg-white text-verde border border-verde/30 rounded-full hover:border-verde hover:bg-verde/5 transition-all shadow-sm text-sm"
                />
              ) : (
                <>
                  <NavButton
                    onClick={() => router.push("/estadisticas")}
                    icon={BarChart3}
                    label="Estadísticas y Gráficos"
                    className="flex items-center px-4 py-2 bg-verde text-white rounded-full hover:bg-verde/90 transition-all shadow-md text-sm"
                  />

                  <NavButton
                    onClick={() => setShowAniversariosModal(true)}
                    icon={PartyPopper}
                    label="Aniversarios"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md text-sm"
                  />
                </>
              )}
            </div>

            {/* Botón de menú móvil */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-verde transition-colors"
              onClick={handleMobileMenuToggle}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-verde/20 via-verde to-verde/20"></div>
      </header>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-verde/20 shadow-md"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                {/* Título para móvil */}
                <div className="text-center py-2">
                  <h1 className="text-lg font-bold text-gray-800">Sistema de Relevamiento Escolar</h1>
                  <p className="text-xs text-gray-600">Diseñado por el <strong>Centro de Cómputos</strong></p>
                </div>

                {/* Botones de navegación para móvil */}
                {isStatsPage ? (
                  <NavButton
                    onClick={() => router.push("/")}
                    icon={ChevronLeft}
                    label="Volver al listado"
                    className="flex items-center justify-center px-3 py-2 bg-white text-verde border border-verde/30 rounded-xl hover:bg-verde/5 transition-colors text-sm"
                  />
                ) : (
                  <>
                    <NavButton
                      onClick={() => router.push("/estadisticas")}
                      icon={BarChart3}
                      label="Estadísticas y Gráficos"
                      className="flex items-center justify-center px-3 py-2 bg-verde text-white rounded-xl hover:bg-verde/90 transition-colors text-sm"
                    />

                    <NavButton
                      onClick={handleAniversariosClick}
                      icon={PartyPopper}
                      label="Aniversarios"
                      className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm"
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Aniversarios */}
      <AnimatePresence>
        {showAniversariosModal && (
          <AniversariosModal onClose={handleCloseAniversarios} />
        )}
      </AnimatePresence>
    </>
  )
})

export default Header

"use client"

import { AlertCircle, Home } from "lucide-react"
import Link from "next/link"

interface ErrorPageProps {
  title?: string
  message?: string
  showHomeButton?: boolean
}

export default function ErrorPage({
  title = "Algo salió mal",
  message = "Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.",
  showHomeButton = true
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            {showHomeButton && (
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-verde text-white rounded-md hover:bg-verde/90 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
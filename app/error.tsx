"use client"

import { useEffect } from "react"
import ErrorPage from "@/components/ErrorPage"
import { logError } from "@/lib/error-handling"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logError(error, {
      componentName: "Global Error Page",
      ...(error.digest ? { digest: error.digest } : {})
    })
  }, [error])

  return (
    <ErrorPage
      title="Error en la aplicación"
      message="Lo sentimos, ocurrió un error inesperado. Por favor, intente nuevamente más tarde."
    />
  )
} 
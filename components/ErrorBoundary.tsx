"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error no controlado:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-800">Algo salió mal</h2>
                <p className="mt-2 text-sm text-red-600">
                  {this.state.error?.message || "Ocurrió un error inesperado"}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 
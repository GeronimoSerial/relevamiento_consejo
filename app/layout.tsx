import type { Metadata } from "next"
import "@fontsource/montserrat/latin.css"
import "./globals.css"
import ErrorBoundary from "@/components/ErrorBoundary"

export const metadata: Metadata = {
  title: "Sistema de Relevamiento Escolar",
  description: "Consejo General de Educación - Centro de Cómputos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Eliminados los links a Google Fonts */}
      </head>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
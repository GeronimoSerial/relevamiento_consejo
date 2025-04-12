/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar optimizaciones de compilación
  
  // Optimizar imágenes
  images: {
    domains: ['placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configuración de compilación
  compiler: {
    // Eliminar console.logs en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimización de paquetes
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Configuración de webpack para reducir el tamaño del bundle
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones solo para producción
    if (!dev && !isServer) {
      // Dividir chunks para mejor caching
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      }
    }
    
    return config
  },
}

export default nextConfig

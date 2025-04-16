# Sistema de Relevamiento Escolar

Este proyecto es una aplicación web desarrollada con Next.js para el análisis y visualización de datos basados en el relevamiento escolar Correntino.

## 🚀 Tecnologías Principales

- **Next.js 14** - Framework de React para aplicaciones web
- **TypeScript** - Lenguaje de programación tipado
- **Tailwind CSS** - Framework de estilos
- **Shadcn UI** - Componentes de UI
- **Recharts** - Biblioteca para gráficos
- **Radix UI** - Componentes primitivos accesibles

## 📁 Estructura del Proyecto

```
├── app/                 # Rutas y páginas de la aplicación
├── components/          # Componentes reutilizables
│   └── graficos/       # Componentes específicos de gráficos
├── data/               # Datos y archivos de configuración
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades y configuraciones
├── public/             # Archivos estáticos
├── styles/             # Estilos globales
└── types/              # Definiciones de tipos TypeScript
```

## 🛠️ Requisitos Previos

- Node.js (versión 18 o superior)
- npm o pnpm

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/GeronimoSerial/relevamiento_consejo
```

2. Instalar dependencias:
```bash
npm install --legacy-peer-deps
# o
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
pnpm dev
```

## 📊 Características Principales

- Visualización de datos de matrícula escolar
- Gráficos interactivos
- Análisis de ratios y estadísticas
- Interfaz de usuario moderna y responsiva

## 🎨 Componentes Destacados

- `MatriculaBaja.tsx`: Componente para visualizar datos de matrícula baja
- Gráficos interactivos con Recharts
- Componentes de UI personalizados con Shadcn

## 📝 Licencia

Este proyecto está bajo la licencia MIT.


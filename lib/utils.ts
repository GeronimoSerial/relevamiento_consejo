import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function limpiarTexto(texto: string) {
    // Primero convertimos los títulos de escuelas que usan **
    texto = texto.replace(/\d+\.\s*\*\*(.*?)\*\*/g, (match) => {
      return match.replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>');
    });
          
    // Luego eliminamos cualquier otro uso de **
    texto = texto.replace(/\*\*(.*?)\*\*/g, '$1');
    
    return texto;
  }

  export function normalizarTexto(texto: unknown): string {
    if (texto === null || texto === undefined) return ""
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/\s+/g, " ") // Normalizar espacios múltiples a uno solo
      .trim()
  }
  
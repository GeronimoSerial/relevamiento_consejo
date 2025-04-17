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
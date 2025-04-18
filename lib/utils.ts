import { Escuela, supervisoresPorDepartamento } from "@/types/iEscuela";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getEscuelasDB } from "@/lib/data/getEscuelasDB";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAllEscuelas(): Promise<Escuela[]> {
  const { escuelas } = await getEscuelasDB();
  return escuelas;
}

export function limpiarTexto(texto: string) {
  // Primero convertimos los títulos de escuelas que usan **
  texto = texto.replace(/\d+\.\s*\*\*(.*?)\*\*/g, (match) => {
    return match.replace(/\*\*(.*?)\*\*/, "<strong>$1</strong>");
  });

  // Luego eliminamos cualquier otro uso de **
  texto = texto.replace(/\*\*(.*?)\*\*/g, "$1");

  return texto;
}

export function normalizarTexto(texto: unknown): string {
  if (texto === null || texto === undefined) return "";
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/\s+/g, " ") // Normalizar espacios múltiples a uno solo
    .trim();
}

export function filtrarEscuelas(
  escuelas: Escuela[],
  termino: string,
  supervisor = ""
): Escuela[] {
  return escuelas.filter((escuela) => {
    const terminoNormalizado = normalizarTexto(termino);
    const nombreNormalizado = normalizarTexto(escuela.nombre);
    const cueString = escuela.cue.toString();
    const directorNormalizado = escuela.director
      ? normalizarTexto(escuela.director)
      : "";
    const localidadNormalizada = escuela.localidad
      ? normalizarTexto(escuela.localidad)
      : "";
    const departamentoNormalizado = escuela.departamento
      ? normalizarTexto(escuela.departamento)
      : "";

    const coincideConTermino =
      terminoNormalizado === "" ||
      nombreNormalizado.includes(terminoNormalizado) ||
      cueString.includes(terminoNormalizado) ||
      directorNormalizado.includes(terminoNormalizado) ||
      localidadNormalizada.includes(terminoNormalizado) ||
      departamentoNormalizado.includes(terminoNormalizado);

    const coincideConSupervisor =
      supervisor === "" ||
      escuela.supervisor === supervisor ||
      (escuela.departamento &&
        supervisoresPorDepartamento[escuela.departamento]?.includes(
          supervisor
        ));

    return coincideConTermino && coincideConSupervisor;
  });
}

export function paginarEscuelas(
  escuelas: Escuela[],
  pagina: number,
  porPagina: number
): {
  escuelasPaginadas: Escuela[];
  totalPaginas: number;
} {
  const inicio = (pagina - 1) * porPagina;
  const fin = pagina * porPagina;
  const totalPaginas = Math.ceil(escuelas.length / porPagina);

  return {
    escuelasPaginadas: escuelas.slice(inicio, fin),
    totalPaginas,
  };
}

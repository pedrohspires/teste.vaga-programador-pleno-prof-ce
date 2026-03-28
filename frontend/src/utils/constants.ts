import type { selectOptionType } from "../services/global";
import type { tiposUsuarioType } from "../services/usuario";

export const optionsTipoUsuario: Array<selectOptionType<tiposUsuarioType>> = [
    { value: "PROFESSOR", label: "Professor" },
    { value: "ALUNO", label: "Aluno" },
]
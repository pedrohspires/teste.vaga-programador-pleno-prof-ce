import type { selectOptionType } from "../services/global";
import type { tiposUsuarioType } from "../services/usuario";

export const tiposUsuarioEnum = {
    Professor: "PROFESSOR",
    Aluno: "ALUNO",
} as const satisfies Record<string, tiposUsuarioType>;

export const optionsTipoUsuario: Array<selectOptionType<tiposUsuarioType>> = [
    { value: tiposUsuarioEnum.Professor as tiposUsuarioType, label: "Professor" },
    { value: tiposUsuarioEnum.Aluno as tiposUsuarioType, label: "Aluno" },
]
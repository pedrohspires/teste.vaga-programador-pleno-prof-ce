import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/requests";
import type { baseType } from "./api";
import type { selectOptionType } from "./global";

const api = "/api/aluno-turma";

export type alunoTurmaType = {
    aluno: number;
    nome_aluno: string;
    turma: number;
    descricao_turma: number;
} & baseType;

export type alunoTurmaFormType = {
    aluno: selectOptionType<number> | null;
}

export type addOrUpdateAlunoTurmaType = {
    aluno: number
    turma: number
}

export const getAlunoTurmaListagem = async (idTurma: number) => {
    const response = await getRequest<Array<alunoTurmaType>>(`${api}/listar-por-turma/${idTurma}/`);
    return response;
}

export const deleteAlunoTurma = async (id: number) => {
    const response = await deleteRequest<alunoTurmaType>(`${api}/${id}/`);
    return response;
}

export const postAlunoTurma = async (payload: addOrUpdateAlunoTurmaType) => {
    const response = await postRequest<alunoTurmaType>(`${api}/`, payload);
    return response;
}

export const putAlunoTurma = async (id: number, payload: addOrUpdateAlunoTurmaType) => {
    const response = await putRequest<alunoTurmaType>(`${api}/${id}/`, payload);
    return response;
}

export const getAlunoTurmaById = async (id: number) => {
    const response = await getRequest<alunoTurmaType>(`${api}/${id}/`);
    return response;
}
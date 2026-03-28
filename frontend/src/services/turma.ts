import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/requests";
import type { baseFiltrosPaginadosType, baseType, dadosPaginados } from "./api";

const api = "/api/turma";

export type filtroTurmaType = {
    search: string
} & baseFiltrosPaginadosType;

export type turmaType = {
    descricao: string;
} & baseType;

export type turmaFormType = {
    descricao: string
}

export type addOrUpdateTurmaType = {
    descricao: string
    id_professor: number
}

export const postTurmaListagem = async (payload: filtroTurmaType) => {
    const response = await postRequest<dadosPaginados<turmaType>>(`${api}/listagem/`, payload);
    return response;
}

export const deleteTurma = async (id: number) => {
    const response = await deleteRequest<turmaType>(`${api}/${id}/`);
    return response;
}

export const postTurma = async (payload: addOrUpdateTurmaType) => {
    const response = await postRequest<turmaType>(`${api}/`, payload);
    return response;
}

export const putTurma = async (id: number, payload: addOrUpdateTurmaType) => {
    const response = await putRequest<turmaType>(`${api}/${id}/`, payload);
    return response;
}

export const getTurmaById = async (id: number) => {
    const response = await getRequest<turmaType>(`${api}/${id}/`);
    return response;
}
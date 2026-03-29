import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/requests";
import type { baseFiltrosPaginadosType, baseType, dadosPaginados } from "./api";
import type { selectOptionType } from "./global";

const api = "/api/atividade";

export type filtroAtividadeType = {
    search: string
    id_turma: number | null
} & baseFiltrosPaginadosType;

export type atividadeType = {
    titulo: string;
    descricao: string;
    data_entrega: string;
    turma: string;
    turma_descricao: string;
} & baseType;

export type atividadeFormType = {
    titulo: string;
    descricao: string;
    data_entrega: string;
    turma: selectOptionType<number>;
}

export type addOrUpdateAtividadeType = {
    titulo: string;
    descricao: string;
    data_entrega: string;
    turma: number;
}

export const postAtividadeListagem = async (payload: filtroAtividadeType) => {
    const response = await postRequest<dadosPaginados<atividadeType>>(`${api}/listagem/`, payload);
    return response;
}

export const deleteAtividade = async (id: number) => {
    const response = await deleteRequest<atividadeType>(`${api}/${id}/`);
    return response;
}

export const postAtividade = async (payload: addOrUpdateAtividadeType) => {
    const response = await postRequest<atividadeType>(`${api}/`, payload);
    return response;
}

export const putAtividade = async (id: number, payload: addOrUpdateAtividadeType) => {
    const response = await putRequest<atividadeType>(`${api}/${id}/`, payload);
    return response;
}

export const getAtividadeById = async (id: number) => {
    const response = await getRequest<atividadeType>(`${api}/${id}/`);
    return response;
}
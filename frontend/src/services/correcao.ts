import { getRequest, postRequest, putRequest } from "../utils/requests";
import type { baseType } from "./api";
import type { respostaType } from "./resposta";

const api = "/api/correcao";

export type correcaoType = {
    resposta: respostaType;
    nota: number;
    feedback: string;
} & baseType;

export type correcaoFormType = {
    resposta: number;
    nota: number;
    feedback: string;
}

export type addOrUpdateCorrecaoType = {
    resposta: number;
    nota: number;
    feedback: string;
}

export const postCorrecao = async (payload: addOrUpdateCorrecaoType) => {
    const response = await postRequest<correcaoType>(`${api}/`, payload);
    return response;
}

export const putCorrecao = async (id: number, payload: addOrUpdateCorrecaoType) => {
    const response = await putRequest<correcaoType>(`${api}/${id}/`, payload);
    return response;
}

export const getCorrecaoByResposta = async (idResposta: number) => {
    const response = await getRequest<correcaoType>(`${api}/buscar/${idResposta}/`);
    return response;
}

export const getCorrecaoByAtividade = async (idAtividade: number) => {
    const response = await getRequest<correcaoType>(`${api}/atividade/${idAtividade}/`);
    return response;
}

export const getCorrecaoById = async (id: number) => {
    const response = await getRequest<correcaoType>(`${api}/${id}/`);
    return response;
}
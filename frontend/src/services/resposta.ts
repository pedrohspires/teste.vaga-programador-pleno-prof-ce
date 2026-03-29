import { getRequest, patchRequest, postRequest } from "../utils/requests";
import type { baseType } from "./api";

const api = "/api/respostas";

export type respostaType = {
    aluno: number;
    nome_aluno: string;
    atividade: number;
    titulo_atividade: number;
    conteudo_resposta: string;
} & baseType;

export type respostaFormType = {
    conteudo_resposta: string;
}

export type addOrUpdateRespostaType = {
    aluno: number;
    atividade: number;
    conteudo_resposta: string;
}

export const postResposta = async (payload: addOrUpdateRespostaType) => {
    const response = await postRequest<respostaType>(`${api}/`, payload);
    return response;
}

export const patchResposta = async (id: number, payload: addOrUpdateRespostaType) => {
    const response = await patchRequest<respostaType>(`${api}/${id}/`, payload);
    return response;
}

export const getRespostaByAtividadeAluno = async (idAtividade: number, idAluno: number) => {
    const response = await getRequest<respostaType>(`${api}/buscar/${idAtividade}/${idAluno}/`);
    return response;
}

export const getRespostaByAtividade = async (idAtividade: number) => {
    const response = await getRequest<respostaType>(`${api}/atividade/${idAtividade}/`);
    return response;
}
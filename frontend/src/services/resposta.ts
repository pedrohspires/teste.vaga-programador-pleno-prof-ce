import { getRequest, patchRequest, postRequest } from "../utils/requests";
import type { baseType } from "./api";

const api = "/api/respostas";

export type respostaType = {
    aluno: number;
    atividade: number;
    conteudo_resposta: string;
    feedback: string;
} & baseType;

export type respostaFormType = {
    conteudo_resposta: string;
    feedback: string;
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

export const getRespostaByAtividadeId = async (idAtividade: number, idAluno: number) => {
    const response = await getRequest<respostaType>(`${api}/${idAtividade}/${idAluno}/`);
    return response;
}
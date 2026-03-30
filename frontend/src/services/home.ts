import { getRequest } from "../utils/requests";
import type { atividadeType } from "./atividade";
import type { correcaoType } from "./correcao";

const api = "/api/me";

export const getMeAtividadeByUser = async () => {
    const response = await getRequest<Array<atividadeType>>(`${api}/atividades`);
    return response;
}

export const getMeCorrecoes = async () => {
    const response = await getRequest<Array<correcaoType>>(`${api}/correcoes/`);
    return response;
}

export const getMeCorrecoesById = async (idCorrecao: number) => {
    const response = await getRequest<correcaoType>(`${api}/correcoes/${idCorrecao}/`);
    return response;
}
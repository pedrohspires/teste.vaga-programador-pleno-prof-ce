import { getRequest } from "../utils/requests";
import type { atividadeType } from "./atividade";

const api = "/api/me";

export const getAtividadeByUser = async () => {
    const response = await getRequest<Array<atividadeType>>(`${api}/atividades`);
    return response;
}
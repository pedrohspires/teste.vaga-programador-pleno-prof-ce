import { deleteRequest, getRequest, patchRequest, postRequest, putRequest } from "../utils/requests";
import type { baseFiltrosPaginadosType, baseType, dadosPaginados } from "./api";
import type { selectOptionType } from "./global";

const api = "/api/usuario";

export type tiposUsuarioType = "PROFESSOR" | "ALUNO";

export type filtroUsuarioType = {
    search: string
    tipo: tiposUsuarioType | null
} & baseFiltrosPaginadosType;

export type usuarioType = {
    nome: string;
    email: string;
    tipo: tiposUsuarioType
} & baseType;

export type usuarioFormType = {
    nome: string
    email: string
    password: string
    tipo: selectOptionType<tiposUsuarioType>
}

export type addOrUpdateUsuarioType = {
    nome: string
    email: string
    tipo: tiposUsuarioType
    password?: string
}

export type usuarioLogadoType = {
    id: number
    nome: string
    email: string
    tipo: tiposUsuarioType
}

export const postUsuarioListagem = async (payload: filtroUsuarioType) => {
    const response = await postRequest<dadosPaginados<usuarioType>>(`${api}/listagem/`, payload);
    return response;
}

export const deleteUsuario = async (id: number) => {
    const response = await deleteRequest<usuarioType>(`${api}/${id}/`);
    return response;
}

export const postUsuario = async (payload: addOrUpdateUsuarioType) => {
    const response = await postRequest<usuarioType>(`${api}/`, payload);
    return response;
}

export const putUsuario = async (id: number, payload: addOrUpdateUsuarioType) => {
    const response = await putRequest<usuarioType>(`${api}/${id}/`, payload);
    return response;
}

export const getUsuarioById = async (id: number) => {
    const response = await getRequest<usuarioType>(`${api}/${id}/`);
    return response;
}

export const patchAlterarSenha = async (data: { id: number; password: string }) => {
    const { id, password } = data;
    return await patchRequest<any>(`${api}/${id}/AlterarSenha/`, { password });
}
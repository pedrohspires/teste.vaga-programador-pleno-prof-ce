import { deleteRequest, getRequest, postRequest, putRequest, patchRequest } from "../utils/requests";
import type { dadosPaginados } from "./api";

const api = "/api/usuario";

export type FiltroUsuarioType = {
    currentPage: number;
    pageSize: number;
    pesquisa?: string | null;
    ativo?: boolean | null;
}

export type UsuarioType = {
    id: string;
    nome: string;
    login: string;
    hashSenha: string;
    idPerfilAcesso: string;
    ativo: boolean;
    idPessoa?: string | null;
    perfilAcesso?: {
        id: string;
        descricao: string;
    };
}

export type UsuarioCadastroType = {
    nome: string;
    login: string;
    senha?: string;
    confirmacaoSenha?: string;
    idPerfilAcesso: string;
    ativo: boolean;
    idPessoa?: string | null;
}

export type UsuarioEdicaoType = {
    nome?: string;
    login?: string;
    hashSenha?: string;
    idPerfilAcesso?: string;
    ativo?: boolean;
    idPessoa?: string | null;
}

export type usuarioLogadoType = {
    id: string
    nome: string
    login: string
    ativo: boolean
    idPerfilAcesso: string
    descricaoPerfilAcesso: string
    idPessoa?: string | null
    razaoSocialPessoa?: string | null
}

export const postUsuarioListagem = async (payload: FiltroUsuarioType) => {
    const response = await postRequest<dadosPaginados<UsuarioType>>(`${api}/listagem`, payload);
    return response;
}

export const deleteUsuario = async (id: string) => {
    const response = await deleteRequest<UsuarioType>(`${api}/${id}`);
    return response;
}

export const postUsuario = async (payload: UsuarioCadastroType) => {
    const response = await postRequest<UsuarioType>(`${api}`, payload);
    return response;
}

export const putUsuario = async (id: string, payload: UsuarioEdicaoType) => {
    const response = await putRequest<UsuarioType>(`${api}/${id}`, payload);
    return response;
}

export const getUsuarioById = async (id: string) => {
    const response = await getRequest<UsuarioType>(`${api}/${id}`);
    return response;
}

export const patchAlterarSenha = async (data: { id: string; senha: string; confirmacaoSenha: string }) => {
    const { id, senha, confirmacaoSenha } = data;
    return await patchRequest<any>(`${api}/AlterarSenha/${id}`, { senha, confirmacaoSenha });
}
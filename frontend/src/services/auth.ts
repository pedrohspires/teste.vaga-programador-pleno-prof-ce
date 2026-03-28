import { getRequest, postRequest } from '../utils/requests';
import type { usuarioLogadoType } from './usuario';

const api = '/api/auth';

type LoginResponse = string;

export type loginFormType = {
  email: string;
  password: string;
}

export type loginType = {
  email: string;
  password: string;
}

export const postAuthLogin = async (dados: loginType) => {
  const response = await postRequest<LoginResponse>(`${api}/login`, dados);
  return response;
};

export const getAuthUsuarioLogado = async () => {
  const response = await getRequest<usuarioLogadoType>(`${api}/usuario-logado`);
  return response;
};


export const authLogout = async () => {
  const response = await postRequest(`${api}/logout`, {});
  return response;
};
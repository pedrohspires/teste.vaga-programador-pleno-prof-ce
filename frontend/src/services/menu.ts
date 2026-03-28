import { getRequest } from '../utils/requests';

const api = "/api/menu";

export type menuType = {
  menuPesquisa: menuItemType[];
  menuPrincipal: menuItemType[];
}

export type menuItemType = {
  descricao: string,
  path: string,
  icone: string,
  ativo: boolean,
  submenus?: menuItemType[]
}


export const getMenu = async (controllerAtual: string) => {
  const response = await getRequest<menuType>(`${api}/${controllerAtual}`);
  return response;
};

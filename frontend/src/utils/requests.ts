import { isAxiosError, type AxiosResponse } from "axios";
import { getAxiosInstance } from "../axiosConfig";

export type retornoRequest<T> = {
  status: number;
  dados?: T;
  mensagem?: string;
  success: boolean;
}

const successHandler = (response: AxiosResponse<any>) => {
  return {
    status: response.status,
    dados: response.data,
    mensagem: "",
    success: true
  };
}

const errorHandler = (err: unknown) => {
  if (isAxiosError(err)) {
    if (err.response?.status == 401) {
      return {
        status: 401,
        dados: undefined,
        mensagem: "Não autorizado",
        success: false
      }
    }

    return {
      status: err.response?.status || 500,
      dados: undefined,
      mensagem: err.response?.data.error || "Erro de conexão",
      success: false
    }
  }

  return {
    status: 500,
    dados: undefined,
    mensagem: "Erro desconhecido: " + err,
    success: false
  }
}

export const getRequest = async <T = unknown>(url: string): Promise<retornoRequest<T>> => {
  const Instance = getAxiosInstance();

  try {
    const response: AxiosResponse<T> = await Instance.get<T>(url);
    return successHandler(response);
  } catch (err: unknown) {
    return errorHandler(err);
  }
};

export const postRequest = async <T = unknown>(url: string, data?: any): Promise<retornoRequest<T>> => {
  const Instance = getAxiosInstance();

  try {
    const response: AxiosResponse<T> = await Instance.post<T>(url, data);
    return successHandler(response);
  } catch (err: unknown) {
    return errorHandler(err);
  }
};

export const putRequest = async <T = unknown>(url: string, data?: any): Promise<retornoRequest<T>> => {
  const Instance = getAxiosInstance();

  try {
    const response: AxiosResponse<T> = await Instance.put<T>(url, data);
    return successHandler(response);
  } catch (err: unknown) {
    return errorHandler(err);
  }
};

export const patchRequest = async <T = unknown>(url: string, data?: any): Promise<retornoRequest<T>> => {
  const Instance = getAxiosInstance();

  try {
    const response: AxiosResponse<T> = await Instance.patch<T>(url, data);
    return successHandler(response);
  } catch (err: unknown) {
    return errorHandler(err);
  }
};

export const deleteRequest = async <T = unknown>(url: string): Promise<retornoRequest<T>> => {
  const Instance = getAxiosInstance();

  try {
    const response: AxiosResponse<T> = await Instance.delete<T>(url);
    return successHandler(response);
  } catch (err: unknown) {
    return errorHandler(err);
  }
};

export const postFileRequest = async <T = unknown>(url: string, data: any): Promise<retornoRequest<T>> => {
  const Instance = getAxiosInstance(10000, "multipart/form-data");

  try {
    const response: AxiosResponse<T> = await Instance.post<T>(url, data);
    return successHandler(response);
  } catch (err: unknown) {
    return errorHandler(err);
  }
};
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

const errorHandler = (err: unknown): retornoRequest<any> => {
  if (isAxiosError(err)) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    let mensagemFinal = "Erro de conexão";

    if (data) {
      if (data.detail) {
        if (Array.isArray(data.detail))
          mensagemFinal = data.detail[0]
        else
          mensagemFinal = data.detail;
      }
      else if (data.message) {
        mensagemFinal = data.message;
      }
      else if (typeof data === 'object') {
        const firstErrorKey = Object.keys(data)[0];
        const firstErrorValue = data[firstErrorKey];

        if (Array.isArray(firstErrorValue)) {
          mensagemFinal = firstErrorValue[0];
        } else if (typeof firstErrorValue === 'string') {
          mensagemFinal = firstErrorValue;
        }
      }
    }

    if (status === 401 && mensagemFinal === "Erro de conexão") {
      mensagemFinal = "Sessão expirada ou não autorizado";
    }

    return {
      status,
      dados: undefined,
      mensagem: mensagemFinal,
      success: false
    };
  }

  return {
    status: 500,
    dados: undefined,
    mensagem: "Erro inesperado: " + (err instanceof Error ? err.message : err),
    success: false
  };
};

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
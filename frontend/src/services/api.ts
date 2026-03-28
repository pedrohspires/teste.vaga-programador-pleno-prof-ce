export interface dadosPaginados<T> {
    items: T[];
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface baseType {
    id: number;
    created_at: string,
    updated_at: string
}

export interface baseFiltrosPaginadosType {
    currentPage: number,
    pageSize: number,
}
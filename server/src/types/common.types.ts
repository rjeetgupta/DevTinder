export interface ApiResponse<T> {
    message: string;
    data?: T;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface ErrorResponse {
    success: false;
    message: string;
    status?: number;
}

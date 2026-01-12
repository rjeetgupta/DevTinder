class ApiError extends Error {
    statusCode: number;
    success: boolean;
    errors: any[];
    data: any;

    constructor(statusCode: number, message: string, errors: any[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;
    }
}

export default ApiError;

export class AppError extends Error {
    status: number;
    constructor(
        name: string,
        message: string,
        status?: number
    ) {
        super(message);
        this.name = name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
    }
}
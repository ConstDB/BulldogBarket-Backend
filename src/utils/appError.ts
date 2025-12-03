class AppError extends Error{
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number){
        super(message);
        this.statusCode = statusCode;
        this.status = `${
            this.statusCode.toString().startsWith("4") ? "Failed" : "Error"
        }`;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}
export default AppError;
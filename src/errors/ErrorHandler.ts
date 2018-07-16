import { Helpers } from "../helpers";
import { AppError } from "./AppError";

export module ErrorHandler {
    export function handleErrorResponses(error: Error, res, Method: string = 'unknown', Controller: string = 'unknown') {
        let status = 500;
        let _errorMessage;
        if (Helpers.isJson(error.message))
            _errorMessage = JSON.parse(error.message);
        else
            _errorMessage = error.message;
        if (error instanceof AppError) {
            status = error.status;
        }
        console.log(`ERROR at Method: ${Method} , Controller: ${Controller}`);
        console.log('Error Name :', error.name);
        console.log('Error Message :', _errorMessage);
        console.log('Error StackTrace :', error.stack);
        return res.status(status).json({
            success: false,
            error: {
                name: error.name,
                message: _errorMessage
            }
        });
    }

}
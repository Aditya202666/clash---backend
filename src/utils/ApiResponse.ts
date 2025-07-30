

type ApiResponseDataType = Record<string, any>
class ApiResponse {
    statusCode: number;
    message: string;
    success: boolean
    data: ApiResponseDataType

    constructor(statusCode: number, message: string, data:ApiResponseDataType = {}) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
        this.data = data
    }
}

export default ApiResponse
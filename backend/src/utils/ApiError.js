class ApiError {
    constructor(
        status,
        message = "Something went wrong",
    ) {
        this.status = status;
        this.message = message;
        this.success = false;
    }
}

export { ApiError }
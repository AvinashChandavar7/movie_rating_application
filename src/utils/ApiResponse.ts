class ApiResponse {
  public statusCode: number;
  public data: null | any;
  public message: string | Record<string, any>;
  public success: boolean;

  constructor(
    statusCode: number,
    data: any,
    message: string | Record<string, any> = "Success"
  ) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };

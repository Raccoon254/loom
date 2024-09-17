export abstract class BaseController {
  // Common methods or properties can be added here
  // For example, you might include methods for error handling or response formatting

  protected sendSuccessResponse(res: any, data: any, message = 'Success') {
    res.status(200).json({ message, data });
  }

  protected sendErrorResponse(res: any, error: any, statusCode = 500) {
    res.status(statusCode).json({ error: error.message || 'An error occurred' });
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

type ExceptionDetailsType = {
  error: string;
  message: string;
  statusCode: number;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private formError(exception: unknown): ExceptionDetailsType {
    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      if (!(resp instanceof Error)) {
        if (typeof resp === 'string') {
          return {
            error: 'Unknown error',
            message: resp,
            statusCode: exception.getStatus(),
          };
        }
        return resp as ExceptionDetailsType;
      }
      return {
        error: exception.name,
        message: exception.message,
        statusCode: exception.getStatus(),
      };
    } else if (exception instanceof Error) {
      return {
        error: exception.name,
        message: exception.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    } else {
      return {
        error: 'Unknown error',
        message: JSON.stringify(exception),
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const errorDetails = this.formError(exception);
    const responseBody = {
      ...errorDetails,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, errorDetails.statusCode);
  }
}

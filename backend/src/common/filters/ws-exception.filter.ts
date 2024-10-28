import {
  ArgumentsHost,
  Catch,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException, Error)
export class WsExceptionsFilter implements ExceptionFilter {
  public catch(exception: HttpException | WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    this.handleError(client, exception);
  }

  public handleError(
    client: Socket,
    exception: HttpException | WsException | Error,
  ) {
    let status;
    let message;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message = response?.['message'] ?? response;
    } else if (exception instanceof WsException) {
      message = exception.message;
      status = 'error';
    } else {
      message = exception.message;
      status = 'error';
    }

    client.emit('error', { status, message });
  }
}

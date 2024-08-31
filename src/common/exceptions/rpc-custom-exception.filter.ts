
import { Catch, ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError() as { message: string, status: number };

    if(typeof rpcError === 'object' && rpcError.status && rpcError.message ) {
      return response.status(rpcError.status).json({
        status: rpcError.status,
        message: rpcError.message,
      })
    }

    return response.status(500).json({
      status: 500,
      message: "Internal Server Error",
    })

  }

}

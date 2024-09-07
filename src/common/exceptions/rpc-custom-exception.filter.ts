
import { Catch, ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

  catch(exception: RpcException, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError() as { message: string, status: number };

    console.log('Rpc Error: ', rpcError.message);

    if(rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError.message,
      })
    }

    if(typeof rpcError === 'object' && rpcError.status && rpcError.message ) {
      return response.status(rpcError.status).json({
        status: rpcError.status,
        message: rpcError.toString(),
      })
    }

    return response.status(500).json({
      status: 500,
      message: "Internal Server Error",
    })

  }

}

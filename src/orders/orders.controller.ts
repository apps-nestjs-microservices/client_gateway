import { Controller, Get, Post, Body, Patch, Param, Inject, Query, ParseUUIDPipe } from "@nestjs/common";
import { CreateOrderDto } from './dto';
import { NATS_SERVICE } from "../config";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { OrderPaginationDto } from "./dto";
import { PaginationDto } from "../common";
import { StatusDto } from "./dto/status.dto";

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', paginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.client.send('findOneOrder', {id})
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    try {
      return await firstValueFrom(
        this.client.send('changeOrderStatus', {
          id,
          status: statusDto.status,
        })
      )
    } catch (error) {
      throw new RpcException(error);
    }
  }

}

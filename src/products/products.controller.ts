import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { PRODUCT_SERVICE } from "../config";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PaginationDto } from "../common";
import { CreateProductDto } from "./dto/create-product.dto";
import { firstValueFrom } from "rxjs";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'create_product' }, createProductDto)
      )
    } catch (error) {
      throw new RpcException(error);
    }

  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'find_products' },paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number){
    try {

      return await firstValueFrom(
        this.productsClient.send({ cmd: 'find_product' }, { id })
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ){
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'update_product' }, {
          id,
          ...updateProductDto,
        })
      )
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number){
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'delete_product' }, { id })
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

}

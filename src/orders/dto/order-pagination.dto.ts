import { PaginationDto } from "../../common";
import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto {

  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Possible status values are ${OrderStatusList}`
  })
  status: OrderStatus;

}
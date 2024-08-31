import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {

  @IsString()
  public name: string;

  @IsBoolean()
  @IsOptional()
  public available: boolean;

  @IsNumber({maxDecimalPlaces: 4})
  @Min(0)
  @Type(() => Number)
  public price: number;

}

import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

// // Enum to represent order status
// export enum OrderStatus {
//   PENDING = 'PENDING',
//   DELIVERED = 'DELIVERED',
//   CANCELLED = 'CANCELLED',
// }

// DTO for the order item
class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  book: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  //   @IsNotEmpty()
  //   @IsNumber()
  //   points: number;
}

// Main DTO for the order
export class CreateOrderDto {
  //   @IsNumber()
  //   //   @IsNotEmpty()
  //   totalPoints: number;

  //   @IsEnum(OrderStatus)
  //   status: OrderStatus = OrderStatus.PENDING;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  //   @IsNotEmpty()
  //   @IsString()
  //   user: string;
}

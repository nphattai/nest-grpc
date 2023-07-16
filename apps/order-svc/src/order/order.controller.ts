import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './order.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { ORDER_SERVICE_NAME } from 'proto/dist/order.pb';

@Controller('order')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @GrpcMethod(ORDER_SERVICE_NAME, 'createOrder')
  async createOrder(payload: CreateOrderRequestDto) {
    return this.service.createOrder(payload);
  }
}

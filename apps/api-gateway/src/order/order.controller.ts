import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ORDER_SERVICE_NAME,
  OrderServiceClient,
} from 'proto/dist/order.pb';

@Controller('order')
export class OrderController implements OnModuleInit {
  private svc: OrderServiceClient;

  constructor(
    @Inject(ORDER_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(
    @Req() req: Request,
  ): Promise<Observable<CreateOrderResponse>> {
    const createOrderReq: CreateOrderRequest = req.body;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createOrderReq.userId = req.user;

    return this.svc.createOrder(createOrderReq);
  }
}

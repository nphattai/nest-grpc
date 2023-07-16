import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateOrderRequestDto } from './order.dto';
import { Order } from './order.entity';
import { CreateOrderResponse } from './order.pb';
import { PRODUCT_SERVICE_NAME, ProductServiceClient } from './product.pb';

@Injectable()
export class OrderService implements OnModuleInit {
  private svc: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_NAME)
    private readonly client: ClientGrpc,
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
  ) {}

  onModuleInit() {
    this.svc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async createOrder(
    payload: CreateOrderRequestDto,
  ): Promise<CreateOrderResponse> {
    const { productId, userId, quantity } = payload;

    // find product
    const productRes = await firstValueFrom(
      this.svc.findOne({ id: productId }),
    );

    const product = productRes?.data;

    if (!product) {
      return {
        status: HttpStatus.NOT_FOUND,
        id: null,
        error: ['Product not found'],
      };
    }

    if (!product?.stock) {
      return {
        status: HttpStatus.BAD_REQUEST,
        id: null,
        error: ['Out of stock'],
      };
    }

    // check quantity
    if (quantity > product.stock) {
      return {
        status: HttpStatus.BAD_REQUEST,
        id: null,
        error: ['Not enough stock'],
      };
    }

    // create order
    const newOrder = new Order();
    newOrder.productId = productId;
    newOrder.userId = userId;
    newOrder.price = product.price * quantity;

    const order = await this.repo.save(newOrder);

    const decreaseProductStockRes = await firstValueFrom(
      this.svc.decreaseStock({
        id: productId,
        orderId: order.id,
        quantity,
      }),
    );

    if (decreaseProductStockRes.status !== HttpStatus.OK) {
      await this.repo.delete(order.id);

      return {
        status: HttpStatus.CONFLICT,
        error: decreaseProductStockRes.error,
        id: null,
      };
    }

    return { status: HttpStatus.OK, id: order.id, error: null };
  }
}

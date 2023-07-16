import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateProductRequest,
  CreateProductResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from 'proto/interfaces/product.pb';

@Controller('product')
export class ProductController implements OnModuleInit {
  private svc: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.svc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() body: CreateProductRequest,
  ): Promise<Observable<CreateProductResponse>> {
    return this.svc.createProduct(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getProduct(
    @Param('id') id: number,
  ): Promise<Observable<FindOneResponse>> {
    return this.svc.findOne({ id });
  }
}

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateProductRequestDto,
  DecreaseStockRequestDto,
  FindOneRequestDto,
} from './product.dto';
import {
  CreateProductResponse,
  DecreaseStockResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
} from './product.pb';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'createProduct')
  async createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    return this.productService.createProduct({
      ...payload,
    });
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'findOne')
  async findOne(payload: FindOneRequestDto): Promise<FindOneResponse> {
    return this.productService.findOne({
      ...payload,
    });
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'decreaseStock')
  async decreaseStock(
    payload: DecreaseStockRequestDto,
  ): Promise<DecreaseStockResponse> {
    return this.productService.decreaseStock({
      ...payload,
    });
  }
}

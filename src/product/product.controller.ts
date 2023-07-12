import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateProductRequestDto, FindOneRequestDto } from './product.dto';
import {
  CreateProductResponse,
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
}

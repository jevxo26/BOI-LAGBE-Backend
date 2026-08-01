import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductQueryDto } from './dto/list-product-query.dto';
import { PublishProductDto } from './dto/publish-product.dto';
import { ListProductReviewQueryDto } from './dto/list-product-review-query.dto';
import { ModerateProductReviewDto } from './dto/moderate-product-review.dto';

// All product routes require authentication (global StrictJwtAuthGuard) AND
// the ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before the parameterized :id route.
@Controller('admin/products')
@AdminOnly()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ---------- REFERENCE DATA (categories / subcategories / brands) ----------

  @Get('categories')
  async findCategories() {
    return this.productsService.findCategories();
  }

  @Get('subcategories')
  async findSubCategories(@Query('categoryId') categoryId?: string) {
    return this.productsService.findSubCategories(categoryId);
  }

  @Get('brands')
  async findBrands() {
    return this.productsService.findBrands();
  }

  // ---------- REVIEW MODERATION ----------

  @Get('reviews')
  async findAllReviews(@Query() query: ListProductReviewQueryDto) {
    return this.productsService.findAllReviews(query);
  }

  @Patch('reviews/:id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Body() dto: ModerateProductReviewDto,
    @Req() req: AdminRequest,
  ) {
    return this.productsService.moderateReview(id, dto, req);
  }

  // ---------- PRODUCTS ----------

  @Get()
  async findAll(@Query() query: ListProductQueryDto) {
    return this.productsService.findAllProducts(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @Post()
  async create(@Body() dto: CreateProductDto, @Req() req: AdminRequest) {
    return this.productsService.createProduct(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: AdminRequest,
  ) {
    return this.productsService.updateProduct(id, dto, req);
  }

  @Post(':id/publish')
  async publish(
    @Param('id') id: string,
    @Body() dto: PublishProductDto,
    @Req() req: AdminRequest,
  ) {
    return this.productsService.publishProduct(id, dto, req);
  }

  @Post(':id/sync-inventory')
  async syncInventory(@Param('id') id: string, @Req() req: AdminRequest) {
    return this.productsService.syncInventory(id, req);
  }
}

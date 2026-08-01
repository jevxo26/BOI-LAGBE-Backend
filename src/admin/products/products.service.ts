import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QueryBuilder } from '../common/utils/query-builder';
import { cleanDto, slugify } from '../common/utils/dto.util';
import { AdminAuditService } from '../common/services/admin-audit.service';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductQueryDto } from './dto/list-product-query.dto';
import { PublishProductDto } from './dto/publish-product.dto';
import { ListProductReviewQueryDto } from './dto/list-product-review-query.dto';
import { ModerateProductReviewDto } from './dto/moderate-product-review.dto';
import {
  Product,
  ProductStatus,
  ProductCategory,
  ProductCategoryStatus,
  ProductSubCategory,
  ProductSubCategoryStatus,
  ProductBrand,
  ProductBrandStatus,
  ProductReview,
  ProductInventory,
} from './entities';
import {
  Inventory,
  StockMovement,
  StockMovementType,
} from '../warehouses/entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductSubCategory)
    private readonly subCategoryRepository: Repository<ProductSubCategory>,
    @InjectRepository(ProductBrand)
    private readonly brandRepository: Repository<ProductBrand>,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
    @InjectRepository(ProductInventory)
    private readonly productInventoryRepository: Repository<ProductInventory>,
    @InjectRepository(Inventory)
    private readonly warehouseInventoryRepository: Repository<Inventory>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- PRODUCTS ----------

  async findAllProducts(query: ListProductQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.subcategoryId) where.subcategoryId = query.subcategoryId;
    if (query.brandId) where.brandId = query.brandId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['name', 'productCode', 'slug'],
      sortableFields: ['name', 'productCode', 'createdAt', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.productRepository.findAndCount({
      ...options,
      relations: { category: true, subcategory: true, brand: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, subcategory: true, brand: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(dto: CreateProductDto, req: AdminRequest) {
    await this.validateReferences(
      dto.categoryId,
      dto.subcategoryId,
      dto.brandId,
    );

    const product = this.productRepository.create({
      ...cleanDto(dto),
      slug: dto.slug ?? slugify(dto.name, 'product'),
      createdBy: req.user.id,
    });
    const saved = await this.productRepository.save(product);

    await this.adminAuditService.log(
      req,
      'PRODUCTS',
      'CREATE',
      'Product',
      saved.id,
      `Created product "${saved.name}"`,
      undefined,
      saved,
    );

    return { message: 'Product created successfully', product: saved };
  }

  async updateProduct(id: string, dto: UpdateProductDto, req: AdminRequest) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId || dto.subcategoryId || dto.brandId) {
      await this.validateReferences(
        dto.categoryId,
        dto.subcategoryId,
        dto.brandId,
      );
    }

    const oldValue = { ...product };
    Object.assign(product, cleanDto(dto), { updatedBy: req.user.id });
    const saved = await this.productRepository.save(product);

    await this.adminAuditService.log(
      req,
      'PRODUCTS',
      'UPDATE',
      'Product',
      saved.id,
      `Updated product "${saved.name}"`,
      oldValue,
      saved,
    );

    return { message: 'Product updated successfully', product: saved };
  }

  async publishProduct(id: string, dto: PublishProductDto, req: AdminRequest) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const oldValue = { ...product };
    if (dto.published) {
      product.status = ProductStatus.ACTIVE;
      product.publishedAt = product.publishedAt ?? new Date();
    } else {
      product.status = ProductStatus.DRAFT;
      // null (not undefined) so TypeORM clears the column in the UPDATE
      product.publishedAt = null;
    }
    product.updatedBy = req.user.id;
    const saved = await this.productRepository.save(product);

    await this.adminAuditService.log(
      req,
      'PRODUCTS',
      dto.published ? 'PUBLISH' : 'UNPUBLISH',
      'Product',
      saved.id,
      `${dto.published ? 'Published' : 'Unpublished'} product "${saved.name}"`,
      oldValue,
      saved,
    );

    return {
      message: dto.published
        ? 'Product published successfully'
        : 'Product unpublished successfully',
      product: saved,
    };
  }

  // ---------- REVIEW MODERATION ----------

  async findAllReviews(query: ListProductReviewQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.productId) where.productId = query.productId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'body'],
      sortableFields: ['createdAt', 'rating', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.reviewRepository.findAndCount({
      ...options,
      relations: { product: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async moderateReview(
    id: string,
    dto: ModerateProductReviewDto,
    req: AdminRequest,
  ) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Product review not found');
    }

    const oldValue = { ...review };
    review.status = dto.status;
    review.moderatedBy = req.user.id;
    review.moderatedAt = new Date();
    const saved = await this.reviewRepository.save(review);

    // The moderator remark is carried in the audit trail, never written into
    // the reviewer's public body text.
    await this.adminAuditService.log(
      req,
      'PRODUCTS',
      'MODERATE',
      'ProductReview',
      saved.id,
      `Marked product review ${saved.status}${dto.remark ? ` (${dto.remark})` : ''}`,
      oldValue,
      saved,
    );

    return { message: 'Product review moderated successfully', review: saved };
  }

  // ---------- INVENTORY SYNC HOOK ----------

  // Aligns the product's ProductInventory.availableStock with the linked
  // central-warehouse Inventory row, writing a StockMovement for the delta so
  // the supply chain stays consistent (warehouse module data).
  async syncInventory(id: string, req: AdminRequest) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productInventory = await this.productInventoryRepository.findOne({
      where: { productId: id },
    });
    if (!productInventory) {
      throw new BadRequestException(
        'No inventory record exists for this product',
      );
    }
    if (!productInventory.warehouseId) {
      throw new BadRequestException(
        'No warehouse is linked to this product inventory',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let delta = 0;
    try {
      const warehouseInventory = await queryRunner.manager.findOne(Inventory, {
        where: {
          warehouseId: productInventory.warehouseId,
          productId: id,
        },
      });

      if (!warehouseInventory) {
        await queryRunner.manager.save(
          queryRunner.manager.create(Inventory, {
            warehouseId: productInventory.warehouseId,
            productId: id,
            availableStock: productInventory.availableStock,
          }),
        );
        delta = productInventory.availableStock;
      } else {
        delta =
          productInventory.availableStock - warehouseInventory.availableStock;
        warehouseInventory.availableStock = productInventory.availableStock;
        warehouseInventory.lastStockUpdate = new Date();
        await queryRunner.manager.save(warehouseInventory);
      }

      if (delta !== 0) {
        await queryRunner.manager.save(
          queryRunner.manager.create(StockMovement, {
            warehouseId: productInventory.warehouseId,
            productId: id,
            movementType:
              delta > 0 ? StockMovementType.IN : StockMovementType.OUT,
            quantity: Math.abs(delta),
            referenceType: 'PRODUCT_SYNC',
            referenceId: id,
            performedBy: req.user.id,
          }),
        );
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'PRODUCTS',
      'SYNC',
      'ProductInventory',
      id,
      `Synced product inventory (delta ${delta >= 0 ? '+' : ''}${delta})`,
      undefined,
      { productId: id, delta },
    );

    return {
      message: 'Product inventory synced successfully',
      productId: id,
      delta,
    };
  }

  // ---------- REFERENCE DATA (categories / subcategories / brands) ----------

  async findCategories() {
    return this.categoryRepository.find({
      where: { status: ProductCategoryStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findSubCategories(categoryId?: string) {
    return this.subCategoryRepository.find({
      where: {
        status: ProductSubCategoryStatus.ACTIVE,
        ...(categoryId ? { categoryId } : {}),
      },
      order: { name: 'ASC' },
    });
  }

  async findBrands() {
    return this.brandRepository.find({
      where: { status: ProductBrandStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  private async validateReferences(
    categoryId?: string,
    subcategoryId?: string,
    brandId?: string,
  ) {
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException('Invalid categoryId: category not found');
      }
    }
    if (subcategoryId) {
      const subcategory = await this.subCategoryRepository.findOne({
        where: { id: subcategoryId },
      });
      if (!subcategory) {
        throw new BadRequestException(
          'Invalid subcategoryId: subcategory not found',
        );
      }
    }
    if (brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: brandId },
      });
      if (!brand) {
        throw new BadRequestException('Invalid brandId: brand not found');
      }
    }
  }
}

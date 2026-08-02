import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  ProductCategory,
  ProductSubCategory,
  ProductBrand,
  ProductTag,
  ProductAttribute,
  ProductAttributeValue,
  Product,
  ProductVariant,
  ProductVariantOption,
  ProductImage,
  ProductGallery,
  ProductPrice,
  ProductCost,
  ProductInventory,
  ProductBarcode,
  ProductFAQ,
  ProductReview,
  ProductRating,
  ProductSEO,
  ProductBundle,
  ProductBundleItem,
  ProductRecommendation,
  ProductViewHistory,
  ProductWishlist,
  ProductComparison,
} from '../../admin/products/entities';

/**
 * Product catalog seed. Keys shared across domains:
 *   product:1..6, pcat:1..3, psubcat:1..3, pbrand:1..2
 */
export async function seedProducts(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ---------------------------------------------------------- product_categories
  await seedRows(
    manager,
    ProductCategory,
    [
      {
        id: uid('pcat:1'),
        name: 'Academic Books',
        slug: 'academic-books',
        description: 'Textbooks and reference materials',
        icon: 'book',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('pcat:2'),
        name: 'Stationery',
        slug: 'stationery',
        description: 'Notebooks, pens and office supplies',
        icon: 'pen',
        sortOrder: 2,
        status: 'ACTIVE',
      },
      {
        id: uid('pcat:3'),
        name: 'Electronics',
        slug: 'electronics',
        description: 'Gadgets and accessories for students',
        icon: 'device',
        sortOrder: 3,
        status: 'ACTIVE',
      },
    ],
    'product_categories',
  );

  // --------------------------------------------------------- product_subcategories
  await seedRows(
    manager,
    ProductSubCategory,
    [
      {
        id: uid('psubcat:1'),
        categoryId: uid('pcat:1'),
        name: 'Engineering Textbooks',
        slug: 'engineering-textbooks',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('psubcat:2'),
        categoryId: uid('pcat:2'),
        name: 'Notebooks',
        slug: 'notebooks',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('psubcat:3'),
        categoryId: uid('pcat:3'),
        name: 'Calculators',
        slug: 'calculators',
        sortOrder: 1,
        status: 'ACTIVE',
      },
    ],
    'product_subcategories',
  );

  // --------------------------------------------------------------- product_brands
  await seedRows(
    manager,
    ProductBrand,
    [
      {
        id: uid('pbrand:1'),
        name: 'Academic Press',
        slug: 'academic-press',
        description: 'Trusted publisher of academic materials',
        status: 'ACTIVE',
      },
      {
        id: uid('pbrand:2'),
        name: 'Student Gear',
        slug: 'student-gear',
        description: 'Quality student accessories',
        status: 'ACTIVE',
      },
    ],
    'product_brands',
  );

  // ----------------------------------------------------------------- product_tags
  await seedRows(
    manager,
    ProductTag,
    [
      {
        id: uid('ptag:1'),
        name: 'Bestseller',
        slug: 'bestseller',
        status: 'ACTIVE',
      },
      {
        id: uid('ptag:2'),
        name: 'New Arrival',
        slug: 'new-arrival',
        status: 'ACTIVE',
      },
      {
        id: uid('ptag:3'),
        name: 'Discounted',
        slug: 'discounted',
        status: 'ACTIVE',
      },
    ],
    'product_tags',
  );

  // ----------------------------------------------------------- product_attributes
  await seedRows(
    manager,
    ProductAttribute,
    [
      {
        id: uid('pattr:1'),
        name: 'Color',
        slug: 'color',
        type: 'COLOR',
        status: 'ACTIVE',
      },
      {
        id: uid('pattr:2'),
        name: 'Size',
        slug: 'size',
        type: 'TEXT',
        status: 'ACTIVE',
      },
      {
        id: uid('pattr:3'),
        name: 'Pages',
        slug: 'pages',
        type: 'NUMBER',
        status: 'ACTIVE',
      },
    ],
    'product_attributes',
  );

  // ------------------------------------------------------------------- products
  await seedRows(
    manager,
    Product,
    [
      {
        id: uid('product:1'),
        productCode: 'PRD-0001',
        name: 'Physics Textbook Vol 1',
        slug: 'physics-textbook-vol-1',
        categoryId: uid('pcat:1'),
        subcategoryId: uid('psubcat:1'),
        brandId: uid('pbrand:1'),
        shortDescription: 'Complete physics reference',
        longDescription:
          'Comprehensive physics textbook for engineering students covering mechanics, waves and thermodynamics.',
        type: 'SIMPLE',
        unit: 'piece',
        weight: 1.2,
        isFeatured: true,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-60),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('product:2'),
        productCode: 'PRD-0002',
        name: 'Mathematics Workbook',
        slug: 'mathematics-workbook',
        categoryId: uid('pcat:1'),
        subcategoryId: uid('psubcat:1'),
        brandId: uid('pbrand:1'),
        shortDescription: 'Practice workbook with solutions',
        type: 'SIMPLE',
        unit: 'piece',
        weight: 0.8,
        isFeatured: true,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-55),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('product:3'),
        productCode: 'PRD-0003',
        name: 'Executive Notebook A5',
        slug: 'executive-notebook-a5',
        categoryId: uid('pcat:2'),
        subcategoryId: uid('psubcat:2'),
        brandId: uid('pbrand:2'),
        shortDescription: 'Hardcover ruled notebook',
        type: 'VARIANT',
        unit: 'piece',
        weight: 0.3,
        isFeatured: false,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-40),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('product:4'),
        productCode: 'PRD-0004',
        name: 'Scientific Calculator FX-991',
        slug: 'scientific-calculator-fx-991',
        categoryId: uid('pcat:3'),
        subcategoryId: uid('psubcat:3'),
        brandId: uid('pbrand:2'),
        shortDescription: 'Solar powered scientific calculator',
        type: 'SIMPLE',
        unit: 'piece',
        weight: 0.2,
        isFeatured: true,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-30),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('product:5'),
        productCode: 'PRD-0005',
        name: 'Chemistry Reference Book',
        slug: 'chemistry-reference-book',
        categoryId: uid('pcat:1'),
        subcategoryId: uid('psubcat:1'),
        brandId: uid('pbrand:1'),
        shortDescription: 'Organic & inorganic chemistry guide',
        type: 'SIMPLE',
        unit: 'piece',
        weight: 1.5,
        isFeatured: false,
        status: 'DRAFT',
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('product:6'),
        productCode: 'PRD-0006',
        name: 'Drawing Set 24-Piece',
        slug: 'drawing-set-24-piece',
        categoryId: uid('pcat:2'),
        subcategoryId: uid('psubcat:2'),
        brandId: uid('pbrand:2'),
        shortDescription: 'Art and sketching kit',
        type: 'BUNDLE',
        unit: 'set',
        weight: 0.5,
        isFeatured: false,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-20),
        createdBy: uid('user:staff-1'),
      },
    ],
    'products',
  );

  // ------------------------------------------------------------ product_variants
  await seedRows(
    manager,
    ProductVariant,
    [
      {
        id: uid('pvariant:1'),
        productId: uid('product:3'),
        sku: 'NB-A5-BLUE',
        name: 'Blue',
        price: 250,
        compareAtPrice: 300,
        stock: 40,
        isDefault: true,
        status: 'ACTIVE',
      },
      {
        id: uid('pvariant:2'),
        productId: uid('product:3'),
        sku: 'NB-A5-RED',
        name: 'Red',
        price: 250,
        compareAtPrice: 300,
        stock: 25,
        isDefault: false,
        status: 'ACTIVE',
      },
    ],
    'product_variants',
  );

  // -------------------------------------------------------- product_variant_options
  await seedRows(
    manager,
    ProductVariantOption,
    [
      {
        id: uid('pvaropt:1'),
        variantId: uid('pvariant:1'),
        attributeId: uid('pattr:1'),
        value: 'Blue',
      },
      {
        id: uid('pvaropt:2'),
        variantId: uid('pvariant:2'),
        attributeId: uid('pattr:1'),
        value: 'Red',
      },
    ],
    'product_variant_options',
  );

  // ------------------------------------------------------ product_attribute_values
  await seedRows(
    manager,
    ProductAttributeValue,
    [
      {
        id: uid('pattrval:1'),
        attributeId: uid('pattr:3'),
        productId: uid('product:1'),
        value: '650',
      },
      {
        id: uid('pattrval:2'),
        attributeId: uid('pattr:2'),
        productId: uid('product:3'),
        value: 'A5',
      },
    ],
    'product_attribute_values',
  );

  // -------------------------------------------------------------- product_images
  await seedRows(
    manager,
    ProductImage,
    [
      {
        id: uid('pimage:1'),
        productId: uid('product:1'),
        url: '/uploads/products/physics-1.jpg',
        alt: 'Physics Textbook',
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: uid('pimage:2'),
        productId: uid('product:4'),
        url: '/uploads/products/fx991-1.jpg',
        alt: 'Calculator',
        sortOrder: 1,
        isPrimary: true,
      },
      {
        id: uid('pimage:3'),
        productId: uid('product:3'),
        url: '/uploads/products/notebook-a5.jpg',
        alt: 'Executive Notebook',
        sortOrder: 1,
        isPrimary: true,
      },
    ],
    'product_images',
  );

  // ------------------------------------------------------------ product_galleries
  await seedRows(
    manager,
    ProductGallery,
    [
      {
        id: uid('pgallery:1'),
        productId: uid('product:1'),
        title: 'Product showcase',
        description: '360 degree views of the textbook',
        status: 'ACTIVE',
      },
      {
        id: uid('pgallery:2'),
        productId: uid('product:4'),
        title: 'Calculator gallery',
        description: 'Features and buttons',
        status: 'ACTIVE',
      },
    ],
    'product_galleries',
  );

  // -------------------------------------------------------------- product_prices
  await seedRows(
    manager,
    ProductPrice,
    [
      {
        id: uid('pprice:1'),
        productId: uid('product:1'),
        currency: 'BDT',
        amount: 1100,
        compareAtAmount: 1300,
        priceType: 'REGULAR',
        effectiveFrom: daysFromNow(-60),
        status: 'ACTIVE',
      },
      {
        id: uid('pprice:2'),
        productId: uid('product:2'),
        currency: 'BDT',
        amount: 1650,
        compareAtAmount: 1900,
        priceType: 'REGULAR',
        effectiveFrom: daysFromNow(-55),
        status: 'ACTIVE',
      },
      {
        id: uid('pprice:3'),
        productId: uid('product:4'),
        currency: 'BDT',
        amount: 1999,
        compareAtAmount: 2500,
        priceType: 'SALE',
        effectiveFrom: daysFromNow(-30),
        status: 'ACTIVE',
      },
      {
        id: uid('pprice:4'),
        productId: uid('product:6'),
        currency: 'BDT',
        amount: 950,
        priceType: 'REGULAR',
        effectiveFrom: daysFromNow(-20),
        status: 'ACTIVE',
      },
    ],
    'product_prices',
  );

  // --------------------------------------------------------------- product_costs
  await seedRows(
    manager,
    ProductCost,
    [
      {
        id: uid('pcost:1'),
        productId: uid('product:1'),
        costAmount: 850,
        currency: 'BDT',
        effectiveFrom: daysFromNow(-60),
      },
      {
        id: uid('pcost:2'),
        productId: uid('product:4'),
        costAmount: 1500,
        currency: 'BDT',
        effectiveFrom: daysFromNow(-30),
      },
    ],
    'product_costs',
  );

  // ---------------------------------------------------------- product_inventories
  await seedRows(
    manager,
    ProductInventory,
    [
      {
        id: uid('pinventory:1'),
        productId: uid('product:1'),
        warehouseId: uid('warehouse:1'),
        availableStock: 85,
        reservedStock: 10,
        lowStockThreshold: 20,
        status: 'IN_STOCK',
        lastStockUpdate: daysFromNow(-1),
      },
      {
        id: uid('pinventory:2'),
        productId: uid('product:2'),
        warehouseId: uid('warehouse:1'),
        availableStock: 15,
        reservedStock: 2,
        lowStockThreshold: 15,
        status: 'LOW_STOCK',
        lastStockUpdate: daysFromNow(-1),
      },
      {
        id: uid('pinventory:3'),
        productId: uid('product:4'),
        warehouseId: uid('warehouse:2'),
        availableStock: 55,
        reservedStock: 5,
        lowStockThreshold: 15,
        status: 'IN_STOCK',
        lastStockUpdate: daysFromNow(-2),
      },
      {
        id: uid('pinventory:4'),
        productId: uid('product:6'),
        warehouseId: uid('warehouse:3'),
        availableStock: 0,
        reservedStock: 0,
        lowStockThreshold: 10,
        status: 'OUT_OF_STOCK',
        lastStockUpdate: daysFromNow(-1),
      },
    ],
    'product_inventories',
  );

  // ------------------------------------------------------------ product_barcodes
  await seedRows(
    manager,
    ProductBarcode,
    [
      {
        id: uid('pbarcode:1'),
        productId: uid('product:1'),
        barcode: '8901000000017',
        status: 'ACTIVE',
      },
      {
        id: uid('pbarcode:2'),
        productId: uid('product:4'),
        barcode: '8901000000048',
        status: 'ACTIVE',
      },
    ],
    'product_barcodes',
  );

  // ----------------------------------------------------------------- product_faqs
  await seedRows(
    manager,
    ProductFAQ,
    [
      {
        id: uid('pfaq:1'),
        productId: uid('product:4'),
        question: 'Is this calculator allowed in exams?',
        answer: 'Yes, it is approved for most university exams.',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('pfaq:2'),
        productId: uid('product:1'),
        question: 'Does it cover the full syllabus?',
        answer:
          'Yes, it covers the complete HSC and university entrance syllabus.',
        sortOrder: 1,
        status: 'ACTIVE',
      },
    ],
    'product_faqs',
  );

  // -------------------------------------------------------------- product_reviews
  await seedRows(
    manager,
    ProductReview,
    [
      {
        id: uid('preview:1'),
        productId: uid('product:1'),
        userId: uid('user:student-1'),
        rating: 5,
        title: 'Excellent book',
        body: 'Very well organized and easy to follow.',
        status: 'APPROVED',
        moderatedBy: uid('user:staff-1'),
        moderatedAt: daysFromNow(-10),
        createdAt: daysFromNow(-12),
      },
      {
        id: uid('preview:2'),
        productId: uid('product:4'),
        userId: uid('user:customer-1'),
        rating: 4,
        title: 'Good calculator',
        body: 'Works well, battery lasts long.',
        status: 'PENDING',
        createdAt: daysFromNow(-1),
      },
    ],
    'product_reviews',
  );

  // -------------------------------------------------------------- product_ratings
  await seedRows(
    manager,
    ProductRating,
    [
      {
        id: uid('prating:1'),
        productId: uid('product:1'),
        userId: uid('user:student-1'),
        rating: 5,
        createdAt: daysFromNow(-12),
      },
      {
        id: uid('prating:2'),
        productId: uid('product:4'),
        userId: uid('user:customer-1'),
        rating: 4,
        createdAt: daysFromNow(-1),
      },
    ],
    'product_ratings',
  );

  // ----------------------------------------------------------------- product_seos
  await seedRows(
    manager,
    ProductSEO,
    [
      {
        id: uid('pseo:1'),
        productId: uid('product:1'),
        metaTitle: 'Physics Textbook Vol 1 | BOI LAGBE',
        metaDescription: 'Buy Physics Textbook Vol 1 at the best price.',
        keywords: 'physics, textbook, engineering',
        canonicalUrl: '/products/physics-textbook-vol-1',
      },
      {
        id: uid('pseo:2'),
        productId: uid('product:4'),
        metaTitle: 'Scientific Calculator FX-991 | BOI LAGBE',
        metaDescription: 'Solar powered scientific calculator.',
        keywords: 'calculator, fx-991, scientific',
        canonicalUrl: '/products/scientific-calculator-fx-991',
      },
    ],
    'product_seos',
  );

  // -------------------------------------------------------------- product_bundles
  await seedRows(
    manager,
    ProductBundle,
    [
      {
        id: uid('pbundle:1'),
        productId: uid('product:6'),
        bundleCode: 'BDL-001',
        title: 'First Year Starter Kit',
        description: 'Essential stationery for new students',
        totalPrice: 1200,
        sellingPrice: 950,
        status: 'ACTIVE',
      },
    ],
    'product_bundles',
  );

  // ---------------------------------------------------------- product_bundle_items
  await seedRows(
    manager,
    ProductBundleItem,
    [
      {
        id: uid('pbundleitem:1'),
        bundleId: uid('pbundle:1'),
        productId: uid('product:3'),
        quantity: 2,
      },
      {
        id: uid('pbundleitem:2'),
        bundleId: uid('pbundle:1'),
        productId: uid('product:2'),
        quantity: 1,
      },
    ],
    'product_bundle_items',
  );

  // -------------------------------------------------------- product_recommendations
  await seedRows(
    manager,
    ProductRecommendation,
    [
      {
        id: uid('precommend:1'),
        productId: uid('product:1'),
        recommendedProductId: uid('product:2'),
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('precommend:2'),
        productId: uid('product:2'),
        recommendedProductId: uid('product:1'),
        sortOrder: 1,
        status: 'ACTIVE',
      },
    ],
    'product_recommendations',
  );

  // --------------------------------------------------------- product_view_histories
  await seedRows(
    manager,
    ProductViewHistory,
    [
      {
        id: uid('pview:1'),
        productId: uid('product:1'),
        userId: uid('user:student-1'),
        viewedAt: daysFromNow(-2),
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('pview:2'),
        productId: uid('product:4'),
        userId: uid('user:customer-1'),
        viewedAt: daysFromNow(-1),
        createdAt: daysFromNow(-1),
      },
    ],
    'product_view_histories',
  );

  // -------------------------------------------------------------- product_wishlists
  await seedRows(
    manager,
    ProductWishlist,
    [
      {
        id: uid('pwishlist:1'),
        productId: uid('product:4'),
        userId: uid('user:student-1'),
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('pwishlist:2'),
        productId: uid('product:6'),
        userId: uid('user:customer-2'),
        createdAt: daysFromNow(-2),
      },
    ],
    'product_wishlists',
  );

  // ----------------------------------------------------------- product_comparisons
  await seedRows(
    manager,
    ProductComparison,
    [
      {
        id: uid('pcomparison:1'),
        userId: uid('user:student-1'),
        productId: uid('product:1'),
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('pcomparison:2'),
        userId: uid('user:student-1'),
        productId: uid('product:5'),
        createdAt: daysFromNow(-2),
      },
    ],
    'product_comparisons',
  );

  void ctx;
}

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
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ListBookQueryDto } from './dto/list-book-query.dto';
import { PublishBookDto } from './dto/publish-book.dto';
import { ListBookReviewQueryDto } from './dto/list-book-review-query.dto';
import { ModerateBookReviewDto } from './dto/moderate-book-review.dto';
import { CreateBookPriceHistoryDto } from './dto/create-book-price-history.dto';
import {
  Book,
  BookStatus,
  BookEdition,
  BookAuthor,
  BookAuthorStatus,
  BookPublisher,
  BookPublisherStatus,
  BookCategory,
  BookCategoryStatus,
  BookSubject,
  BookSubjectStatus,
  BookLanguage,
  BookLanguageStatus,
  BookSeries,
  BookSeriesStatus,
  BookReview,
  BookPriceHistory,
} from './entities';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookAuthor)
    private readonly authorRepository: Repository<BookAuthor>,
    @InjectRepository(BookPublisher)
    private readonly publisherRepository: Repository<BookPublisher>,
    @InjectRepository(BookCategory)
    private readonly categoryRepository: Repository<BookCategory>,
    @InjectRepository(BookSubject)
    private readonly subjectRepository: Repository<BookSubject>,
    @InjectRepository(BookLanguage)
    private readonly languageRepository: Repository<BookLanguage>,
    @InjectRepository(BookSeries)
    private readonly seriesRepository: Repository<BookSeries>,
    @InjectRepository(BookReview)
    private readonly reviewRepository: Repository<BookReview>,
    @InjectRepository(BookPriceHistory)
    private readonly priceHistoryRepository: Repository<BookPriceHistory>,
    @InjectRepository(BookEdition)
    private readonly editionRepository: Repository<BookEdition>,
    private readonly dataSource: DataSource,
    private readonly adminAuditService: AdminAuditService,
  ) {}

  // ---------- BOOKS ----------

  async findAllBooks(query: ListBookQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.authorId) where.authorId = query.authorId;
    if (query.publisherId) where.publisherId = query.publisherId;
    if (query.languageId) where.languageId = query.languageId;

    const options = QueryBuilder.buildQueryOptions({
      pagination: query,
      dateRange: query,
      dateField: 'createdAt',
      searchableFields: ['title', 'isbn', 'slug', 'subtitle'],
      sortableFields: ['title', 'isbn', 'price', 'createdAt', 'status'],
      where: Object.keys(where).length ? where : undefined,
    });
    const [items, total] = await this.bookRepository.findAndCount({
      ...options,
      relations: {
        author: true,
        publisher: true,
        category: true,
        subject: true,
        language: true,
        series: true,
      },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async findBookById(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: {
        author: true,
        publisher: true,
        category: true,
        subject: true,
        language: true,
        series: true,
        edition: true,
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const priceHistory = await this.priceHistoryRepository.find({
      where: { bookId: id },
      order: { changedAt: 'DESC' },
      take: 20,
    });

    return { ...book, priceHistory };
  }

  async createBook(dto: CreateBookDto, req: AdminRequest) {
    await this.validateReferences(dto);

    const book = this.bookRepository.create({
      ...cleanDto(dto),
      slug: dto.slug ?? slugify(dto.title, 'book'),
      createdBy: req.user.id,
    });
    const saved = await this.bookRepository.save(book);

    await this.adminAuditService.log(
      req,
      'BOOKS',
      'CREATE',
      'Book',
      saved.id,
      `Created book "${saved.title}"`,
      undefined,
      saved,
    );

    return { message: 'Book created successfully', book: saved };
  }

  async updateBook(id: string, dto: UpdateBookDto, req: AdminRequest) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    await this.validateReferences(dto);

    const oldValue = { ...book };
    Object.assign(book, cleanDto(dto), { updatedBy: req.user.id });
    const saved = await this.bookRepository.save(book);

    await this.adminAuditService.log(
      req,
      'BOOKS',
      'UPDATE',
      'Book',
      saved.id,
      `Updated book "${saved.title}"`,
      oldValue,
      saved,
    );

    return { message: 'Book updated successfully', book: saved };
  }

  async publishBook(id: string, dto: PublishBookDto, req: AdminRequest) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const oldValue = { ...book };
    if (dto.published) {
      book.status = BookStatus.ACTIVE;
      book.publishedAt = book.publishedAt ?? new Date();
    } else {
      book.status = BookStatus.DRAFT;
      // null (not undefined) so TypeORM clears the column in the UPDATE
      book.publishedAt = null;
    }
    book.updatedBy = req.user.id;
    const saved = await this.bookRepository.save(book);

    await this.adminAuditService.log(
      req,
      'BOOKS',
      dto.published ? 'PUBLISH' : 'UNPUBLISH',
      'Book',
      saved.id,
      `${dto.published ? 'Published' : 'Unpublished'} book "${saved.title}"`,
      oldValue,
      saved,
    );

    return {
      message: dto.published
        ? 'Book published successfully'
        : 'Book unpublished successfully',
      book: saved,
    };
  }

  // ---------- REVIEW MODERATION ----------

  async findAllReviews(query: ListBookReviewQueryDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.bookId) where.bookId = query.bookId;

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
      relations: { book: true },
    });
    return { items, meta: QueryBuilder.buildMeta(query, total) };
  }

  async moderateReview(
    id: string,
    dto: ModerateBookReviewDto,
    req: AdminRequest,
  ) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Book review not found');
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
      'BOOKS',
      'MODERATE',
      'BookReview',
      saved.id,
      `Marked book review ${saved.status}${dto.remark ? ` (${dto.remark})` : ''}`,
      oldValue,
      saved,
    );

    return { message: 'Book review moderated successfully', review: saved };
  }

  // ---------- PRICE HISTORY ----------

  async addPriceHistory(
    id: string,
    dto: CreateBookPriceHistoryDto,
    req: AdminRequest,
  ) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const oldPrice = book.price;

    // Price change + history row are committed atomically so they can never
    // drift apart.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let history: BookPriceHistory;
    try {
      history = await queryRunner.manager.save(
        queryRunner.manager.create(BookPriceHistory, {
          bookId: id,
          price: dto.price,
          oldPrice,
          changedBy: req.user.id,
          changedAt: new Date(),
        }),
      );
      book.price = dto.price;
      book.updatedBy = req.user.id;
      await queryRunner.manager.save(book);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    await this.adminAuditService.log(
      req,
      'BOOKS',
      'PRICE_UPDATE',
      'Book',
      id,
      `Updated book price from ${oldPrice} to ${dto.price}`,
      { bookId: id, oldPrice },
      { bookId: id, newPrice: dto.price },
    );

    return {
      message: 'Book price updated and history recorded',
      priceHistory: history,
    };
  }

  // ---------- REFERENCE DATA (authors / publishers / categories / etc.) ----------

  async findAuthors() {
    return this.authorRepository.find({
      where: { status: BookAuthorStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findPublishers() {
    return this.publisherRepository.find({
      where: { status: BookPublisherStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findCategories() {
    return this.categoryRepository.find({
      where: { status: BookCategoryStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findSubjects() {
    return this.subjectRepository.find({
      where: { status: BookSubjectStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findLanguages() {
    return this.languageRepository.find({
      where: { status: BookLanguageStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  async findSeries() {
    return this.seriesRepository.find({
      where: { status: BookSeriesStatus.ACTIVE },
      order: { name: 'ASC' },
    });
  }

  private async validateReferences(dto: CreateBookDto | UpdateBookDto) {
    if (dto.authorId) {
      if (
        !(await this.authorRepository.findOne({ where: { id: dto.authorId } }))
      ) {
        throw new BadRequestException('Invalid authorId: author not found');
      }
    }
    if (dto.publisherId) {
      if (
        !(await this.publisherRepository.findOne({
          where: { id: dto.publisherId },
        }))
      ) {
        throw new BadRequestException(
          'Invalid publisherId: publisher not found',
        );
      }
    }
    if (dto.categoryId) {
      if (
        !(await this.categoryRepository.findOne({
          where: { id: dto.categoryId },
        }))
      ) {
        throw new BadRequestException('Invalid categoryId: category not found');
      }
    }
    if (dto.subjectId) {
      if (
        !(await this.subjectRepository.findOne({
          where: { id: dto.subjectId },
        }))
      ) {
        throw new BadRequestException('Invalid subjectId: subject not found');
      }
    }
    if (dto.languageId) {
      if (
        !(await this.languageRepository.findOne({
          where: { id: dto.languageId },
        }))
      ) {
        throw new BadRequestException('Invalid languageId: language not found');
      }
    }
    if (dto.seriesId) {
      if (
        !(await this.seriesRepository.findOne({
          where: { id: dto.seriesId },
        }))
      ) {
        throw new BadRequestException('Invalid seriesId: series not found');
      }
    }
    if (dto.editionId) {
      const edition = await this.editionRepository.findOne({
        where: { id: dto.editionId },
      });
      if (!edition) {
        throw new BadRequestException('Invalid editionId: edition not found');
      }
    }
  }
}

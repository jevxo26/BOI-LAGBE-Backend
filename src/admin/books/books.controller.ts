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
import { BooksService } from './books.service';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ListBookQueryDto } from './dto/list-book-query.dto';
import { PublishBookDto } from './dto/publish-book.dto';
import { ListBookReviewQueryDto } from './dto/list-book-review-query.dto';
import { ModerateBookReviewDto } from './dto/moderate-book-review.dto';
import { CreateBookPriceHistoryDto } from './dto/create-book-price-history.dto';

// All book routes require authentication (global StrictJwtAuthGuard) AND the
// ADMIN or SUPER_ADMIN role (@AdminOnly). Never add @Public() here.
// Static routes must be declared before the parameterized :id route.
@Controller('admin/books')
@AdminOnly()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // ---------- REFERENCE DATA (authors / publishers / categories / etc.) ----------

  @Get('authors')
  async findAuthors() {
    return this.booksService.findAuthors();
  }

  @Get('publishers')
  async findPublishers() {
    return this.booksService.findPublishers();
  }

  @Get('categories')
  async findCategories() {
    return this.booksService.findCategories();
  }

  @Get('subjects')
  async findSubjects() {
    return this.booksService.findSubjects();
  }

  @Get('languages')
  async findLanguages() {
    return this.booksService.findLanguages();
  }

  @Get('series')
  async findSeries() {
    return this.booksService.findSeries();
  }

  // ---------- REVIEW MODERATION ----------

  @Get('reviews')
  async findAllReviews(@Query() query: ListBookReviewQueryDto) {
    return this.booksService.findAllReviews(query);
  }

  @Patch('reviews/:id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Body() dto: ModerateBookReviewDto,
    @Req() req: AdminRequest,
  ) {
    return this.booksService.moderateReview(id, dto, req);
  }

  // ---------- BOOKS ----------

  @Get()
  async findAll(@Query() query: ListBookQueryDto) {
    return this.booksService.findAllBooks(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findBookById(id);
  }

  @Post()
  async create(@Body() dto: CreateBookDto, @Req() req: AdminRequest) {
    return this.booksService.createBook(dto, req);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
    @Req() req: AdminRequest,
  ) {
    return this.booksService.updateBook(id, dto, req);
  }

  @Post(':id/publish')
  async publish(
    @Param('id') id: string,
    @Body() dto: PublishBookDto,
    @Req() req: AdminRequest,
  ) {
    return this.booksService.publishBook(id, dto, req);
  }

  @Post(':id/price-history')
  async addPriceHistory(
    @Param('id') id: string,
    @Body() dto: CreateBookPriceHistoryDto,
    @Req() req: AdminRequest,
  ) {
    return this.booksService.addPriceHistory(id, dto, req);
  }
}

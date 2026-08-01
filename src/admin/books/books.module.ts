import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import {
  Book,
  BookEdition,
  BookAuthor,
  BookPublisher,
  BookCategory,
  BookSubject,
  BookLanguage,
  BookSeries,
  BookCourse,
  BookSemester,
  BookDepartment,
  BookInstitute,
  BookCondition,
  BookTag,
  BookFile,
  BookPreview,
  BookRecommendation,
  BookReview,
  BookFavorite,
  BookReadingList,
  BookPriceHistory,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      BookEdition,
      BookAuthor,
      BookPublisher,
      BookCategory,
      BookSubject,
      BookLanguage,
      BookSeries,
      BookCourse,
      BookSemester,
      BookDepartment,
      BookInstitute,
      BookCondition,
      BookTag,
      BookFile,
      BookPreview,
      BookRecommendation,
      BookReview,
      BookFavorite,
      BookReadingList,
      BookPriceHistory,
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}

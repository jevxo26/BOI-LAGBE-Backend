import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  BookAuthor,
  BookPublisher,
  BookCategory,
  BookSubject,
  BookLanguage,
  BookSeries,
  BookTag,
  BookCondition,
  Book,
  BookEdition,
  BookCourse,
  BookDepartment,
  BookInstitute,
  BookSemester,
  BookFile,
  BookPreview,
  BookPriceHistory,
  BookReview,
  BookFavorite,
  BookReadingList,
  BookRecommendation,
} from '../../admin/books/entities';

/**
 * Book catalog seed. Keys shared across domains:
 *   book:1..5, bauthor:1..3, bpublisher:1..2, bcategory:1..3
 */
export async function seedBooks(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ---------------------------------------------------------------- book_authors
  await seedRows(
    manager,
    BookAuthor,
    [
      {
        id: uid('bauthor:1'),
        name: 'Dr. A.K.M. Hafizur Rahman',
        slug: 'hafizur-rahman',
        bio: 'Professor of Physics, University of Dhaka',
        status: 'ACTIVE',
      },
      {
        id: uid('bauthor:2'),
        name: 'Farida Yasmin',
        slug: 'farida-yasmin',
        bio: 'Mathematics educator and author',
        status: 'ACTIVE',
      },
      {
        id: uid('bauthor:3'),
        name: 'S.M. Zahid Hasan',
        slug: 'sm-zahid-hasan',
        bio: 'Chemistry researcher',
        status: 'ACTIVE',
      },
    ],
    'book_authors',
  );

  // ------------------------------------------------------------- book_publishers
  await seedRows(
    manager,
    BookPublisher,
    [
      {
        id: uid('bpublisher:1'),
        name: 'Bangla Academy',
        slug: 'bangla-academy',
        address: 'Bangla Academy, Shahbag, Dhaka',
        phone: '02-8619372',
        email: 'info@banglaacademy.org.bd',
        website: 'https://banglaacademy.org.bd',
        status: 'ACTIVE',
      },
      {
        id: uid('bpublisher:2'),
        name: 'Ankur Prakashani',
        slug: 'ankur-prakashani',
        address: 'Aziz Super Market, Dhaka',
        phone: '02-9550000',
        email: 'ankur@prakashani.com',
        status: 'ACTIVE',
      },
    ],
    'book_publishers',
  );

  // ------------------------------------------------------------- book_categories
  await seedRows(
    manager,
    BookCategory,
    [
      {
        id: uid('bcategory:1'),
        name: 'Science',
        slug: 'science',
        description: 'Science and technology books',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('bcategory:2'),
        name: 'Fiction',
        slug: 'fiction',
        description: 'Novels and short stories',
        sortOrder: 2,
        status: 'ACTIVE',
      },
      {
        id: uid('bcategory:3'),
        name: 'Literature',
        slug: 'literature',
        description: 'Poetry, essays and classics',
        parentId: undefined,
        sortOrder: 3,
        status: 'ACTIVE',
      },
    ],
    'book_categories',
  );

  // ---------------------------------------------------------------- book_subjects
  await seedRows(
    manager,
    BookSubject,
    [
      {
        id: uid('bsubject:1'),
        name: 'Physics',
        slug: 'physics',
        description: 'Physics subjects',
        status: 'ACTIVE',
      },
      {
        id: uid('bsubject:2'),
        name: 'Mathematics',
        slug: 'mathematics',
        description: 'Mathematics subjects',
        status: 'ACTIVE',
      },
      {
        id: uid('bsubject:3'),
        name: 'Bengali Literature',
        slug: 'bengali-literature',
        description: 'Bengali literature subjects',
        status: 'ACTIVE',
      },
    ],
    'book_subjects',
  );

  // -------------------------------------------------------------- book_languages
  await seedRows(
    manager,
    BookLanguage,
    [
      { id: uid('blanguage:1'), name: 'Bengali', code: 'bn', status: 'ACTIVE' },
      { id: uid('blanguage:2'), name: 'English', code: 'en', status: 'ACTIVE' },
    ],
    'book_languages',
  );

  // ----------------------------------------------------------------- book_series
  await seedRows(
    manager,
    BookSeries,
    [
      {
        id: uid('bseries:1'),
        name: 'Higher Secondary Series',
        slug: 'higher-secondary-series',
        description: 'HSC level reference series',
        status: 'ACTIVE',
      },
      {
        id: uid('bseries:2'),
        name: 'Adventure Collection',
        slug: 'adventure-collection',
        description: 'Adventure fiction series',
        status: 'ACTIVE',
      },
    ],
    'book_series',
  );

  // -------------------------------------------------------------------- book_tags
  await seedRows(
    manager,
    BookTag,
    [
      {
        id: uid('btag:1'),
        name: 'Textbook',
        slug: 'textbook',
        status: 'ACTIVE',
      },
      {
        id: uid('btag:2'),
        name: 'Best Seller',
        slug: 'best-seller',
        status: 'ACTIVE',
      },
    ],
    'book_tags',
  );

  // -------------------------------------------------------------- book_conditions
  await seedRows(
    manager,
    BookCondition,
    [
      {
        id: uid('bcondition:1'),
        name: 'New',
        description: 'Brand new book',
        priceAdjustment: 0,
        status: 'ACTIVE',
      },
      {
        id: uid('bcondition:2'),
        name: 'Like New',
        description: 'Minor wear, no markings',
        priceAdjustment: -0.2,
        status: 'ACTIVE',
      },
      {
        id: uid('bcondition:3'),
        name: 'Good',
        description: 'Some wear and markings',
        priceAdjustment: -0.4,
        status: 'ACTIVE',
      },
    ],
    'book_conditions',
  );

  // ----------------------------------------------------------------------- books
  await seedRows(
    manager,
    Book,
    [
      {
        id: uid('book:1'),
        isbn: '9789845060011',
        title: 'Physics for Higher Secondary',
        slug: 'physics-for-higher-secondary',
        subtitle: 'Volume 1',
        description: 'Complete physics book for HSC students.',
        authorId: uid('bauthor:1'),
        publisherId: uid('bpublisher:1'),
        categoryId: uid('bcategory:1'),
        subjectId: uid('bsubject:1'),
        languageId: uid('blanguage:1'),
        seriesId: uid('bseries:1'),
        pageCount: 512,
        publishedYear: 2023,
        coverImage: '/uploads/books/physics-hsc.jpg',
        price: 850,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-60),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('book:2'),
        isbn: '9789845060028',
        title: 'Higher Mathematics',
        slug: 'higher-mathematics',
        description: 'Mathematics textbook for HSC and admission tests.',
        authorId: uid('bauthor:2'),
        publisherId: uid('bpublisher:1'),
        categoryId: uid('bcategory:1'),
        subjectId: uid('bsubject:2'),
        languageId: uid('blanguage:1'),
        seriesId: uid('bseries:1'),
        pageCount: 480,
        publishedYear: 2023,
        coverImage: '/uploads/books/math-hsc.jpg',
        price: 780,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-55),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('book:3'),
        isbn: '9789845060035',
        title: 'Organic Chemistry',
        slug: 'organic-chemistry',
        description: 'Organic chemistry reference for university students.',
        authorId: uid('bauthor:3'),
        publisherId: uid('bpublisher:2'),
        categoryId: uid('bcategory:1'),
        subjectId: uid('bsubject:1'),
        languageId: uid('blanguage:2'),
        seriesId: uid('bseries:1'),
        pageCount: 640,
        publishedYear: 2022,
        coverImage: '/uploads/books/organic-chem.jpg',
        price: 1250,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-40),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('book:4'),
        isbn: '9789845060042',
        title: 'Chander Pahar',
        slug: 'chander-pahar',
        subtitle: 'The Mountain of the Moon',
        description: 'Classic Bengali adventure novel.',
        authorId: uid('bauthor:1'),
        publisherId: uid('bpublisher:2'),
        categoryId: uid('bcategory:2'),
        subjectId: uid('bsubject:3'),
        languageId: uid('blanguage:1'),
        seriesId: uid('bseries:2'),
        pageCount: 320,
        publishedYear: 1937,
        coverImage: '/uploads/books/chander-pahar.jpg',
        price: 350,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-30),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('book:5'),
        isbn: '9789845060059',
        title: 'Bengali Poetry Collection',
        slug: 'bengali-poetry-collection',
        description: 'Collection of modern Bengali poetry.',
        authorId: uid('bauthor:2'),
        publisherId: uid('bpublisher:1'),
        categoryId: uid('bcategory:3'),
        subjectId: uid('bsubject:3'),
        languageId: uid('blanguage:1'),
        pageCount: 240,
        publishedYear: 2024,
        coverImage: '/uploads/books/poetry.jpg',
        price: 450,
        status: 'DRAFT',
        createdBy: uid('user:staff-1'),
      },
    ],
    'books',
  );

  // --------------------------------------------------------------- book_editions
  await seedRows(
    manager,
    BookEdition,
    [
      {
        id: uid('bedition:1'),
        bookId: uid('book:1'),
        editionNumber: 5,
        editionName: '5th Edition',
        publishedYear: 2023,
        pageCount: 512,
        price: 850,
        status: 'ACTIVE',
      },
      {
        id: uid('bedition:2'),
        bookId: uid('book:2'),
        editionNumber: 4,
        editionName: '4th Edition',
        publishedYear: 2023,
        pageCount: 480,
        price: 780,
        status: 'ACTIVE',
      },
      {
        id: uid('bedition:3'),
        bookId: uid('book:3'),
        editionNumber: 3,
        editionName: '3rd Edition',
        publishedYear: 2022,
        pageCount: 640,
        price: 1250,
        status: 'ACTIVE',
      },
    ],
    'book_editions',
  );

  // --------------------------------------------------------------- book_courses
  await seedRows(
    manager,
    BookCourse,
    [
      {
        id: uid('bcourse:1'),
        bookId: uid('book:1'),
        name: 'Physics 1st Paper',
        code: 'PHY-101',
      },
      {
        id: uid('bcourse:2'),
        bookId: uid('book:2'),
        name: 'Mathematics 1st Paper',
        code: 'MATH-101',
      },
    ],
    'book_courses',
  );

  // ---------------------------------------------------------- book_departments
  await seedRows(
    manager,
    BookDepartment,
    [
      {
        id: uid('bdepartment:1'),
        bookId: uid('book:1'),
        name: 'Science',
        code: 'SCI',
      },
      {
        id: uid('bdepartment:2'),
        bookId: uid('book:3'),
        name: 'Chemistry',
        code: 'CHE',
      },
    ],
    'book_departments',
  );

  // ------------------------------------------------------------ book_institutes
  await seedRows(
    manager,
    BookInstitute,
    [
      {
        id: uid('binstitute:1'),
        bookId: uid('book:1'),
        name: 'University of Dhaka',
        code: 'DU',
      },
      {
        id: uid('binstitute:2'),
        bookId: uid('book:3'),
        name: 'BUET',
        code: 'BUET',
      },
    ],
    'book_institutes',
  );

  // ------------------------------------------------------------- book_semesters
  await seedRows(
    manager,
    BookSemester,
    [
      {
        id: uid('bsemester:1'),
        bookId: uid('book:1'),
        name: 'Semester 1',
        semesterNumber: 1,
      },
      {
        id: uid('bsemester:2'),
        bookId: uid('book:2'),
        name: 'Semester 1',
        semesterNumber: 1,
      },
    ],
    'book_semesters',
  );

  // ----------------------------------------------------------------- book_files
  await seedRows(
    manager,
    BookFile,
    [
      {
        id: uid('bfile:1'),
        bookId: uid('book:1'),
        fileType: 'PDF',
        fileUrl: '/uploads/books/physics-hsc.pdf',
        fileSize: 25000000,
        title: 'Physics HSC PDF',
        status: 'ACTIVE',
      },
      {
        id: uid('bfile:2'),
        bookId: uid('book:4'),
        fileType: 'EPUB',
        fileUrl: '/uploads/books/chander-pahar.epub',
        fileSize: 5000000,
        title: 'Chander Pahar EPUB',
        status: 'ACTIVE',
      },
    ],
    'book_files',
  );

  // -------------------------------------------------------------- book_previews
  await seedRows(
    manager,
    BookPreview,
    [
      {
        id: uid('bpreview:1'),
        bookId: uid('book:1'),
        previewType: 'SAMPLE_PDF',
        previewUrl: '/uploads/books/physics-hsc-sample.pdf',
        pageCount: 30,
        createdAt: daysFromNow(-60),
      },
      {
        id: uid('bpreview:2'),
        bookId: uid('book:3'),
        previewType: 'SAMPLE_PDF',
        previewUrl: '/uploads/books/organic-chem-sample.pdf',
        pageCount: 25,
        createdAt: daysFromNow(-40),
      },
    ],
    'book_previews',
  );

  // --------------------------------------------------------- book_price_histories
  await seedRows(
    manager,
    BookPriceHistory,
    [
      {
        id: uid('bpricehist:1'),
        bookId: uid('book:1'),
        price: 850,
        oldPrice: 800,
        changedBy: uid('user:staff-1'),
        changedAt: daysFromNow(-30),
        createdAt: daysFromNow(-30),
      },
      {
        id: uid('bpricehist:2'),
        bookId: uid('book:3'),
        price: 1250,
        oldPrice: 1350,
        changedBy: uid('user:staff-1'),
        changedAt: daysFromNow(-15),
        createdAt: daysFromNow(-15),
      },
    ],
    'book_price_histories',
  );

  // --------------------------------------------------------------- book_reviews
  await seedRows(
    manager,
    BookReview,
    [
      {
        id: uid('breview:1'),
        bookId: uid('book:1'),
        userId: uid('user:student-1'),
        rating: 5,
        title: 'Great physics book',
        body: 'Very helpful for HSC preparation.',
        status: 'APPROVED',
        moderatedBy: uid('user:staff-1'),
        moderatedAt: daysFromNow(-10),
        createdAt: daysFromNow(-12),
      },
      {
        id: uid('breview:2'),
        bookId: uid('book:4'),
        userId: uid('user:customer-1'),
        rating: 5,
        title: 'Classic adventure',
        body: 'One of the best Bengali novels.',
        status: 'PENDING',
        createdAt: daysFromNow(-1),
      },
    ],
    'book_reviews',
  );

  // -------------------------------------------------------------- book_favorites
  await seedRows(
    manager,
    BookFavorite,
    [
      {
        id: uid('bfavorite:1'),
        bookId: uid('book:1'),
        userId: uid('user:student-1'),
        createdAt: daysFromNow(-5),
      },
      {
        id: uid('bfavorite:2'),
        bookId: uid('book:4'),
        userId: uid('user:customer-1'),
        createdAt: daysFromNow(-4),
      },
    ],
    'book_favorites',
  );

  // ---------------------------------------------------------- book_reading_lists
  await seedRows(
    manager,
    BookReadingList,
    [
      {
        id: uid('breadlist:1'),
        bookId: uid('book:2'),
        userId: uid('user:student-2'),
        createdAt: daysFromNow(-3),
      },
    ],
    'book_reading_lists',
  );

  // -------------------------------------------------------- book_recommendations
  await seedRows(
    manager,
    BookRecommendation,
    [
      {
        id: uid('brecommend:1'),
        bookId: uid('book:1'),
        recommendedBookId: uid('book:2'),
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('brecommend:2'),
        bookId: uid('book:2'),
        recommendedBookId: uid('book:1'),
        sortOrder: 1,
        status: 'ACTIVE',
      },
    ],
    'book_recommendations',
  );

  void ctx;
}

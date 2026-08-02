import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow } from './helpers';
import type { SeedCtx } from './context';
import {
  DigitalCategory,
  DigitalSubCategory,
  DigitalAuthor,
  DigitalPublisher,
  DigitalCourse,
  DigitalDepartment,
  DigitalSemester,
  DigitalInstitute,
  DigitalContent,
  DigitalFile,
  DigitalVersion,
  DigitalPreview,
  DigitalAccess,
  DigitalPurchase,
  DigitalDownload,
  DigitalBookmark,
  DigitalReadingHistory,
  DigitalReview,
  DigitalRating,
  DigitalWishlist,
  DigitalSubscription,
  DigitalCertificate,
  DigitalExam,
  DigitalExamQuestion,
  DigitalExamResult,
  DigitalAnnouncement,
  DigitalFAQ,
  DigitalSEO,
  DigitalAnalytics,
  DigitalReport,
} from '../../admin/digital-content/entities';

/**
 * Digital content seed. Keys shared across domains:
 *   dcontent:1..3, dcat:1..2, dexam:1
 */
export async function seedDigitalContent(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  // ------------------------------------------------------------ digital_categories
  await seedRows(
    manager,
    DigitalCategory,
    [
      {
        id: uid('dcat:1'),
        name: 'Lecture Videos',
        slug: 'lecture-videos',
        description: 'Recorded lecture series',
        icon: 'video',
        status: 'ACTIVE',
      },
      {
        id: uid('dcat:2'),
        name: 'Study Notes',
        slug: 'study-notes',
        description: 'PDF notes and summaries',
        icon: 'note',
        status: 'ACTIVE',
      },
    ],
    'digital_categories',
  );

  // --------------------------------------------------------- digital_sub_categories
  await seedRows(
    manager,
    DigitalSubCategory,
    [
      {
        id: uid('dsubcat:1'),
        categoryId: uid('dcat:1'),
        name: 'Physics Lectures',
        slug: 'physics-lectures',
        description: 'Physics lecture recordings',
        sortOrder: 1,
        status: 'ACTIVE',
      },
      {
        id: uid('dsubcat:2'),
        categoryId: uid('dcat:2'),
        name: 'Mathematics Notes',
        slug: 'mathematics-notes',
        description: 'Math study notes',
        sortOrder: 1,
        status: 'ACTIVE',
      },
    ],
    'digital_sub_categories',
  );

  // --------------------------------------------------------------- digital_authors
  await seedRows(
    manager,
    DigitalAuthor,
    [
      {
        id: uid('dauthor:1'),
        name: 'Prof. Rezaul Karim',
        slug: 'rezaul-karim',
        bio: 'Physics professor and online educator',
        status: 'ACTIVE',
      },
      {
        id: uid('dauthor:2'),
        name: 'Rumana Akter',
        slug: 'rumana-akter',
        bio: 'Mathematics lecturer',
        status: 'ACTIVE',
      },
    ],
    'digital_authors',
  );

  // ------------------------------------------------------------- digital_publishers
  await seedRows(
    manager,
    DigitalPublisher,
    [
      {
        id: uid('dpublisher:1'),
        name: 'BOI LAGBE Digital',
        slug: 'boi-lagbe-digital',
        website: 'https://boilagbe.com',
        status: 'ACTIVE',
      },
    ],
    'digital_publishers',
  );

  // --------------------------------------------------------------- digital_courses
  await seedRows(
    manager,
    DigitalCourse,
    [
      {
        id: uid('dcourse:1'),
        name: 'Physics 101',
        code: 'PHY-101',
        status: 'ACTIVE',
      },
      {
        id: uid('dcourse:2'),
        name: 'Mathematics 101',
        code: 'MATH-101',
        status: 'ACTIVE',
      },
    ],
    'digital_courses',
  );

  // ------------------------------------------------------------ digital_departments
  await seedRows(
    manager,
    DigitalDepartment,
    [
      {
        id: uid('ddepartment:1'),
        name: 'Science',
        code: 'SCI',
        status: 'ACTIVE',
      },
      {
        id: uid('ddepartment:2'),
        name: 'Engineering',
        code: 'ENG',
        status: 'ACTIVE',
      },
    ],
    'digital_departments',
  );

  // ------------------------------------------------------------- digital_semesters
  await seedRows(
    manager,
    DigitalSemester,
    [
      { id: uid('dsemester:1'), name: 'Semester 1', status: 'ACTIVE' },
      { id: uid('dsemester:2'), name: 'Semester 2', status: 'ACTIVE' },
    ],
    'digital_semesters',
  );

  // ------------------------------------------------------------- digital_institutes
  await seedRows(
    manager,
    DigitalInstitute,
    [
      {
        id: uid('dinstitute:1'),
        name: 'University of Dhaka',
        status: 'ACTIVE',
      },
      { id: uid('dinstitute:2'), name: 'BUET', status: 'ACTIVE' },
    ],
    'digital_institutes',
  );

  // -------------------------------------------------------------- digital_contents
  await seedRows(
    manager,
    DigitalContent,
    [
      {
        id: uid('dcontent:1'),
        contentCode: 'DC-0001',
        title: 'Physics 101 Full Lecture Series',
        slug: 'physics-101-lecture-series',
        type: 'PREMIUM',
        description: 'Complete video lectures for Physics 101',
        shortDescription: '25 video lectures',
        coverImage: '/uploads/digital/physics-101.jpg',
        categoryId: uid('dcat:1'),
        subcategoryId: uid('dsubcat:1'),
        authorId: uid('dauthor:1'),
        publisherId: uid('dpublisher:1'),
        courseId: uid('dcourse:1'),
        departmentId: uid('ddepartment:1'),
        semesterId: uid('dsemester:1'),
        instituteId: uid('dinstitute:1'),
        price: 1500,
        durationMinutes: 750,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-60),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('dcontent:2'),
        contentCode: 'DC-0002',
        title: 'Mathematics 101 Study Notes',
        slug: 'mathematics-101-study-notes',
        type: 'PREMIUM',
        description: 'Comprehensive PDF notes',
        shortDescription: '120 pages of notes',
        coverImage: '/uploads/digital/math-101.jpg',
        categoryId: uid('dcat:2'),
        subcategoryId: uid('dsubcat:2'),
        authorId: uid('dauthor:2'),
        publisherId: uid('dpublisher:1'),
        courseId: uid('dcourse:2'),
        departmentId: uid('ddepartment:1'),
        semesterId: uid('dsemester:1'),
        price: 800,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-40),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('dcontent:3'),
        contentCode: 'DC-0003',
        title: 'Chemistry Quick Reference',
        slug: 'chemistry-quick-reference',
        type: 'FREE',
        description: 'Free quick reference guide',
        shortDescription: 'Exam revision cards',
        coverImage: '/uploads/digital/chem-ref.jpg',
        categoryId: uid('dcat:2'),
        authorId: uid('dauthor:1'),
        courseId: uid('dcourse:1'),
        price: 0,
        status: 'ACTIVE',
        publishedAt: daysFromNow(-20),
        createdBy: uid('user:staff-1'),
      },
    ],
    'digital_contents',
  );

  // ---------------------------------------------------------------- digital_files
  await seedRows(
    manager,
    DigitalFile,
    [
      {
        id: uid('dfile:1'),
        contentId: uid('dcontent:1'),
        fileName: 'lecture-01.mp4',
        fileUrl: '/uploads/digital/lecture-01.mp4',
        fileType: 'video/mp4',
        fileSize: 150000000,
        sortOrder: 1,
      },
      {
        id: uid('dfile:2'),
        contentId: uid('dcontent:2'),
        fileName: 'math-101-notes.pdf',
        fileUrl: '/uploads/digital/math-101-notes.pdf',
        fileType: 'application/pdf',
        fileSize: 5000000,
        sortOrder: 1,
      },
    ],
    'digital_files',
  );

  // ------------------------------------------------------------- digital_versions
  await seedRows(
    manager,
    DigitalVersion,
    [
      {
        id: uid('dversion:1'),
        contentId: uid('dcontent:2'),
        versionNumber: '1.2',
        fileUrl: '/uploads/digital/math-101-notes-v1.2.pdf',
        fileSize: 5100000,
        changeLog: 'Added chapter 5',
      },
    ],
    'digital_versions',
  );

  // ------------------------------------------------------------- digital_previews
  await seedRows(
    manager,
    DigitalPreview,
    [
      {
        id: uid('dpreview:1'),
        contentId: uid('dcontent:1'),
        fileUrl: '/uploads/digital/physics-101-preview.mp4',
        durationSeconds: 90,
        sortOrder: 1,
      },
      {
        id: uid('dpreview:2'),
        contentId: uid('dcontent:2'),
        fileUrl: '/uploads/digital/math-101-preview.pdf',
        durationSeconds: 30,
        sortOrder: 1,
      },
    ],
    'digital_previews',
  );

  // --------------------------------------------------------------- digital_accesses
  await seedRows(
    manager,
    DigitalAccess,
    [
      {
        id: uid('daccess:1'),
        contentId: uid('dcontent:1'),
        userId: uid('user:student-1'),
        accessType: 'PURCHASED',
        grantedBy: uid('user:staff-1'),
        grantedAt: daysFromNow(-10),
        expiresAt: daysFromNow(350),
        status: 'ACTIVE',
      },
      {
        id: uid('daccess:2'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-1'),
        accessType: 'ADMINGRANTED',
        grantedBy: uid('user:staff-1'),
        grantedAt: daysFromNow(-5),
        status: 'ACTIVE',
      },
      {
        id: uid('daccess:3'),
        contentId: uid('dcontent:3'),
        userId: uid('user:student-2'),
        accessType: 'TRIAL',
        grantedAt: daysFromNow(-2),
        expiresAt: daysFromNow(5),
        status: 'ACTIVE',
      },
    ],
    'digital_accesses',
  );

  // ------------------------------------------------------------- digital_purchases
  await seedRows(
    manager,
    DigitalPurchase,
    [
      {
        id: uid('dpurchase:1'),
        contentId: uid('dcontent:1'),
        userId: uid('user:student-1'),
        amount: 1500,
        reference: 'PAY-1001',
        status: 'COMPLETED',
        purchasedAt: daysFromNow(-10),
      },
      {
        id: uid('dpurchase:2'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-2'),
        amount: 800,
        status: 'PENDING',
      },
    ],
    'digital_purchases',
  );

  // -------------------------------------------------------------- digital_downloads
  await seedRows(
    manager,
    DigitalDownload,
    [
      {
        id: uid('ddownload:1'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-1'),
        downloadedAt: daysFromNow(-3),
      },
    ],
    'digital_downloads',
  );

  // -------------------------------------------------------------- digital_bookmarks
  await seedRows(
    manager,
    DigitalBookmark,
    [
      {
        id: uid('dbookmark:1'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-1'),
        page: 45,
        createdAt: daysFromNow(-3),
      },
    ],
    'digital_bookmarks',
  );

  // ------------------------------------------------------- digital_reading_histories
  await seedRows(
    manager,
    DigitalReadingHistory,
    [
      {
        id: uid('dreading:1'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-1'),
        progressPercent: 40,
        lastPosition: 48,
        lastReadAt: daysFromNow(-3),
      },
    ],
    'digital_reading_histories',
  );

  // --------------------------------------------------------------- digital_reviews
  await seedRows(
    manager,
    DigitalReview,
    [
      {
        id: uid('dreview:1'),
        contentId: uid('dcontent:1'),
        userId: uid('user:student-1'),
        title: 'Excellent lectures',
        body: 'Very clear explanations of difficult topics.',
        rating: 5,
        status: 'APPROVED',
        moderatedBy: uid('user:staff-1'),
        moderatedAt: daysFromNow(-5),
      },
      {
        id: uid('dreview:2'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-1'),
        title: 'Good notes',
        body: 'Concise and helpful.',
        rating: 4,
        status: 'PENDING',
      },
    ],
    'digital_reviews',
  );

  // --------------------------------------------------------------- digital_ratings
  await seedRows(
    manager,
    DigitalRating,
    [
      {
        id: uid('drating:1'),
        contentId: uid('dcontent:1'),
        userId: uid('user:student-1'),
        rating: 5,
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('drating:2'),
        contentId: uid('dcontent:2'),
        userId: uid('user:customer-1'),
        rating: 4,
        createdAt: daysFromNow(-3),
      },
    ],
    'digital_ratings',
  );

  // -------------------------------------------------------------- digital_wishlists
  await seedRows(
    manager,
    DigitalWishlist,
    [
      {
        id: uid('dwishlist:1'),
        contentId: uid('dcontent:1'),
        userId: uid('user:student-2'),
        createdAt: daysFromNow(-4),
      },
    ],
    'digital_wishlists',
  );

  // ---------------------------------------------------------- digital_subscriptions
  await seedRows(
    manager,
    DigitalSubscription,
    [
      {
        id: uid('dsubscription:1'),
        userId: uid('user:student-1'),
        plan: 'MONTHLY',
        amount: 500,
        startDate: daysFromNow(-10),
        endDate: daysFromNow(20),
        status: 'ACTIVE',
      },
      {
        id: uid('dsubscription:2'),
        userId: uid('user:customer-1'),
        plan: 'YEARLY',
        amount: 4800,
        startDate: daysFromNow(-60),
        endDate: daysFromNow(305),
        status: 'ACTIVE',
      },
    ],
    'digital_subscriptions',
  );

  // ----------------------------------------------------------------- digital_exams
  await seedRows(
    manager,
    DigitalExam,
    [
      {
        id: uid('dexam:1'),
        contentId: uid('dcontent:1'),
        title: 'Physics 101 Final Exam',
        description: 'Final assessment for the lecture series',
        durationMinutes: 60,
        totalMarks: 50,
        passMarks: 30,
        status: 'ACTIVE',
        createdBy: uid('user:staff-1'),
      },
    ],
    'digital_exams',
  );

  // --------------------------------------------------------- digital_exam_questions
  await seedRows(
    manager,
    DigitalExamQuestion,
    [
      {
        id: uid('dexamq:1'),
        examId: uid('dexam:1'),
        question: 'What is the SI unit of force?',
        optionA: 'Joule',
        optionB: 'Newton',
        optionC: 'Watt',
        optionD: 'Pascal',
        correctAnswer: 'Newton',
        marks: 5,
        sortOrder: 1,
      },
      {
        id: uid('dexamq:2'),
        examId: uid('dexam:1'),
        question:
          'Which law states that energy cannot be created or destroyed?',
        optionA: "Newton's First Law",
        optionB: 'Law of Conservation of Energy',
        optionC: "Ohm's Law",
        optionD: "Boyle's Law",
        correctAnswer: 'Law of Conservation of Energy',
        marks: 5,
        sortOrder: 2,
      },
    ],
    'digital_exam_questions',
  );

  // ------------------------------------------------------------ digital_exam_results
  await seedRows(
    manager,
    DigitalExamResult,
    [
      {
        id: uid('dexamr:1'),
        examId: uid('dexam:1'),
        userId: uid('user:student-1'),
        score: 45,
        totalMarks: 50,
        status: 'PASSED',
        submittedAt: daysFromNow(-4),
      },
    ],
    'digital_exam_results',
  );

  // ------------------------------------------------------------ digital_certificates
  await seedRows(
    manager,
    DigitalCertificate,
    [
      {
        id: uid('dcert:1'),
        certificateCode: 'CERT-0001',
        examId: uid('dexam:1'),
        userId: uid('user:student-1'),
        issuedBy: uid('user:staff-1'),
        issuedAt: daysFromNow(-4),
        expiresAt: daysFromNow(360),
        status: 'ISSUED',
      },
    ],
    'digital_certificates',
  );

  // ---------------------------------------------------------- digital_announcements
  await seedRows(
    manager,
    DigitalAnnouncement,
    [
      {
        id: uid('dannouncement:1'),
        title: 'New physics series released',
        message: 'Physics 101 lecture series is now available.',
        targetAudience: 'ALL',
        createdBy: uid('user:staff-1'),
        publishedAt: daysFromNow(-60),
      },
    ],
    'digital_announcements',
  );

  // ----------------------------------------------------------------- digital_faqs
  await seedRows(
    manager,
    DigitalFAQ,
    [
      {
        id: uid('dfaq:1'),
        question: 'How long do I have access?',
        answer: 'Purchased content is accessible for 1 year.',
        sortOrder: 1,
        status: 'ACTIVE',
      },
    ],
    'digital_faqs',
  );

  // ------------------------------------------------------------------ digital_seos
  await seedRows(
    manager,
    DigitalSEO,
    [
      {
        id: uid('dseo:1'),
        contentId: uid('dcontent:1'),
        metaTitle: 'Physics 101 Lectures | BOI LAGBE',
        metaDescription: 'Full Physics 101 lecture series.',
        keywords: 'physics, lectures, videos',
        canonicalUrl: '/digital/physics-101',
      },
    ],
    'digital_seos',
  );

  // ------------------------------------------------------------ digital_analytics
  await seedRows(
    manager,
    DigitalAnalytics,
    [
      {
        id: uid('danalytics:1'),
        contentId: uid('dcontent:1'),
        period: '2026-06',
        metric: 'views',
        value: 1200,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('danalytics:2'),
        contentId: uid('dcontent:1'),
        period: '2026-06',
        metric: 'purchases',
        value: 45,
        generatedAt: daysFromNow(-30),
      },
      {
        id: uid('danalytics:3'),
        contentId: uid('dcontent:2'),
        period: '2026-07',
        metric: 'views',
        value: 800,
        generatedAt: daysFromNow(-5),
      },
    ],
    'digital_analytics',
  );

  // --------------------------------------------------------------- digital_reports
  await seedRows(
    manager,
    DigitalReport,
    [
      {
        id: uid('dreport:1'),
        reportCode: 'DR-0001',
        title: 'Digital Content Performance June 2026',
        reportType: 'PERFORMANCE',
        periodStart: daysFromNow(-30),
        periodEnd: daysFromNow(-1),
        fileUrl: '/reports/digital/dr-0001.pdf',
        generatedBy: uid('user:staff-1'),
        status: 'GENERATED',
      },
    ],
    'digital_reports',
  );

  void ctx;
}

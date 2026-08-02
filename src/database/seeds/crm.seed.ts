import { EntityManager } from 'typeorm';
import { seedRows, uid, daysFromNow, monthYear } from './helpers';
import type { SeedCtx } from './context';
import {
  CustomerTicket,
  TicketChannel,
  TicketCategory,
  TicketCategoryType,
  TicketPriority,
  TicketPriorityType,
  TicketStatus,
  TicketStatusType,
  TicketReply,
  TicketAttachment,
  TicketAssignment,
  LiveChat,
  LiveChatStatus,
  ChatMessage,
  ChatSenderType,
  ChatAttachment,
  CustomerFeedback,
  FeedbackStatus,
  CustomerComplaint,
  ComplaintStatus,
  CustomerSuggestion,
  SuggestionStatus,
  FAQ,
  FAQStatus,
  KnowledgeBase,
  KnowledgeBaseStatus,
  Announcement,
  AnnouncementAudience,
  AnnouncementStatus,
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  NotificationTemplate,
  NotificationTemplateStatus,
  EmailQueue,
  EmailQueueStatus,
  SMSQueue,
  SMSQueueStatus,
  PushNotification,
  PushNotificationStatus,
  ContactMessage,
  ContactMessageStatus,
  CustomerSurvey,
  SurveyStatus,
  SurveyQuestion,
  SurveyQuestionType,
  SurveyResponse,
  LoyaltyPointHistory,
  LoyaltyPointType,
  CustomerReward,
  CustomerRewardStatus,
  CRMActivity,
  CustomerSupportAnalytics,
  CustomerSupportReport,
} from '../../admin/crm/entities';

/**
 * CRM / support seed. Keys shared across domains:
 *   crmticket:1..3, livechat:1..2, survey:1
 */
export async function seedCrm(
  manager: EntityManager,
  ctx: SeedCtx,
): Promise<void> {
  const { month, year } = monthYear(0);
  const period = `${year}-${String(month).padStart(2, '0')}`;

  // ------------------------------------------------------------- ticket_categories
  await seedRows(
    manager,
    TicketCategory,
    [
      {
        id: uid('ticketcat:1'),
        code: 'ORDER',
        name: 'Order Issues',
        description: 'Problems with placed orders',
        sortOrder: 1,
        status: TicketCategoryType.ACTIVE,
      },
      {
        id: uid('ticketcat:2'),
        code: 'PAYMENT',
        name: 'Payment & Refunds',
        description: 'Payment, invoicing and refund queries',
        sortOrder: 2,
        status: TicketCategoryType.ACTIVE,
      },
      {
        id: uid('ticketcat:3'),
        code: 'BOOK',
        name: 'Books & Content',
        description: 'Book, used-book and digital content issues',
        sortOrder: 3,
        status: TicketCategoryType.ACTIVE,
      },
      {
        id: uid('ticketcat:4'),
        code: 'DELIVERY',
        name: 'Delivery',
        description: 'Delivery and tracking issues',
        sortOrder: 4,
        status: TicketCategoryType.ACTIVE,
      },
      {
        id: uid('ticketcat:5'),
        code: 'ACCOUNT',
        name: 'Account & Technical',
        description: 'Account access and technical problems',
        sortOrder: 5,
        status: TicketCategoryType.ACTIVE,
      },
    ],
    'ticket_categories',
  );

  // ------------------------------------------------------------- ticket_priorities
  await seedRows(
    manager,
    TicketPriority,
    [
      {
        id: uid('ticketprio:1'),
        code: 'LOW',
        name: 'Low',
        level: 1,
        color: '#6b7280',
        sortOrder: 1,
        status: TicketPriorityType.ACTIVE,
      },
      {
        id: uid('ticketprio:2'),
        code: 'MEDIUM',
        name: 'Medium',
        level: 2,
        color: '#f59e0b',
        sortOrder: 2,
        status: TicketPriorityType.ACTIVE,
      },
      {
        id: uid('ticketprio:3'),
        code: 'HIGH',
        name: 'High',
        level: 3,
        color: '#ef4444',
        sortOrder: 3,
        status: TicketPriorityType.ACTIVE,
      },
      {
        id: uid('ticketprio:4'),
        code: 'URGENT',
        name: 'Urgent',
        level: 4,
        color: '#7f1d1d',
        sortOrder: 4,
        status: TicketPriorityType.ACTIVE,
      },
    ],
    'ticket_priorities',
  );

  // --------------------------------------------------------------- ticket_statuses
  await seedRows(
    manager,
    TicketStatus,
    [
      {
        id: uid('ticketstatus:1'),
        code: 'OPEN',
        name: 'Open',
        color: '#3b82f6',
        sortOrder: 1,
        isDefault: true,
        status: TicketStatusType.ACTIVE,
      },
      {
        id: uid('ticketstatus:2'),
        code: 'IN_PROGRESS',
        name: 'In Progress',
        color: '#f59e0b',
        sortOrder: 2,
        isDefault: false,
        status: TicketStatusType.ACTIVE,
      },
      {
        id: uid('ticketstatus:3'),
        code: 'RESOLVED',
        name: 'Resolved',
        color: '#22c55e',
        sortOrder: 3,
        isDefault: false,
        status: TicketStatusType.ACTIVE,
      },
      {
        id: uid('ticketstatus:4'),
        code: 'CLOSED',
        name: 'Closed',
        color: '#6b7280',
        sortOrder: 4,
        isDefault: false,
        status: TicketStatusType.ACTIVE,
      },
    ],
    'ticket_statuses',
  );

  // ------------------------------------------------------------- customer_tickets
  await seedRows(
    manager,
    CustomerTicket,
    [
      {
        id: uid('crmticket:1'),
        ticketCode: 'TKT-2026-0001',
        customerId: uid('user:student-1'),
        subject: 'Order not delivered',
        description: 'My order was placed 10 days ago but has not arrived.',
        categoryId: uid('ticketcat:1'),
        priorityId: uid('ticketprio:3'),
        statusId: uid('ticketstatus:2'),
        channel: TicketChannel.APP,
        orderId: uid('order:2'),
        assignedTo: uid('user:staff-1'),
        assignedAt: daysFromNow(-1),
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('crmticket:2'),
        ticketCode: 'TKT-2026-0002',
        customerId: uid('user:customer-1'),
        subject: 'Payment deducted twice',
        description: 'Payment was deducted twice for the same order.',
        categoryId: uid('ticketcat:2'),
        priorityId: uid('ticketprio:2'),
        statusId: uid('ticketstatus:1'),
        channel: TicketChannel.WEB,
        orderId: uid('order:1'),
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('crmticket:3'),
        ticketCode: 'TKT-2026-0003',
        customerId: uid('user:customer-2'),
        subject: 'Wrong edition received',
        description: 'Received a different edition than ordered.',
        categoryId: uid('ticketcat:3'),
        priorityId: uid('ticketprio:1'),
        statusId: uid('ticketstatus:3'),
        channel: TicketChannel.EMAIL,
        orderId: uid('order:3'),
        assignedTo: uid('user:staff-1'),
        resolvedAt: daysFromNow(0),
        rating: 4,
        createdAt: daysFromNow(-3),
      },
    ],
    'customer_tickets',
  );

  // ----------------------------------------------------------------- ticket_replies
  await seedRows(
    manager,
    TicketReply,
    [
      {
        id: uid('ticketreply:1'),
        ticketId: uid('crmticket:1'),
        adminId: uid('user:staff-1'),
        message:
          'We are checking with the delivery partner and will update you shortly.',
        isInternal: false,
        isFromCustomer: false,
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('ticketreply:2'),
        ticketId: uid('crmticket:1'),
        customerId: uid('user:student-1'),
        message: 'Thank you, please keep me posted.',
        isInternal: false,
        isFromCustomer: true,
        createdAt: daysFromNow(0),
      },
      {
        id: uid('ticketreply:3'),
        ticketId: uid('crmticket:3'),
        adminId: uid('user:staff-1'),
        message:
          'We have arranged a replacement. Apologies for the inconvenience.',
        isInternal: false,
        isFromCustomer: false,
        createdAt: daysFromNow(-1),
      },
    ],
    'ticket_replies',
  );

  // ----------------------------------------------------------- ticket_attachments
  await seedRows(
    manager,
    TicketAttachment,
    [
      {
        id: uid('ticketatt:1'),
        ticketId: uid('crmticket:1'),
        fileName: 'order-screenshot.png',
        fileUrl: '/uploads/tickets/order-screenshot.png',
        fileType: 'image/png',
        fileSize: 204800,
        uploadedBy: uid('user:student-1'),
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('ticketatt:2'),
        ticketId: uid('crmticket:2'),
        fileName: 'bank-statement.pdf',
        fileUrl: '/uploads/tickets/bank-statement.pdf',
        fileType: 'application/pdf',
        fileSize: 102400,
        uploadedBy: uid('user:customer-1'),
        createdAt: daysFromNow(-1),
      },
    ],
    'ticket_attachments',
  );

  // ------------------------------------------------------------ ticket_assignments
  await seedRows(
    manager,
    TicketAssignment,
    [
      {
        id: uid('ticketassign:1'),
        ticketId: uid('crmticket:1'),
        assignedTo: uid('user:staff-1'),
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(-1),
        remarks: 'Assigned to delivery ops',
      },
      {
        id: uid('ticketassign:2'),
        ticketId: uid('crmticket:2'),
        assignedTo: uid('user:staff-1'),
        assignedBy: uid('user:staff-1'),
        assignedAt: daysFromNow(0),
        remarks: 'Pending finance review',
      },
    ],
    'ticket_assignments',
  );

  // ------------------------------------------------------------------- live_chats
  await seedRows(
    manager,
    LiveChat,
    [
      {
        id: uid('livechat:1'),
        chatCode: 'CHAT-2026-0001',
        customerId: uid('user:customer-1'),
        status: LiveChatStatus.ACTIVE,
        assignedTo: uid('user:staff-1'),
        startedAt: daysFromNow(0),
        lastMessageAt: daysFromNow(0),
        rating: 5,
        createdAt: daysFromNow(0),
      },
      {
        id: uid('livechat:2'),
        chatCode: 'CHAT-2026-0002',
        customerId: uid('user:student-1'),
        status: LiveChatStatus.CLOSED,
        assignedTo: uid('user:staff-1'),
        startedAt: daysFromNow(-2),
        endedAt: daysFromNow(-1),
        lastMessageAt: daysFromNow(-1),
        createdAt: daysFromNow(-2),
      },
    ],
    'live_chats',
  );

  // ---------------------------------------------------------------- chat_messages
  await seedRows(
    manager,
    ChatMessage,
    [
      {
        id: uid('chatmsg:1'),
        chatId: uid('livechat:1'),
        senderType: ChatSenderType.CUSTOMER,
        senderId: uid('user:customer-1'),
        message: 'Hi, is the calculator in stock?',
        isRead: true,
        readAt: daysFromNow(0),
        createdAt: daysFromNow(0),
      },
      {
        id: uid('chatmsg:2'),
        chatId: uid('livechat:1'),
        senderType: ChatSenderType.ADMIN,
        senderId: uid('user:staff-1'),
        message: 'Hello! Yes, the FX-991 is in stock.',
        isRead: true,
        readAt: daysFromNow(0),
        createdAt: daysFromNow(0),
      },
      {
        id: uid('chatmsg:3'),
        chatId: uid('livechat:2'),
        senderType: ChatSenderType.CUSTOMER,
        senderId: uid('user:student-1'),
        message: 'Where is my delivery?',
        isRead: true,
        readAt: daysFromNow(-1),
        createdAt: daysFromNow(-2),
      },
    ],
    'chat_messages',
  );

  // -------------------------------------------------------------- chat_attachments
  await seedRows(
    manager,
    ChatAttachment,
    [
      {
        id: uid('chatatt:1'),
        messageId: uid('chatmsg:1'),
        fileName: 'calc-question.png',
        fileUrl: '/uploads/chats/calc-question.png',
        fileType: 'image/png',
        fileSize: 51200,
        uploadedBy: uid('user:customer-1'),
        createdAt: daysFromNow(0),
      },
    ],
    'chat_attachments',
  );

  // ------------------------------------------------------------ customer_feedback
  await seedRows(
    manager,
    CustomerFeedback,
    [
      {
        id: uid('crmfeedback:1'),
        customerId: uid('user:customer-1'),
        orderId: uid('order:1'),
        rating: 5,
        comment: 'Fast delivery and great packaging.',
        category: 'delivery',
        status: FeedbackStatus.NEW,
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('crmfeedback:2'),
        customerId: uid('user:student-1'),
        orderId: uid('order:2'),
        rating: 4,
        comment: 'Books are good quality.',
        category: 'product',
        status: FeedbackStatus.REVIEWED,
        createdAt: daysFromNow(-2),
      },
    ],
    'customer_feedback',
  );

  // ----------------------------------------------------------- customer_complaints
  await seedRows(
    manager,
    CustomerComplaint,
    [
      {
        id: uid('crmcomplaint:1'),
        complaintCode: 'CMP-2026-0001',
        customerId: uid('user:customer-2'),
        orderId: uid('order:3'),
        subject: 'Damaged book received',
        description: 'The book arrived with a torn cover.',
        status: ComplaintStatus.IN_PROGRESS,
        resolvedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('crmcomplaint:2'),
        complaintCode: 'CMP-2026-0002',
        customerId: uid('user:customer-1'),
        subject: 'Rider was rude',
        description: 'The delivery rider behaved unprofessionally.',
        status: ComplaintStatus.OPEN,
        createdAt: daysFromNow(-1),
      },
    ],
    'customer_complaints',
  );

  // ---------------------------------------------------------- customer_suggestions
  await seedRows(
    manager,
    CustomerSuggestion,
    [
      {
        id: uid('crmsuggestion:1'),
        customerId: uid('user:student-1'),
        title: 'Add overnight delivery option',
        description: 'It would help students who need books urgently.',
        status: SuggestionStatus.UNDER_REVIEW,
        reviewedBy: uid('user:staff-1'),
        createdAt: daysFromNow(-3),
      },
      {
        id: uid('crmsuggestion:2'),
        customerId: uid('user:customer-2'),
        title: 'More digital content',
        description: 'Add more PDF study notes for science subjects.',
        status: SuggestionStatus.NEW,
        createdAt: daysFromNow(-1),
      },
    ],
    'customer_suggestions',
  );

  // ------------------------------------------------------------------------- faqs
  await seedRows(
    manager,
    FAQ,
    [
      {
        id: uid('crmfaq:1'),
        question: 'How do I track my order?',
        answer: 'Go to My Orders and select the order to view live tracking.',
        category: 'orders',
        sortOrder: 1,
        status: FAQStatus.PUBLISHED,
      },
      {
        id: uid('crmfaq:2'),
        question: 'What is the return policy?',
        answer:
          'Items can be returned within 7 days of delivery if damaged or incorrect.',
        category: 'returns',
        sortOrder: 2,
        status: FAQStatus.PUBLISHED,
      },
      {
        id: uid('crmfaq:3'),
        question: 'How do I sell used books?',
        answer:
          'Submit a sell request from the app, and an agent will contact you for pickup.',
        category: 'used-books',
        sortOrder: 3,
        status: FAQStatus.PUBLISHED,
      },
    ],
    'faqs',
  );

  // -------------------------------------------------------------- knowledge_base
  await seedRows(
    manager,
    KnowledgeBase,
    [
      {
        id: uid('crmkb:1'),
        slug: 'order-tracking-guide',
        title: 'Order Tracking Guide',
        category: 'orders',
        content:
          'Step-by-step guide to tracking an order from placement to delivery.',
        tags: ['orders', 'tracking'],
        viewCount: 120,
        status: KnowledgeBaseStatus.PUBLISHED,
        publishedAt: daysFromNow(-30),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('crmkb:2'),
        slug: 'used-book-selling-guide',
        title: 'Selling Used Books',
        category: 'used-books',
        content: 'How to prepare, submit and get paid for used book sales.',
        tags: ['used-books', 'sell'],
        viewCount: 80,
        status: KnowledgeBaseStatus.PUBLISHED,
        publishedAt: daysFromNow(-20),
        createdBy: uid('user:staff-1'),
      },
    ],
    'knowledge_base',
  );

  // ---------------------------------------------------------------- announcements
  await seedRows(
    manager,
    Announcement,
    [
      {
        id: uid('crmannouncement:1'),
        title: 'Monsoon Book Sale',
        message: 'Up to 30% off on academic books this week!',
        audience: AnnouncementAudience.ALL,
        status: AnnouncementStatus.PUBLISHED,
        publishedAt: daysFromNow(-2),
        expiresAt: daysFromNow(5),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('crmannouncement:2'),
        title: 'New digital courses',
        message: 'Physics 101 lecture series is now live.',
        audience: AnnouncementAudience.CUSTOMER,
        status: AnnouncementStatus.PUBLISHED,
        publishedAt: daysFromNow(-5),
        createdBy: uid('user:staff-1'),
      },
    ],
    'announcements',
  );

  // ---------------------------------------------------------------- notifications
  await seedRows(
    manager,
    Notification,
    [
      {
        id: uid('crmnotification:1'),
        userId: uid('user:customer-1'),
        title: 'Order delivered',
        body: 'Your order BL-ORD-1001 has been delivered.',
        type: NotificationType.ORDER,
        channel: NotificationChannel.IN_APP,
        data: { orderId: uid('order:1') },
        referenceType: 'order',
        referenceId: uid('order:1'),
        status: NotificationStatus.READ,
        sentAt: daysFromNow(-5),
        readAt: daysFromNow(-4),
      },
      {
        id: uid('crmnotification:2'),
        userId: uid('user:student-1'),
        title: 'Offer accepted',
        body: 'Your used book offer was accepted.',
        type: NotificationType.LOYALTY,
        channel: NotificationChannel.PUSH,
        data: { offerId: uid('uboffer:1') },
        status: NotificationStatus.SENT,
        sentAt: daysFromNow(-3),
      },
    ],
    'notifications',
  );

  // --------------------------------------------------------- notification_templates
  await seedRows(
    manager,
    NotificationTemplate,
    [
      {
        id: uid('crmnotiftemplate:1'),
        templateCode: 'TPL-ORDER-CONFIRMED',
        name: 'Order Confirmation',
        type: NotificationType.ORDER,
        channel: NotificationChannel.IN_APP,
        subject: 'Order confirmed',
        body: 'Your order {{orderCode}} has been confirmed.',
        variables: ['orderCode'],
        status: NotificationTemplateStatus.ACTIVE,
      },
      {
        id: uid('crmnotiftemplate:2'),
        templateCode: 'TPL-OTP',
        name: 'Login OTP',
        type: NotificationType.SYSTEM,
        channel: NotificationChannel.SMS,
        body: 'Your BOI LAGBE OTP is {{otp}}.',
        variables: ['otp'],
        status: NotificationTemplateStatus.ACTIVE,
      },
    ],
    'notification_templates',
  );

  // ------------------------------------------------------------------ email_queue
  await seedRows(
    manager,
    EmailQueue,
    [
      {
        id: uid('crmemail:1'),
        to: 'farhana@boilagbe.test',
        subject: 'Order confirmation BL-ORD-1001',
        body: 'Thank you for your order. It has been confirmed.',
        templateId: uid('crmnotiftemplate:1'),
        data: { orderCode: 'BL-ORD-1001' },
        status: EmailQueueStatus.SENT,
        sentAt: daysFromNow(-6),
      },
      {
        id: uid('crmemail:2'),
        to: 'mahmud@boilagbe.test',
        subject: 'Welcome to BOI LAGBE',
        body: 'Thanks for joining! Enjoy your first purchase discount.',
        status: EmailQueueStatus.QUEUED,
      },
    ],
    'email_queue',
  );

  // -------------------------------------------------------------------- sms_queue
  await seedRows(
    manager,
    SMSQueue,
    [
      {
        id: uid('crmsms:1'),
        phone: '01700000002',
        message: 'Your BOI LAGBE OTP is 123456.',
        templateId: uid('crmnotiftemplate:2'),
        data: { otp: '123456' },
        status: SMSQueueStatus.SENT,
        sentAt: daysFromNow(-2),
      },
      {
        id: uid('crmsms:2'),
        phone: '01700000005',
        message: 'Your order is out for delivery.',
        status: SMSQueueStatus.QUEUED,
      },
    ],
    'sms_queue',
  );

  // ------------------------------------------------------------ push_notifications
  await seedRows(
    manager,
    PushNotification,
    [
      {
        id: uid('crmpush:1'),
        userId: uid('user:customer-1'),
        title: 'Sale alert',
        body: 'Up to 30% off academic books!',
        data: { deepLink: '/sale' },
        status: PushNotificationStatus.SENT,
        sentAt: daysFromNow(-2),
      },
      {
        id: uid('crmpush:2'),
        userId: uid('user:student-1'),
        title: 'New content',
        body: 'Physics 101 lectures are now available.',
        status: PushNotificationStatus.QUEUED,
      },
    ],
    'push_notifications',
  );

  // -------------------------------------------------------------- contact_messages
  await seedRows(
    manager,
    ContactMessage,
    [
      {
        id: uid('crmcontact:1'),
        name: 'Tanvir Ahmed',
        email: 'tanvir@boilagbe.test',
        phone: '01700000004',
        subject: 'Partnership inquiry',
        message:
          'We would like to partner with BOI LAGBE for campus deliveries.',
        status: ContactMessageStatus.NEW,
        createdAt: daysFromNow(-2),
      },
      {
        id: uid('crmcontact:2'),
        name: 'Unknown',
        email: 'hello@example.com',
        subject: 'Praise for service',
        message: 'Loved the used-book buyback experience!',
        status: ContactMessageStatus.REPLIED,
        repliedBy: uid('user:staff-1'),
        repliedAt: daysFromNow(-1),
        createdAt: daysFromNow(-3),
      },
    ],
    'contact_messages',
  );

  // -------------------------------------------------------------- customer_surveys
  await seedRows(
    manager,
    CustomerSurvey,
    [
      {
        id: uid('crmssurvey:1'),
        title: 'Student Experience Survey',
        description: 'Help us improve your BOI LAGBE experience.',
        status: SurveyStatus.ACTIVE,
        startsAt: daysFromNow(-7),
        endsAt: daysFromNow(7),
        createdBy: uid('user:staff-1'),
      },
      {
        id: uid('crmssurvey:2'),
        title: 'Delivery Satisfaction',
        description: 'Rate your recent delivery experience.',
        status: SurveyStatus.CLOSED,
        startsAt: daysFromNow(-30),
        endsAt: daysFromNow(-3),
        createdBy: uid('user:staff-1'),
      },
    ],
    'customer_surveys',
  );

  // ------------------------------------------------------------- survey_questions
  await seedRows(
    manager,
    SurveyQuestion,
    [
      {
        id: uid('crmsq:1'),
        surveyId: uid('crmssurvey:1'),
        question: 'How satisfied are you with BOI LAGBE?',
        questionType: SurveyQuestionType.RATING,
        options: ['1', '2', '3', '4', '5'],
        sortOrder: 1,
        isRequired: true,
      },
      {
        id: uid('crmsq:2'),
        surveyId: uid('crmssurvey:1'),
        question: 'Which category do you shop most?',
        questionType: SurveyQuestionType.SINGLE_CHOICE,
        options: ['Books', 'Stationery', 'Electronics'],
        sortOrder: 2,
        isRequired: false,
      },
      {
        id: uid('crmsq:3'),
        surveyId: uid('crmssurvey:2'),
        question: 'Was your delivery on time?',
        questionType: SurveyQuestionType.BOOLEAN,
        options: ['Yes', 'No'],
        sortOrder: 1,
        isRequired: true,
      },
    ],
    'survey_questions',
  );

  // -------------------------------------------------------------- survey_responses
  await seedRows(
    manager,
    SurveyResponse,
    [
      {
        id: uid('crmssurveyresp:1'),
        surveyId: uid('crmssurvey:1'),
        customerId: uid('user:student-1'),
        answers: { 'crmsq:1': 4, 'crmsq:2': 'Books' },
        submittedAt: daysFromNow(-3),
      },
      {
        id: uid('crmssurveyresp:2'),
        surveyId: uid('crmssurvey:2'),
        customerId: uid('user:customer-1'),
        answers: { 'crmsq:3': 'Yes' },
        submittedAt: daysFromNow(-5),
      },
    ],
    'survey_responses',
  );

  // ---------------------------------------------------------- loyalty_point_history
  await seedRows(
    manager,
    LoyaltyPointHistory,
    [
      {
        id: uid('crmloyalty:1'),
        customerId: uid('user:customer-1'),
        points: 50,
        pointType: LoyaltyPointType.EARNED,
        reason: 'Order BL-ORD-1001',
        referenceType: 'order',
        referenceId: uid('order:1'),
        balanceBefore: 100,
        balanceAfter: 150,
        createdAt: daysFromNow(-6),
      },
      {
        id: uid('crmloyalty:2'),
        customerId: uid('user:customer-1'),
        points: 100,
        pointType: LoyaltyPointType.REDEEMED,
        reason: 'Redeemed for a discount voucher',
        balanceBefore: 150,
        balanceAfter: 50,
        createdAt: daysFromNow(-2),
      },
    ],
    'loyalty_point_history',
  );

  // --------------------------------------------------------------- customer_rewards
  await seedRows(
    manager,
    CustomerReward,
    [
      {
        id: uid('crmreward:1'),
        rewardCode: 'RWD-001',
        customerId: uid('user:customer-1'),
        title: '100 BDT Discount Voucher',
        pointsCost: 100,
        description: 'Redeem 100 points for a 100 BDT voucher.',
        status: CustomerRewardStatus.REDEEMED,
        redeemedAt: daysFromNow(-2),
        redeemedBy: uid('user:customer-1'),
      },
      {
        id: uid('crmreward:2'),
        rewardCode: 'RWD-002',
        customerId: uid('user:customer-1'),
        title: 'Free Delivery',
        pointsCost: 200,
        description: 'One free delivery on any order.',
        status: CustomerRewardStatus.AVAILABLE,
      },
    ],
    'customer_rewards',
  );

  // ---------------------------------------------------------------- crm_activities
  await seedRows(
    manager,
    CRMActivity,
    [
      {
        id: uid('crmactivity:1'),
        adminId: uid('user:staff-1'),
        activityType: 'TICKET_REPLY',
        description: 'Replied to ticket TKT-2026-0001',
        referenceType: 'ticket',
        referenceId: uid('crmticket:1'),
        ipAddress: '127.0.0.1',
        device: 'Windows',
        createdAt: daysFromNow(-1),
      },
      {
        id: uid('crmactivity:2'),
        adminId: uid('user:staff-1'),
        activityType: 'CHAT_ASSIGN',
        description: 'Assigned live chat CHAT-2026-0001',
        referenceType: 'chat',
        referenceId: uid('livechat:1'),
        ipAddress: '127.0.0.1',
        createdAt: daysFromNow(0),
      },
    ],
    'crm_activities',
  );

  // ------------------------------------------------------ customer_support_analytics
  await seedRows(
    manager,
    CustomerSupportAnalytics,
    [
      {
        id: uid('crmanalytics:1'),
        period,
        periodType: 'MONTHLY',
        totalTickets: 12,
        resolvedTickets: 9,
        openTickets: 3,
        avgResponseMinutes: 45,
        avgResolutionHours: 12,
        csatScore: 4.5,
        totalChats: 8,
        generatedAt: daysFromNow(-1),
      },
    ],
    'customer_support_analytics',
  );

  // -------------------------------------------------------- customer_support_reports
  await seedRows(
    manager,
    CustomerSupportReport,
    [
      {
        id: uid('crmreport:1'),
        reportCode: 'CSR-2026-0001',
        title: 'Support Report June 2026',
        periodStart: daysFromNow(-30),
        periodEnd: daysFromNow(-1),
        reportData: { totalTickets: 12, resolvedTickets: 9 },
        generatedBy: uid('user:staff-1'),
        generatedAt: daysFromNow(-2),
      },
    ],
    'customer_support_reports',
  );

  void ctx;
}

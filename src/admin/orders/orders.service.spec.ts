import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities';
import type { AdminRequest } from '../common/interfaces/admin-request.interface';

// Unit tests for the order lifecycle guards: the forward-only status
// transition map, the refund-amount validation, and the terminal-state
// blocking shared by cancel/assign operations.
describe('OrdersService', () => {
  const mockRepo = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    create: jest.fn((values: unknown) => values),
    count: jest.fn(),
  });

  const makeOrder = (overrides: Partial<Order> = {}): Order =>
    ({
      id: 'order-1',
      orderCode: 'ORD-1',
      userId: 'user-1',
      status: OrderStatus.PENDING,
      totalAmount: 100,
      ...overrides,
    }) as Order;

  const adminReq = {
    user: { id: 'admin-1', roles: ['ADMIN'] },
  } as AdminRequest;

  let service: OrdersService;
  let repos: Record<string, ReturnType<typeof mockRepo>>;
  let adminAuditServiceLog: jest.Mock;

  beforeEach(() => {
    repos = {
      orderRepository: mockRepo(),
      orderItemRepository: mockRepo(),
      timelineRepository: mockRepo(),
      paymentRepository: mockRepo(),
      returnRepository: mockRepo(),
      refundRepository: mockRepo(),
      cancelRepository: mockRepo(),
      exchangeRepository: mockRepo(),
      historyRepository: mockRepo(),
      deliveryRepository: mockRepo(),
      analyticsRepository: mockRepo(),
      reportRepository: mockRepo(),
    };
    const dataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
        manager: {
          save: jest.fn((entity: unknown) => Promise.resolve(entity)),
          create: jest.fn((_entity: unknown, values: unknown) => values),
        },
      }),
    } as unknown as DataSource;
    adminAuditServiceLog = jest.fn().mockResolvedValue(undefined);
    const adminAuditService = { log: adminAuditServiceLog };

    service = new OrdersService(
      repos.orderRepository as never,
      repos.orderItemRepository as never,
      repos.timelineRepository as never,
      repos.paymentRepository as never,
      repos.returnRepository as never,
      repos.refundRepository as never,
      repos.cancelRepository as never,
      repos.exchangeRepository as never,
      repos.historyRepository as never,
      repos.deliveryRepository as never,
      repos.analyticsRepository as never,
      repos.reportRepository as never,
      dataSource,
      adminAuditService as never,
    );
  });

  describe('updateOrderStatus', () => {
    it('allows a forward transition (PENDING -> CONFIRMED) and saves', async () => {
      const order = makeOrder();
      repos.orderRepository.findOne.mockResolvedValue(order);
      repos.orderRepository.save.mockResolvedValue({
        ...order,
        status: OrderStatus.CONFIRMED,
      });

      const result = await service.updateOrderStatus(
        'order-1',
        { status: OrderStatus.CONFIRMED },
        adminReq,
      );

      expect(result.order.status).toBe(OrderStatus.CONFIRMED);
      expect(repos.orderRepository.save).toHaveBeenCalledTimes(1);
      expect(repos.timelineRepository.save).toHaveBeenCalled();
      expect(repos.historyRepository.save).toHaveBeenCalled();
      // Every mutation is audit-logged for the admin trail
      expect(adminAuditServiceLog).toHaveBeenCalledWith(
        adminReq,
        'ORDERS',
        'STATUS_UPDATE',
        'Order',
        'order-1',
        expect.stringContaining('ORD-1'),
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('rejects an illegal backwards transition (DELIVERED -> PENDING)', async () => {
      repos.orderRepository.findOne.mockResolvedValue(
        makeOrder({ status: OrderStatus.DELIVERED }),
      );

      await expect(
        service.updateOrderStatus(
          'order-1',
          { status: OrderStatus.PENDING },
          adminReq,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(repos.orderRepository.save).not.toHaveBeenCalled();
    });

    it('rejects a skip transition (PENDING -> DELIVERED)', async () => {
      repos.orderRepository.findOne.mockResolvedValue(makeOrder());

      await expect(
        service.updateOrderStatus(
          'order-1',
          { status: OrderStatus.DELIVERED },
          adminReq,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createRefund', () => {
    it('rejects a refund exceeding the order total', async () => {
      repos.orderRepository.findOne.mockResolvedValue(
        makeOrder({ status: OrderStatus.RETURNED, totalAmount: 100 }),
      );

      await expect(
        service.createRefund('order-1', { amount: 200 }, adminReq),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects a refund on an order that is not returned/cancelled', async () => {
      repos.orderRepository.findOne.mockResolvedValue(
        makeOrder({ status: OrderStatus.PENDING }),
      );

      await expect(
        service.createRefund('order-1', { amount: 50 }, adminReq),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('terminal-state blocking (cancel/assign)', () => {
    it.each([
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.RETURNED,
      OrderStatus.REFUNDED,
      OrderStatus.EXCHANGED,
    ])('blocks cancel on terminal state %s', async (terminalStatus) => {
      repos.orderRepository.findOne.mockResolvedValue(
        makeOrder({ status: terminalStatus }),
      );

      await expect(
        service.cancelOrder('order-1', { reason: 'test' }, adminReq),
      ).rejects.toThrow(BadRequestException);
      expect(repos.cancelRepository.save).not.toHaveBeenCalled();
    });

    it('blocks agent assignment on a delivered order', async () => {
      repos.orderRepository.findOne.mockResolvedValue(
        makeOrder({ status: OrderStatus.DELIVERED }),
      );

      await expect(
        service.assignAgent('order-1', { agentId: 'agent-1' }, adminReq),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOrderById', () => {
    it('throws NotFoundException when the order does not exist', async () => {
      repos.orderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOrderById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

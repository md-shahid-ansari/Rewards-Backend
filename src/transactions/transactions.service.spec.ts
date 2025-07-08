import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from './transactions.schema';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTxnModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken(Transaction.name), useValue: mockTxnModel },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log a transaction', async () => {
    mockTxnModel.create.mockResolvedValue({ category: 'admin' });
    const result = await service.logTransaction({
      userId: 'user123',
      category: 'admin',
      pointsEarned: 30,
    });
    expect(result.data.category).toBe('admin');
  });

  it('should return recent transactions', async () => {
    mockTxnModel.limit.mockResolvedValue([
      { pointsEarned: 20, category: 'admin' },
    ]);

    const result = await service.getRecentTransactions('user123', 1, 5);

    expect(result.message).toBe('Transactions fetched successfully');
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data[0].category).toBe('admin');
  });
});

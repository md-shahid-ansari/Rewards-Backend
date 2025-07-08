import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { RewardsService } from '../rewards/rewards.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Model } from 'mongoose';
import { User } from './users.schema';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockRewardsService = {
    addPoints: jest.fn(),
    getUserPoints: jest.fn(),
  };

  const mockTransactionsService = {
    logTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: RewardsService, useValue: mockRewardsService },
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and add points', async () => {
    const dto = { name: 'Test User', email: 'test@example.com', points: 50 };

    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({ _id: '123', name: dto.name, email: dto.email });
    mockRewardsService.addPoints.mockResolvedValue({});
    mockRewardsService.getUserPoints.mockResolvedValue({ message: 'fetched', points: 50 });

    const result = await service.createUser(dto);

    expect(mockUserModel.create).toHaveBeenCalled();
    expect(mockRewardsService.addPoints).toHaveBeenCalledWith('123', 50);
    expect(result.data.user.email).toEqual(dto.email);
    expect(result.data.totalPoints).toEqual(50);
  });
});

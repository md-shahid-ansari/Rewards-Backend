import { Test, TestingModule } from '@nestjs/testing';
import { RewardsService } from './rewards.service';
import { getModelToken } from '@nestjs/mongoose';
import { Reward } from './rewards.schema';
import { RedemptionsService } from '../redemptions/redemptions.service';

describe('RewardsService', () => {
  let service: RewardsService;

  const mockRewardModel = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockRedemptionsService = {
    recordRedemption: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        { provide: getModelToken(Reward.name), useValue: mockRewardModel },
        { provide: RedemptionsService, useValue: mockRedemptionsService },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user points if record exists', async () => {
    mockRewardModel.findOne.mockResolvedValue({ totalPoints: 120 });
    const result = await service.getUserPoints('user123');
    expect(result).toEqual({ message: expect.any(String), points: 120 });
  });

  it('should throw NotFoundException if no reward record', async () => {
    mockRewardModel.findOne.mockResolvedValue(null);
    await expect(service.getUserPoints('unknown')).rejects.toThrow('No reward record found');
  });

  it('should redeem points and record redemption', async () => {
    mockRewardModel.findOne.mockResolvedValue({ totalPoints: 100, save: jest.fn() });
    mockRedemptionsService.recordRedemption.mockResolvedValue({});
    const result = await service.redeemPoints('user123', 50, 'voucher');
    expect(result.message).toBe('Redemption successful');
    expect(result.remainingPoints).toBe(50);
  });
});

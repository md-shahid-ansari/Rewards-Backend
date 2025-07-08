import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionsService } from './redemptions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Redemption } from './redemptions.schema';

describe('RedemptionsService', () => {
  let service: RedemptionsService;

  const mockRedemptionModel = {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue([{ rewardType: 'gift' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedemptionsService,
        { provide: getModelToken(Redemption.name), useValue: mockRedemptionModel },
      ],
    }).compile();

    service = module.get<RedemptionsService>(RedemptionsService);
  });

  it('should return user redemptions', async () => {
    const result = await service.getUserRedemptions('user123');
    expect(result.message).toBe('Redemption history fetched successfully');
    expect(result.data[0].rewardType).toBe('gift');
  });
});

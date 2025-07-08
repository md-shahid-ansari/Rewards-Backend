import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Redemption } from './redemptions.schema';
import { CreateRedemptionDto } from './dtos/redemptions.dto';

@Injectable()
export class RedemptionsService {
  constructor(
    @InjectModel(Redemption.name)
    private readonly redemptionModel: Model<Redemption>,
  ) {}

  async recordRedemption(data: CreateRedemptionDto) {
    return this.redemptionModel.create(data);
  }

  async getUserRedemptions(userId: string) {
    return this.redemptionModel.find({ userId }).sort({ createdAt: -1 });
  }
}

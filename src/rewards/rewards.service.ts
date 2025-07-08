import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward } from './rewards.schema';
import { RedemptionsService } from '../redemptions/redemptions.service';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    private readonly redemptionsService: RedemptionsService,
  ) {}

  async getUserPoints(userId: string): Promise<number> {
    const record = await this.rewardModel.findOne({ userId });

    if (!record) {
      throw new NotFoundException(`No reward record found for userId: ${userId}`);
    }

    return record.totalPoints;
  }

  async addPoints(userId: string, points: number): Promise<Reward> {
    return this.rewardModel.findOneAndUpdate(
      { userId },
      { $inc: { totalPoints: points } },
      { upsert: true, new: true }
    );
  }

  async redeemPoints(userId: string, points: number, rewardType: string) {
    const reward = await this.rewardModel.findOne({ userId });
    if (!reward || reward.totalPoints < points) {
      throw new Error('Insufficient points');
    }

    reward.totalPoints -= points;
    await reward.save();

    await this.redemptionsService.recordRedemption({
      userId,
      pointsRedeemed: points,
      rewardType,
    });

    return {
      message: 'Redemption successful',
      remainingPoints: reward.totalPoints,
    };
  }
}

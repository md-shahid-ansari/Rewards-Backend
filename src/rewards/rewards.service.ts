import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async getUserPoints(userId: string): Promise<{ message: string; points: number }> {
    try {
      const record = await this.rewardModel.findOne({ userId });

      if (!record) {
        throw new NotFoundException({
          message: `No reward record found for userId: ${userId}`,
        });
      }

      return {
        message: 'User reward points fetched successfully',
        points: record.totalPoints,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to fetch user reward points',
        error: error.message,
      });
    }
  }

  async addPoints(userId: string, points: number): Promise<{ message: string; data: Reward }> {
    try {
      const updated = await this.rewardModel.findOneAndUpdate(
        { userId },
        { $inc: { totalPoints: points } },
        { upsert: true, new: true },
      );

      return {
        message: `Points added successfully to userId: ${userId}`,
        data: updated,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Failed to add reward points',
        error: error.message,
      });
    }
  }

  async redeemPoints(
    userId: string,
    points: number,
    rewardType: string,
  ): Promise<{ message: string; remainingPoints: number }> {
    try {
      const reward = await this.rewardModel.findOne({ userId });

      if (!reward || reward.totalPoints < points) {
        throw new BadRequestException({
          message: 'Insufficient points for redemption',
        });
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
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      throw new InternalServerErrorException({
        message: 'Redemption failed',
        error: error.message,
      });
    }
  }
}

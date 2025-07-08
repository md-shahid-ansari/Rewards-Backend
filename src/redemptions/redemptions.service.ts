import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    try {
      const result = await this.redemptionModel.create(data);

      return {
        message: 'Redemption recorded successfully',
        data: result,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Failed to record redemption',
        error: error.message,
      });
    }
  }

  async getUserRedemptions(userId: string) {
    try {
      const redemptions = await this.redemptionModel
        .find({ userId })
        .sort({ createdAt: -1 });

      if (!redemptions.length) {
        throw new NotFoundException({
          message: `No redemptions found for userId: ${userId}`,
        });
      }

      return {
        message: 'Redemption history fetched successfully',
        data: redemptions,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Failed to fetch user redemptions',
        error: error.message,
      });
    }
  }
}

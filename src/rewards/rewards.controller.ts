import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { GetPointsDto } from './dtos/reward-points.dto';
import { RedeemDto } from './dtos/redeem.dto';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('points')
  async getPoints(@Query() query: GetPointsDto) {
    const points = await this.rewardsService.getUserPoints(query.userId);
    return { userId: query.userId, points };
  }

  @Post('redeem')
  async redeem(@Body() body: RedeemDto) {
    return this.rewardsService.redeemPoints(body.userId, body.points, body.rewardType);
  }
}

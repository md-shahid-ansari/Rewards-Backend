import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RedemptionsService } from './redemptions.service';
import { CreateRedemptionDto } from './dtos/redemptions.dto';

@Controller('rewards/redemptions')
export class RedemptionsController {
  constructor(private readonly redemptionsService: RedemptionsService) {}

  @Post()
  async createRedemption(@Body() body: CreateRedemptionDto) {
    return this.redemptionsService.recordRedemption(body);
  }

  @Get()
  async getRedemptions(@Query('userId') userId: string) {
    return this.redemptionsService.getUserRedemptions(userId);
  }
}

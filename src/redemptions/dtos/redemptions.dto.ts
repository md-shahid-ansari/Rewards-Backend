import { IsString, IsNumber, IsIn } from 'class-validator';

export class CreateRedemptionDto {
  @IsString()
  userId: string;

  @IsNumber()
  pointsRedeemed: number;

  @IsIn(['cashback', 'voucher', 'gift'])
  rewardType: string;
}

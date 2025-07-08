import { IsString, IsNumber, IsIn, Min } from 'class-validator';

export class RedeemDto {
  @IsString()
  userId: string;

  @IsIn(['voucher', 'cashback', 'gift'])
  rewardType: string;

  @IsNumber()
  @Min(1)
  points: number;
}

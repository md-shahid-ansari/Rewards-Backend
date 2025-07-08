import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Redemption extends Document {
  @Prop() userId: string;
  @Prop() pointsRedeemed: number;
  @Prop() rewardType: string; // e.g., 'cashback', 'voucher'
}

export const RedemptionSchema = SchemaFactory.createForClass(Redemption);

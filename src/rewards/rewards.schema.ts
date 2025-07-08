import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: 0 })
  totalPoints: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

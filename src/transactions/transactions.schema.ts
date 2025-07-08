import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop() userId: string;
  @Prop() category: string;
  @Prop() pointsEarned: number;
  @Prop() amount: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

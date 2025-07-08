import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transactions.schema';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private txnModel: Model<Transaction>) {}

  async getRecentTransactions(userId: string, page = 1, limit = 5) {
    return this.txnModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
}

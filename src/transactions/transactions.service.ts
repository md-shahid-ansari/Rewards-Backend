import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transactions.schema';

interface LogTransactionDto {
  userId: string;
  category: string;
  pointsEarned: number;
  amount?: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private txnModel: Model<Transaction>,
  ) {}

  async logTransaction(data: LogTransactionDto): Promise<{ message: string; data: Transaction }> {
    try {
      const transaction = await this.txnModel.create(data);

      return {
        message: 'Transaction logged successfully',
        data: transaction,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Failed to log transaction',
        error: error.message,
      });
    }
  }

  async getRecentTransactions(
    userId: string,
    page = 1,
    limit = 5,
  ): Promise<{ message: string; data: Transaction[] }> {
    try {
      const transactions = await this.txnModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      if (!transactions.length) {
        throw new NotFoundException({
          message: `No transactions found for userId: ${userId}`,
        });
      }

      return {
        message: 'Transactions fetched successfully',
        data: transactions,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException({
        message: 'Failed to fetch transactions',
        error: error.message,
      });
    }
  }
}

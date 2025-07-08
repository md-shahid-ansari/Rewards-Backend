import { Controller, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('rewards/transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  async getTransactions(
    @Query('userId') userId: string,
    @Query('page') page = '1'
  ) {
    const result = await this.service.getRecentTransactions(userId, parseInt(page));
    return result;
  }
}

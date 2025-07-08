import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseConfig } from './config/database.config';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { RewardsModule } from './rewards/rewards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { RedemptionsModule } from './redemptions/redemptions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseConfig,
    RewardsModule,
    TransactionsModule,
    RedemptionsModule,
    UsersModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.asPromise()
      .then(() => console.log('MongoDB connected successfully', this.connection.host))
      .catch((err) => console.error('MongoDB connection error:', err));
  }
}

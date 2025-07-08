import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { RewardsModule } from '../rewards/rewards.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RewardsModule,
    TransactionsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedemptionsService } from './redemptions.service';
import { RedemptionsController } from './redemptions.controller';
import { Redemption, RedemptionSchema } from './redemptions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Redemption.name, schema: RedemptionSchema },
    ]),
  ],
  controllers: [RedemptionsController],
  providers: [RedemptionsService],
  exports: [RedemptionsService],
})
export class RedemptionsModule {}

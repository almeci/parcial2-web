import { Module } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { TravelPlansController } from './travel-plans.controller';
import { TravelPlan, TravelPlanSchema } from './schemas/travel-plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from '../countries/countries.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelPlan.name, schema: TravelPlanSchema },
    ]),
    CountriesModule,
    UsersModule,
  ],
  providers: [TravelPlansService],
  controllers: [TravelPlansController],
})
export class TravelPlansModule {}

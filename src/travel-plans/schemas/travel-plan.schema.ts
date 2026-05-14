import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelPlanDocument = TravelPlan & Document;

@Schema()
export class TravelPlan {
  @Prop({ required: true, unique: false })
  title: string;

  @Prop({ required: true, unique: false })
  startDate: Date;

  @Prop({ required: true, unique: false })
  endDate: Date;

  @Prop({ required: true, unique: false })
  destinationAlphaCode: string;
}

export const TravelPlanSchema = SchemaFactory.createForClass(TravelPlan);

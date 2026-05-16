import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelPlanDocument = TravelPlan & Document;

export class Expense {
  description: string;
  amount: number;
  category: string;
}

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

  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [{ description: String, amount: Number, category: String }],
    default: [],
  })
  expenses: Expense[];
}

export const TravelPlanSchema = SchemaFactory.createForClass(TravelPlan);

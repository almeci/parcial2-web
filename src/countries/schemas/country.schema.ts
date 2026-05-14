import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema()
export class Country {
  @Prop({ required: true, unique: true })
  alphaCode: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: false })
  region: string;

  @Prop({ required: true, unique: false })
  capital: string;

  @Prop({ required: true, unique: false })
  population: number;

  @Prop({ required: true, unique: false })
  flagUrl: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

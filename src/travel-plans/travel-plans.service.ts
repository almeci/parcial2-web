import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelPlan, TravelPlanDocument } from './schemas/travel-plan.schema';
import { CountriesService } from '../countries/countries.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectModel(TravelPlan.name)
    private travelPlanModel: Model<TravelPlanDocument>,
    private countriesService: CountriesService,
  ) {}

  async create(dto: CreateTravelPlanDto): Promise<TravelPlan> {
    await this.countriesService.resolveCountry(dto.destinationAlphaCode);
    const newPlan = new this.travelPlanModel(dto);
    return newPlan.save();
  }

  async findAll(): Promise<TravelPlan[]> {
    return this.travelPlanModel.find().exec();
  }

  async findOne(id: string): Promise<TravelPlan> {
    const plan = await this.travelPlanModel.findById(id).exec();
    if (!plan) throw new NotFoundException(`Couldn't find travel plan ${id}`);
    return plan;
  }

  async remove(id: string): Promise<void> {
    const result = await this.travelPlanModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Couldn't find travel plan ${id}`);
  }

  async addExpense(id: string, dto: CreateExpenseDto): Promise<TravelPlan> {
    const plan = await this.travelPlanModel
      .findByIdAndUpdate(id, { $push: { expenses: dto } }, { new: true })
      .exec();
    if (!plan) throw new NotFoundException(`Couldn't find travel plan ${id}`);
    return plan;
  }
}

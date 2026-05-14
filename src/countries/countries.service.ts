import { Injectable, NotFoundException } from '@nestjs/common';
import { Country, CountryDocument } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/restcountries.provider';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
    private readonly restCountriesProvider: RestCountriesProvider,
  ) {}

  async resolveCountry(alphaCode: string): Promise<Country> {
    const existing = await this.countryModel.findOne({ alphaCode }).exec();
    if (existing) return existing;
    let countryData;
    try {
      countryData = await this.restCountriesProvider.getByAlphaCode(alphaCode);
    } catch {
      throw new NotFoundException(
        `Couldn't find country with code ${alphaCode}`,
      );
    }
    const created = new this.countryModel(countryData);
    await created.save();
    return created;
  }
}

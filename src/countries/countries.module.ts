import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Country, CountrySchema } from './schemas/country.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { RestCountriesProvider } from './providers/restcountries.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    HttpModule,
  ],
  providers: [CountriesService, RestCountriesProvider],
  exports: [CountriesService],
})
export class CountriesModule {}

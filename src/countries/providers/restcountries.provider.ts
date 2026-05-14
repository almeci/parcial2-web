import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RestCountriesProvider {
  constructor(private readonly httpService: HttpService) {}

  async getByAlphaCode(code: string) {
    const url = `https://restcountries.com/v3.1/alpha/${code}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    const country = data[0];
    return {
      alphaCode: country.cca3,
      name: country.name.common,
      region: country.region,
      capital: country.capital?.[0] ?? '',
      population: country.population,
      flagUrl: country.flags.png,
    };
  }
}

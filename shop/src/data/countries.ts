import axios from 'axios';
import { useQuery } from 'react-query';

const fetchCountries = async () => {
  const response = await axios.get('https://restcountries.com/v2/all');
  return response.data.map((country: { name: any; alpha2Code: any; flags: { png: any; }; }) => ({
    name: country.name,
    code: country.alpha2Code, // ISO 2-letter country code
    flag: country.flags.png // Fetch flag in PNG format
  }));
};

export const useCountriesQuery = () => {
  return useQuery('countries', fetchCountries);
};

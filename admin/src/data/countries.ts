import axios from 'axios';
import { useQuery } from 'react-query';


const fetchCountries = async () => {
  const response = await axios.get('https://restcountries.com/v3.1/all');
  console.log(response.data)
  return response.data;
};

export const useCountriesQuery = () => {
  return useQuery('countries', fetchCountries);
};
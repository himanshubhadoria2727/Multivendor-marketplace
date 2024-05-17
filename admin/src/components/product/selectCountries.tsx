import { useCountriesQuery } from '@/data/countries';
import React from 'react';

const SelectCountry = () => {
  const { data: countries, error, isLoading } = useCountriesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading countries</p>;

  return (
    <select name="country" id="country">
      {countries.map((country) => (
        <option key={country.cca3} value={country.cca3}>
          {country.name.common}
        </option>
      ))}
    </select>
  );
};

export default SelectCountry;

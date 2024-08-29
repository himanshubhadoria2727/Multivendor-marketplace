import { useEffect, useState } from 'react';
import axios from 'axios';

const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const countries = response.data.map((country: { name: { common: string; }; }) => ({
                    name: country.name.common,
                    slug: country.name.common.toLowerCase().replace(/\s+/g, '-')
                }));
                countries.sort((a:any, b:any) => a.name.localeCompare(b.name));
                setCountries(countries);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return { countries, loading, error };
};

export default useCountries;

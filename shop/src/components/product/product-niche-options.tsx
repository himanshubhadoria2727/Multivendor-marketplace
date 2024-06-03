import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Product } from '@/types';

type ProductNicheOptionsProps = {
    onChange?: (value: string) => void;
    product: Product;
}

const ProductNicheOptions: React.FC<ProductNicheOptionsProps> = ({ product, onChange }) => {

    const [selectedValue, setSelectedValue] = React.useState('');
    const [noneOptionVisible, setNoneOptionVisible] = React.useState(false);

    const {
        is_niche,
        is_gamble,
        is_cbd,
        is_crypto,
    } = product ?? {};

    const options = [
        { label: 'Casino/Betting/Gambling Link', value: 'gamble', show: is_gamble == '1' },
        { label: 'CBD Link', value: 'cbd', show: is_cbd == '1' },
        { label: 'Cryptocurrency Link', value: 'crypto', show: is_crypto == '1' },
    ];

    console.log('Options:', options);

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        setNoneOptionVisible(true);
        onChange?.(value);
    };

    const handleNoneOptionClick = () => {
        setSelectedValue('');
        setNoneOptionVisible(false);
    };

    return (
        <div className='flex flex-wrap border-brand/80 border-2 p-4 rounded-lg'>
            <div className='w-full md:w-2/3'>
                <FormControl>
                    <FormLabel id="product-niche-options-label" style={{fontSize:"1.2rem",fontWeight:"600",fontFamily:"inherit",color:"#24b47e"}}>Product Niche Options</FormLabel>
                    <p className='mt-2 py-3 text-sm text-brand'>Grey niche consists of CBD, Casino, Betting, Gambling, Adult, Dating, Crypto etc. categories.</p>
                    {is_niche ? (
                        <RadioGroup
                            aria-labelledby="product-niche-options-label"
                            name="product-niche-options-group"
                            value={selectedValue}
                            onChange={(event) => handleOptionClick(event.target.value)}
                        >
                            {options
                                .filter(option => option.show) // Filter options based on their show property
                                .map((option) => (
                                    <FormControlLabel
                                        key={option.value}
                                        value={option.value}
                                        control={<Radio />}
                                        label={option.label}
                                        style={{fontFamily:"inherit", color:"#24b47e", fontWeight:"800"}}
                                    />
                                ))}
                            {noneOptionVisible && (
                                <FormControlLabel
                                    value="" 
                                    control={<Radio />}
                                    label="None"
                                    onClick={handleNoneOptionClick}
                                    className='text-brand font-bold'
                                />
                            )}
                        </RadioGroup>
                    ) : (
                        <div>No niche options available.</div>
                    )}
                </FormControl>
            </div>
            <div className='w-full md:w-1/3 mt-6'>
                <div className='p-3 bg-brand/20 rounded-lg'>
                    <span className='text-lg text-brand font-bold'>Hello Advertiser.</span>
                    <p className='font-medium text-brand/80'>Please mention whether the Link of your Landing Page falls under any of the Grey Niches mentioned. Please note that the price of a Grey Niche Link can be higher as publishers charge extra for them. If your link is found to belong to a Grey Niche, but you have failed to mention the same, your order can get cancelled. Please proceed with the order placement accordingly.</p></div>
            </div>
        </div>
    );
}

export default ProductNicheOptions;

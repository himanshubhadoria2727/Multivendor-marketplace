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
        niche_price,
        is_niche,
        is_gamble,
        is_cbd,
        is_crypto,
        is_betting,
        is_vaping,
        is_rehab,
    } = product ?? {};

    const options = [
        { label: 'Casino/Betting/Gambling Link', value: 'gamble', show: is_gamble == '1' },
        { label: 'CBD Link', value: 'cbd', show: is_cbd == '1' },
        { label: 'Cryptocurrency Link', value: 'crypto', show: is_crypto == '1' },
        { label: 'Betting Link', value: 'betting', show: is_betting == '1' },
        { label: 'Vaping Link', value: 'vaping', show: is_vaping == '1' },
        { label: 'Rehabituation Link', value: 'rehab', show: is_rehab == '1' },
    ];

    console.log('Options:', options);

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        setNoneOptionVisible(true);
        onChange?.(value);
    };

    const handleNoneOptionClick = () => {
        setSelectedValue('none');
        setNoneOptionVisible(false);
        onChange?.('none');
    };
    console.log("is_niche before render", is_niche);
    return (<>
        {is_niche==='1'? (
            <div className='flex flex-wrap border-brand/80 border-2 p-4 rounded-lg'>
                <div className='w-full md:w-2/3'>
                    <FormControl>
                        <FormLabel id="product-niche-options-label" style={{ fontSize: "1.2rem", fontWeight: "600", fontFamily: "inherit", color: "#228CDB" }}>Product Niche Options</FormLabel>
                        <p className='mt-2 py-3 text-sm text-brand'>Grey niche consists of CBD, Casino, Betting, Gambling, Adult, Dating, Crypto etc. categories.</p>

                        <RadioGroup
                            aria-labelledby="product-niche-options-label"
                            name="product-niche-options-group"
                            value={selectedValue}
                            onChange={(event) => handleOptionClick(event.target.value)}
                        >
                            {options
                                .filter(option => option.show) // Filter options based on their show property
                                .map((option) => (
                                    <div className=''>
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.value}
                                            control={<Radio />}
                                            label={option.label}
                                            style={{ fontFamily: "inherit", color: "#228CDB", fontWeight: "800" }}
                                        />
                                        <span className='px-2 py-1 rounded-lg bg-blue-500 text-sm text-white'>${niche_price}</span>
                                    </div>
                                ))}
                            {noneOptionVisible && (
                                <FormControlLabel
                                    key='none'
                                    value="none"
                                    control={<Radio />}
                                    label="None"
                                    onClick={handleNoneOptionClick}
                                    className='text-brand font-bold'
                                />
                            )}
                        </RadioGroup>

                    </FormControl>
                </div>
                <div className='w-full md:w-1/3 mt-6'>
                    <div className='p-3 bg-brand/20 rounded-lg'>
                        <span className='text-lg text-brand font-bold'>Hello Advertiser.</span>
                        <p className='font-medium text-brand/80'>Please mention whether the Link of your Landing Page falls under any of the Grey Niches mentioned. Please note that the price of a Grey Niche Link can be higher as publishers charge extra for them. If your link is found to belong to a Grey Niche, but you have failed to mention the same, your order can get cancelled. Please proceed with the order placement accordingly.</p></div>
                </div>
            </div>
        ) : (
            <div className='text-brand font-semibold text-lg'>No niche options available.</div>
        )}
    </>);
}

export default ProductNicheOptions;

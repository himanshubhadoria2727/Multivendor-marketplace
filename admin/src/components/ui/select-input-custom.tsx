import Select from '@/components/ui/select/select';
import TooltipLabel from '@/components/ui/tooltip-label';
import { Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { GetOptionLabel } from 'react-select';

interface SelectInputProps {
  control: any;
  rules?: any;
  name: string;
  options: object[];
  getOptionLabel?: GetOptionLabel<unknown>;
  getOptionValue?: GetOptionLabel<unknown>;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  [key: string]: unknown;
  placeholder?: string;
  required?: boolean;
  label?: string;
  toolTipText?: string;
  initialValues?: any; // Add this prop for initial values
}

const CustomSelectInput = ({
  control,
  options,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  disabled,
  isMulti,
  isClearable,
  isLoading,
  placeholder,
  label,
  required,
  toolTipText,
  initialValues,
  ...rest
}: SelectInputProps) => {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  // Set initial value when component mounts or when initialValues change
  useEffect(() => {
    if (initialValues) {
      const initialOption = options?.find(
        (option: any) =>
          option.value === initialValues || option.label === initialValues
      );
      setSelectedOption(initialOption || null);
    }
  }, [initialValues, options]); // Re-run when initialValues or options change

  // Handle option change (set selectedOption state when the user selects an option)
  const handleSelectChange = (newValue: any) => {
    setSelectedOption(newValue);
  };

  return (
    <>
      {label && (
        <TooltipLabel
          htmlFor={name}
          toolTipText={toolTipText}
          label={label}
          required={required}
        />
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        // Use `initialValues` as default value for `Controller`
        defaultValue={initialValues || null} // Default to initialValues if no new value is selected
        {...rest}
        render={({ field }) => (
          <Select
            {...field}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            placeholder={placeholder}
            isMulti={isMulti}
            isClearable={isClearable}
            isLoading={isLoading}
            options={options}
            isDisabled={disabled as boolean}
            value={selectedOption || field.value || null} // Ensure field.value is used if no selectedOption
            onChange={(newValue) => {
              handleSelectChange(newValue); // Update the selectedOption state on change
              field.onChange(newValue); // Pass the new value to react-hook-form
            }}
          />
        )}
      />
    </>
  );
};

export default CustomSelectInput;
    